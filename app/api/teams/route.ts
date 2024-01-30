import { getServerAuthSession } from "@/server/auth";
import { slugify } from "@/lib/common";
import { ApiError } from "@/lib/errors";
import { recordMetric } from "@/lib/metrics";
import { createTeam, getTeams, isTeamExists } from "models/team";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Get teams
    const session = await getServerAuthSession();

    const teams = await getTeams(session?.user.id as string);

    recordMetric("team.fetched");
    return NextResponse.json({ data: teams }, { status: 200 });
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

export async function POST(req: Request) {
  try {
    // Create a team
    const { name } = (await req.json()) as {
      name: string;
    };
    const session = await getServerAuthSession();
    const slug = slugify(name);

    if (await isTeamExists([{ slug }])) {
      throw new ApiError(400, "Đã tồn tại bệnh viện với tên này.");
    }

    const team = await createTeam({
      userId: session?.user?.id as string,
      name,
      slug
    });

    recordMetric("team.created");

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
