"use client";

import useTeams from "hooks/useTeams";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();
  const { teams, isLoading } = useTeams();

  useEffect(() => {
    if (isLoading || !teams) {
      return;
    }

    if (teams.length > 0) {
      router.push(`/teams/${teams[0].slug}/settings`);
    } else {
      router.push("teams?newTeam=true");
    }
  }, [isLoading, router, teams]);

  return null;
};

export default Dashboard;
