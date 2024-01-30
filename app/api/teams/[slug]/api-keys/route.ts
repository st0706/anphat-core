import { createApiKey, fetchApiKeys } from "models/apiKey";
import { throwIfNoTeamAccess } from "models/team";
import { throwIfNotAllowed } from "models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { recordMetric } from "@/lib/metrics";
import env from "@/lib/env";
import { ApiError } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }) {
  try {
    if (!env.teamFeatures.apiKey) {
      throw new ApiError(404, "Không tìm thấy");
    }
    // Get API keys
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team_api_key", "read");

    const apiKeys = await fetchApiKeys(teamMember.teamId);

    recordMetric("apikey.fetched");
    return NextResponse.json({ data: apiKeys }, { status: 200 });
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
    if (!env.teamFeatures.apiKey) {
      throw new ApiError(404, "Không tìm thấy");
    }
    // Create an API key
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team_api_key", "create");

    const { name } = (await req.json()) as {
      name: string;
    };
    const apiKey = await createApiKey({
      name,
      teamId: teamMember.teamId
    });

    recordMetric("apikey.created");
    return NextResponse.json({ data: apiKey }, { status: 200 });
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
