import { validateDomain } from "@/lib/common";
import { ApiError } from "@/lib/errors";
import { invalid } from "@/lib/messages";
import { recordMetric } from "@/lib/metrics";
import { sendAudit } from "@/lib/retraced";
import { deleteTeam, getTeam, throwIfNoTeamAccess, updateTeam } from "models/team";
import { throwIfNotAllowed } from "models/user";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }) {
  try {
    // Get a team by slug
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team", "read");
    const team = await getTeam({ id: teamMember.teamId });
    recordMetric("team.fetched");

    return NextResponse.json({ data: team }, { status: 200 });
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
    //Update a team
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team", "update");
    const {
      name,
      slug,
      domain,
      logo,
      provinceAddress,
      districtAddress,
      wardAddress,
      detailAddress,
      provinceVATBill,
      districtVATBill,
      wardVATBill,
      detailVATBill,
      abbreviation,
      bussinessCode,
      email,
      code,
      facebook,
      phoneNumber,
      zalo,
      localCode
    } = (await req.json()) as {
      name: string;
      slug: string;
      domain: string;
      logo: string;
      provinceAddress: string;
      districtAddress: string;
      wardAddress: string;
      detailAddress: string;
      provinceVATBill: string;
      districtVATBill: string;
      wardVATBill: string;
      detailVATBill: string;
      abbreviation: string;
      bussinessCode: string;
      email: string;
      code: string;
      facebook: string;
      phoneNumber: string;
      zalo: string;
      localCode: number;
    };
    if (domain?.length > 0 && !validateDomain(domain)) {
      throw new ApiError(400, invalid("Tên miền"));
    }

    const updatedTeam = await updateTeam(teamMember.team.slug, {
      name,
      slug,
      domain,
      logo,
      provinceAddress,
      districtAddress,
      wardAddress,
      detailAddress,
      provinceVATBill,
      districtVATBill,
      wardVATBill,
      detailVATBill,
      abbreviation,
      bussinessCode,
      email,
      code,
      facebook,
      phoneNumber,
      zalo,
      localCode
    });

    sendAudit({
      action: "team.update",
      crud: "u",
      user: teamMember.user,
      team: teamMember.team
    });

    recordMetric("team.updated");
    return NextResponse.json({ data: updatedTeam }, { status: 200 });
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
    // Delete a team
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team", "delete");

    await deleteTeam({ id: teamMember.teamId });

    sendAudit({
      action: "team.delete",
      crud: "d",
      user: teamMember.user,
      team: teamMember.team
    });

    recordMetric("team.removed");

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
