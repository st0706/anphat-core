import env from "@/lib/env";
import { ApiError } from "@/lib/errors";
import { recordMetric } from "@/lib/metrics";
import { deleteApiKey } from "models/apiKey";
import { throwIfNoTeamAccess } from "models/team";
import { throwIfNotAllowed } from "models/user";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }) {
  try {
    if (!env.teamFeatures.apiKey) {
      throw new ApiError(404, "Không tìm thấy");
    }

    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team_api_key", "delete");

    const { searchParams } = new URL(req.url);
    const apiKeyId = searchParams.get("apiKeyId");
    if (apiKeyId) {
      await deleteApiKey(apiKeyId);

      recordMetric("apikey.removed");
      return NextResponse.json({ data: {} }, { status: 200 });
    } else {
      throw new ApiError(400, "Missing apiKeyId");
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
