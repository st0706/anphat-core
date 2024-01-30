import fetcher from "@/lib/fetcher";
import type { Team } from "@prisma/client";
import useSWR from "swr";
import type { ApiResponse } from "types";

const useTeam = (slug?: string) => {
  const teamSlug = slug;

  const { data, error, isLoading } = useSWR<ApiResponse<Team>>(teamSlug ? `/api/teams/${teamSlug}` : null, fetcher);

  return {
    isLoading,
    isError: error,
    team: data?.data
  };
};

export default useTeam;
