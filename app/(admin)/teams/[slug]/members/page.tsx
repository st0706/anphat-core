import MemberPage from "@/components/team/MemberPage";
import env from "@/lib/env";
import { ParamsWithSlug } from "@/types";

const TeamMembers = ({ params }: ParamsWithSlug) => {
  const teamFeatures = env.teamFeatures;

  return <MemberPage slug={params.slug} teamFeatures={teamFeatures} />;
};

export default TeamMembers;
