import { getServerAuthSession } from "@/server/auth";
import { sendTeamInviteEmail } from "@/lib/email/sendTeamInviteEmail";
import { ApiError } from "@/lib/errors";
import { recordMetric } from "@/lib/metrics";
import { db } from "@/server/db";
import { sendAudit } from "@/lib/retraced";
import { sendEvent } from "@/lib/svix";
import { Role } from "@prisma/client";
import { createInvitation, deleteInvitation, getInvitation, getInvitations } from "models/invitation";
import { addTeamMember, throwIfNoTeamAccess } from "models/team";
import { throwIfNotAllowed } from "models/user";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }) {
  try {
    // Get all invitations for a team
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team_invitation", "read");

    const invitations = await getInvitations(teamMember.teamId);

    recordMetric("invitation.fetched");
    return NextResponse.json({ data: invitations }, { status: 200 });
  } catch (error: any) {
    const message = error.message || "Đã xảy ra lỗi";
    const status = error.status || 500;
    return new NextResponse(
      JSON.stringify({
        status,
        message
      }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }) {
  try {
    // Invite a user to a team
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team_invitation", "create");
    const { email, role } = (await req.json()) as {
      email: string;
      role: Role;
    };

    const invitationExists = await db.invitation.findFirst({
      where: {
        email,
        teamId: teamMember.teamId
      }
    });

    if (invitationExists) {
      throw new ApiError(400, "Email này đã tồn tại lời mời!");
    }

    const invitation = await createInvitation({
      teamId: teamMember.teamId,
      invitedBy: teamMember.userId,
      email,
      role
    });

    await sendEvent(teamMember.teamId, "invitation.created", invitation);

    await sendTeamInviteEmail(teamMember.team, invitation);

    sendAudit({
      action: "member.invitation.create",
      crud: "c",
      user: teamMember.user,
      team: teamMember.team
    });

    recordMetric("invitation.created");

    return NextResponse.json({ data: invitation }, { status: 200 });
  } catch (error: any) {
    const message = error.message || "Đã xảy ra lỗi";
    const status = error.status || 500;
    return new NextResponse(
      JSON.stringify({
        status,
        message
      }),
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    // Invite a user to a team
    const { inviteToken } = (await req.json()) as {
      inviteToken: string;
    };
    const session = await getServerAuthSession();
    const userId = session?.user?.id as string;

    const invitation = await getInvitation({ token: inviteToken });

    const teamMember = await addTeamMember(invitation.team.id, userId, invitation.role);

    await sendEvent(invitation.team.id, "member.created", teamMember);

    await deleteInvitation({ token: inviteToken });

    recordMetric("member.created");
    return NextResponse.json({ data: {} }, { status: 200 });
  } catch (error: any) {
    const message = error.message || "Đã xảy ra lỗi";
    const status = error.status || 500;
    return new NextResponse(
      JSON.stringify({
        status,
        message
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }) {
  try {
    // Delete invitation
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team_invitation", "delete");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const invitation = await getInvitation({ id });
      if (invitation.invitedBy != teamMember.user.id || invitation.teamId != teamMember.teamId) {
        throw new ApiError(400, `Bạn không có quyền xóa lời mời này.`);
      }

      await deleteInvitation({ id });

      sendAudit({
        action: "member.invitation.delete",
        crud: "d",
        user: teamMember.user,
        team: teamMember.team
      });

      await sendEvent(teamMember.teamId, "invitation.removed", invitation);

      recordMetric("invitation.removed");

      return NextResponse.json({ data: {} }, { status: 200 });
    } else {
      throw new ApiError(400, "Missing id");
    }
  } catch (error: any) {
    const message = error.message || "Đã xảy ra lỗi";
    const status = error.status || 500;
    return new NextResponse(
      JSON.stringify({
        status,
        message
      }),
      { status: 500 }
    );
  }
}
