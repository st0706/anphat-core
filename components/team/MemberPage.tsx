"use client";

import { PendingInvitations } from "@/components/invitation";
import { Error, Loading } from "@/components/shared";
import { Members, TeamTab } from "@/components/team";
import useTeam from "hooks/useTeam";

export default function MemberPage({ slug, teamFeatures }) {
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
      <TeamTab activeTab="members" team={team} teamFeatures={teamFeatures} />
      <div className="space-y-6">
        <Members team={team} />
        <PendingInvitations team={team} />
      </div>
    </>
  );
}
