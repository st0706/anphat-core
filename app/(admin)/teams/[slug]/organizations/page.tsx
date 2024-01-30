import OrganizationsPage from "@/app/(admin)/teams/[slug]/organizations/OrganizationsPage";
import env from "@/lib/env";
import { ParamsWithSlug } from "@/types";

const Organizations = ({ params }: ParamsWithSlug) => {
  const teamFeatures = env.teamFeatures;

  return <OrganizationsPage slug={params.slug} teamFeatures={teamFeatures} />;
};

export default Organizations;
