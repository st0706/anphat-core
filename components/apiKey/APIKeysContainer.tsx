"use client";

import { Error, Loading } from "@/components/shared";
import { TeamTab } from "@/components/team";
import useTeam from "hooks/useTeam";
import { TeamFeature } from "types";
import APIKeys from "./APIKeys";

const APIKeysContainer = ({ teamFeatures, slug }: { teamFeatures: TeamFeature; slug: string }) => {
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
      <TeamTab activeTab="api-keys" team={team} teamFeatures={teamFeatures} />
      <APIKeys team={team} />
    </>
  );
};

export default APIKeysContainer;
