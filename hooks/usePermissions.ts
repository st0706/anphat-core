"use client";

import fetcher from "@/lib/fetcher";
import type { Permission } from "@/lib/permissions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import type { ApiResponse } from "types";

const usePermissions = () => {
  const [teamSlug, setTeamSlug] = useState<string | null>(null);
  const slugs = useParams();
  var slug;
  if (slugs) slug = slugs["slug"];

  useEffect(() => {
    if (slug) {
      setTeamSlug(slug);
    }
  }, [slug]);

  const { data, error, isLoading } = useSWR<ApiResponse<Permission[]>>(
    teamSlug ? `/api/teams/${teamSlug}/permissions` : null,
    fetcher
  );

  return {
    isLoading,
    isError: error,
    permissions: data?.data
  };
};

export default usePermissions;
