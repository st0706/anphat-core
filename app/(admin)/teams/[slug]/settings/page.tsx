import { SettingPage } from "@/components/team/SettingPage";
import env from "@/lib/env";

const SettingsPage = ({ params }: { params: { slug: string } }) => {
  const teamFeatures = env.teamFeatures;

  return <SettingPage slug={params.slug} teamFeatures={teamFeatures} />;
};

export default SettingsPage;
