"use client";

import { Error } from "@/components/shared";
import { AccessControl } from "@/components/shared/AccessControl";
import { RemoveTeam, TeamSettings, TeamTab } from "@/components/team";
import { Stack } from "@mantine/core";
import useTeam from "hooks/useTeam";

export function SettingPage({ slug, teamFeatures }) {
  const { isLoading, isError, team } = useTeam(slug);

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!team) {
    return <Error message="Không tìm thấy bệnh viện" />;
  }

  return (
    <>
      <TeamTab activeTab="settings" team={team} teamFeatures={teamFeatures} />
      <Stack>
        <TeamSettings team={team} />
        <AccessControl resource="team" actions={["delete"]}>
          <RemoveTeam team={team} />
        </AccessControl>
      </Stack>
    </>
  );
}
