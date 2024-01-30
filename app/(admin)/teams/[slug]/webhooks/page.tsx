import { WebhookListPage } from "@/components/team/WebHookListPage";
import env from "@/lib/env";
import { ParamsWithSlug } from "@/types";

const WebhookList = ({ params }: ParamsWithSlug) => {
  if (!env.teamFeatures.webhook) {
    return {
      notFound: true
    };
  }
  const teamFeatures = env.teamFeatures;

  return <WebhookListPage slug={params.slug} teamFeatures={teamFeatures} />;
};

export default WebhookList;
