"use client";

import { Error, Loading } from "@/components/shared";
import { TeamTab } from "@/components/team";
import { Webhooks } from "@/components/webhook";
import useTeam from "hooks/useTeam";

export function WebhookListPage({ teamFeatures, slug }) {
  const { isLoading, isError, team } = useTeam(slug);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!team) {
    return <Error message="Không tìm thấy bệnh viện" />;
  }

  return (
    <>
      <TeamTab activeTab="webhooks" team={team} teamFeatures={teamFeatures} />
      <Webhooks team={team} />
    </>
  );
}
