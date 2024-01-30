import env from "@/lib/env";
import { ApiError } from "@/lib/errors";
import { invalid } from "@/lib/messages";
import { recordMetric } from "@/lib/metrics";
import { sendAudit } from "@/lib/retraced";
import { createWebhook, deleteWebhook, findOrCreateApp, listWebhooks } from "@/lib/svix";
import { throwIfNoTeamAccess } from "models/team";
import { throwIfNotAllowed } from "models/user";
import { NextResponse } from "next/server";
import { EndpointIn } from "svix";

export async function GET(req: Request, { params }) {
  try {
    if (!env.teamFeatures.webhook) {
      throw new ApiError(404, "Không tìm thấy");
    }
    // Get all webhooks created by a team
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team_webhook", "read");

    const app = await findOrCreateApp(teamMember.team.name, teamMember.team.id);

    if (!app) {
      throw new ApiError(400, invalid("Yêu cầu", "Vui lòng thêm khóa API Svix."));
    }

    const webhooks = await listWebhooks(app.id);

    recordMetric("webhook.fetched");
    return NextResponse.json({ data: webhooks?.data || [] }, { status: 200 });
  } catch (error: any) {
    const message = error?.message || "Đã xảy ra lỗi";
    const status = error?.status || 500;
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
    if (!env.teamFeatures.webhook) {
      throw new ApiError(404, "Không tìm thấy");
    }
    // Create a Webhook endpoint
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team_webhook", "create");

    const { name, url, eventTypes } = (await req.json()) as {
      name: string;
      url: string;
      eventTypes: any;
    };
    const app = await findOrCreateApp(teamMember.team.name, teamMember.team.id);

    // TODO: The endpoint URL must be HTTPS.

    const data: EndpointIn = {
      description: name,
      url,
      version: 1
    };

    if (eventTypes.length) {
      data["filterTypes"] = eventTypes;
    }

    if (!app) {
      throw new ApiError(400, invalid("Yêu cầu"));
    }

    const endpoint = await createWebhook(app.id, data);

    sendAudit({
      action: "webhook.create",
      crud: "c",
      user: teamMember.user,
      team: teamMember.team
    });

    recordMetric("webhook.created");

    return NextResponse.json({ data: endpoint }, { status: 200 });
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
    if (!env.teamFeatures.webhook) {
      throw new ApiError(404, "Không tìm thấy");
    }
    // Delete a webhook
    const teamMember = await throwIfNoTeamAccess(req, params.slug);
    throwIfNotAllowed(teamMember, "team_webhook", "delete");

    const { searchParams } = new URL(req.url);
    const webhookId = searchParams.get("webhookId");
    const app = await findOrCreateApp(teamMember.team.name, teamMember.team.id);

    if (!app) {
      throw new ApiError(400, invalid("Yêu cầu"));
    }

    if (!webhookId) {
      throw new ApiError(400, invalid("Yêu cầu"));
    }

    if (app.uid != teamMember.team.id) {
      throw new ApiError(400, invalid("Yêu cầu"));
    }

    await deleteWebhook(app.id, webhookId);

    sendAudit({
      action: "webhook.delete",
      crud: "d",
      user: teamMember.user,
      team: teamMember.team
    });

    recordMetric("webhook.removed");

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
