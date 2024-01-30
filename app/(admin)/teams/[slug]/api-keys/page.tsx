import APIKeysContainer from "@/components/apiKey/APIKeysContainer";
import env from "@/lib/env";
import { ParamsWithSlug } from "@/types";

const APIKeys = ({ params }: ParamsWithSlug) => {
  if (!env.teamFeatures.apiKey) {
    return {
      notFound: true
    };
  }
  const teamFeatures = env.teamFeatures;
  return <APIKeysContainer teamFeatures={teamFeatures} slug={params.slug} />;
};

export default APIKeys;
