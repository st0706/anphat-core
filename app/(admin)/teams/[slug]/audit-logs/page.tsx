import AuditLog from "@/components/team/AuditLogs";
import { getServerAuthSession } from "@/server/auth";
import env from "@/lib/env";
import { getViewerToken } from "@/lib/retraced";
import { ParamsWithSlug } from "@/types";
import { getTeamMember } from "models/team";
import { throwIfNotAllowed } from "models/user";

const Events = async ({ params }: ParamsWithSlug) => {
  const session = await getServerAuthSession();
  const slug = params.slug;
  if (!env.teamFeatures.auditLog) {
    return {
      notFound: true
    };
  }
  const retracedHost = env.retraced.url ?? "";
  const teamFeatures = env.teamFeatures;
  const teamMember = await getTeamMember(session?.user.id as string, slug as string);
  throwIfNotAllowed(teamMember, "team_audit_log", "read");

  const auditLogToken = await getViewerToken(teamMember.team.id, session?.user.id as string);

  return (
    <AuditLog
      slug={slug}
      retracedHost={retracedHost}
      teamFeatures={teamFeatures}
      auditLogToken={auditLogToken}
      teamMember={teamMember}
    />
  );
};

export default Events;
