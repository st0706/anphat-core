import { ApiError } from "@/lib/errors";
import { sendAudit } from "@/lib/retraced";
import { findOrCreateApp, findWebhook, updateWebhook } from "@/lib/svix";
import { throwIfNoTeamAccess } from "models/team";
import { throwIfNotAllowed } from "models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { EndpointIn } from "svix";
import { recordMetric } from "@/lib/metrics";
import env from "@/lib/env";
import { NextResponse } from "next/server";
import { invalid } from "@/lib/messages";

export async function GET(req: Request, { params }) {
  try {
    if (!env.teamFeatures.webhook) {
      throw new ApiError(404, "Không tìm thấy");
    }
    // Get a Webhook
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team_webhook", "read");

    const { searchParams } = new URL(req.url);
    const endpointId = searchParams.get("endpointId");

    const app = await findOrCreateApp(teamMember.team.name, teamMember.team.id);

    if (!app) {
      throw new ApiError(200, invalid("Yêu cầu"));
    }

    const webhook = await findWebhook(app.id, endpointId as string);

    recordMetric("webhook.fetched");
    return NextResponse.json({ data: webhook }, { status: 200 });
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
    if (!env.teamFeatures.webhook) {
      throw new ApiError(404, "Không tìm thấy");
    }
    // Update a Webhook
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team_webhook", "update");

    const { searchParams } = new URL(req.url);
    const endpointId = searchParams.get("endpointId");
    const { name, url, eventTypes } = (await req.json()) as {
      name: string;
      url: string;
      eventTypes: any;
    };
    const app = await findOrCreateApp(teamMember.team.name, teamMember.team.id);

    if (!app) {
      throw new ApiError(200, invalid("Yêu cầu"));
    }

    if (!endpointId) {
      throw new ApiError(200, invalid("Yêu cầu"));
    }

    const data: EndpointIn = {
      description: name,
      url,
      version: 1
    };

    if (eventTypes.length > 0) {
      data["filterTypes"] = eventTypes;
    }

    const webhook = await updateWebhook(app.id, endpointId, data);

    sendAudit({
      action: "webhook.update",
      crud: "u",
      user: teamMember.user,
      team: teamMember.team
    });

    recordMetric("webhook.updated");

    return NextResponse.json({ data: webhook }, { status: 200 });
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
