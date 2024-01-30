"use client";

import { Error, Loading } from "@/components/shared";
import { throwIfNotAllowed } from "@/models/user";
import { Card } from "@mantine/core";
import useCanAccess from "hooks/useCanAccess";
import useTeam from "hooks/useTeam";
import dynamic from "next/dynamic";
import TeamTab from "./TeamTab";

interface RetracedEventsBrowserProps {
  host: string;
  auditLogToken: string;
  header: string;
}

const RetracedEventsBrowser = dynamic<RetracedEventsBrowserProps>(() => import("@retracedhq/logs-viewer"), {
  ssr: false
});
export default function AuditLog({ slug, teamMember, auditLogToken, teamFeatures, retracedHost }) {
  const { canAccess } = useCanAccess();
  const { isLoading, isError, team } = useTeam(slug);
  throwIfNotAllowed(teamMember, "team_audit_log", "read");

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError?.message} />;
  }

  if (!team) {
    return <Error message="Không tìm thấy bệnh viện" />;
  }

  return (
    <>
      <TeamTab activeTab="audit-logs" team={team} teamFeatures={teamFeatures} />
      <Card radius="md" withBorder>
        <Card.Section>
          {canAccess("team_audit_log", ["read"]) && auditLogToken && (
            <RetracedEventsBrowser
              host={`${retracedHost}/viewer/v1`}
              auditLogToken={auditLogToken}
              header="Nhật ký hoạt động"
            />
          )}
        </Card.Section>
      </Card>
    </>
  );
}
