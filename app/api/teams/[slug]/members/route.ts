import { ApiError } from "@/lib/errors";
import { db } from "@/server/db";
import { sendAudit } from "@/lib/retraced";
import { sendEvent } from "@/lib/svix";
import { Role } from "@prisma/client";
import { getTeamMembers, removeTeamMember, throwIfNoTeamAccess } from "models/team";
import { throwIfNotAllowed } from "models/user";
import { recordMetric } from "@/lib/metrics";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }) {
  try {
    // Get members of a team
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team_member", "read");

    const members = await getTeamMembers(teamMember.team.slug);

    recordMetric("member.fetched");
    return NextResponse.json({ data: members }, { status: 200 });
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
    // Delete the member from the team
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team_member", "delete");

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");
    if (memberId) {
      const teamMemberRemoved = await removeTeamMember(teamMember.teamId, memberId);

      await sendEvent(teamMember.teamId, "member.removed", teamMemberRemoved);

      sendAudit({
        action: "member.remove",
        crud: "d",
        user: teamMember.user,
        team: teamMember.team
      });

      recordMetric("member.removed");

      return NextResponse.json({ data: {} }, { status: 200 });
    } else {
      throw new ApiError(400, "Missing memberId");
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

export async function PUT(req: Request, { params }) {
  try {
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team", "leave");

    const totalTeamOwners = await db.teamMember.count({
      where: {
        role: Role.OWNER,
        teamId: teamMember.teamId
      }
    });

    if (totalTeamOwners <= 1) {
      throw new ApiError(400, "Bệnh viện phải có ít nhất một chủ sở hữu");
    }

    await removeTeamMember(teamMember.teamId, teamMember.user.id);

    recordMetric("member.left");
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

export async function PATCH(req: Request, { params }) {
  try {
    // Update the role of a member
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team_member", "update");

    const { memberId, role } = (await req.json()) as {
      memberId: string;
      role: Role;
    };
    const memberUpdated = await db.teamMember.update({
      where: {
        teamId_userId: {
          teamId: teamMember.teamId,
          userId: memberId
        }
      },
      data: {
        role
      }
    });

    sendAudit({
      action: "member.update",
      crud: "u",
      user: teamMember.user,
      team: teamMember.team
    });

    recordMetric("member.role.updated");
    return NextResponse.json({ data: memberUpdated }, { status: 200 });
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
