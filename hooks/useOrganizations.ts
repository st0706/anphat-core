import fetcher from "@/lib/fetcher";
import type { Organization } from "@prisma/client";
import useSWR, { mutate } from "swr";
import type { ApiResponse } from "types";

const useTeamOrganizations = (slug: string) => {
  const url = `/api/teams/${slug}/organizations`;

  const { data, error, isLoading } = useSWR<ApiResponse<Organization[]>>(url, fetcher);

  const mutateTeamOrganizations = async () => {
    mutate(url);
  };

  return {
    isLoading,
    isError: error,
    members: data?.data,
    mutateTeamOrganizations
  };
};

export default useTeamOrganizations;
