import StaffPage from "@/app/(admin)/teams/[slug]/staffs/StaffPage";
import { ParamsWithSlug } from "@/types";
import env from "@/lib/env";
import { TrpcProvider } from "@/app/(admin)/TrpcProvider";

export default function TeamStaffPage({ params }: ParamsWithSlug) {
  const teamFeatures = env.teamFeatures;

  return (
    <TrpcProvider>
      <StaffPage slug={params.slug} teamFeatures={teamFeatures} />
    </TrpcProvider>
  );
}
