import { permissions } from "@/lib/permissions";
import { throwIfNoTeamAccess } from "models/team";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }) {
  try {
    // Get permissions for a team for the current user
    const teamRole = await throwIfNoTeamAccess(req, params.slug);
    return NextResponse.json({ data: permissions[teamRole.role] }, { status: 200 });
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

// Get permissions for a team for the current user
const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const teamRole = await throwIfNoTeamAccess(req, res);

  res.json({ data: permissions[teamRole.role] });
};
