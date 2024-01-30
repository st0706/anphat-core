import type { Team } from "@prisma/client";
import { Client } from "@retracedhq/retraced";
import type { CRUD, Event } from "@retracedhq/retraced";
import type { User } from "next-auth";

import env from "./env";

export type EventType =
  | "member.invitation.create"
  | "member.invitation.delete"
  | "member.remove"
  | "member.update"
  | "webhook.create"
  | "webhook.delete"
  | "webhook.update"
  | "team.create"
  | "team.update"
  | "team.delete";

type Request = {
  action: EventType;
  user: User;
  team: Team;
  crud: CRUD;
  // target: Target;
};

let retracedClient: Client;

const getRetracedClient = () => {
  if (!env.retraced.apiKey || !env.retraced.projectId || !env.retraced.url) {
    return;
  }

  if (!retracedClient) {
    retracedClient = new Client({
      endpoint: env.retraced.url,
      apiKey: env.retraced.apiKey,
      projectId: env.retraced.projectId
    });
  }

  return retracedClient;
};

export const sendAudit = async (request: Request) => {
  const retracedClient = getRetracedClient();

  if (!retracedClient) {
    return;
  }

  const { action, user, team, crud } = request;

  const event: Event = {
    action,
    crud,
    group: {
      id: team.id,
      name: team.name
    },
    actor: {
      id: user.id,
      name: user.name as string
    },
    created: new Date()
  };

  return await retracedClient.reportEvent(event);
};

export const getViewerToken = async (groupId: string, actorId: string) => {
  const retracedClient = getRetracedClient();

  if (!retracedClient) {
    return;
  }

  try {
    return await retracedClient.getViewerToken(groupId, actorId, true);
  } catch (_error) {
    throw new Error("Không thể nhận mã thông báo của người xem từ Retraced. Vui lòng kiểm tra cấu hình Retraced.");
  }
};
