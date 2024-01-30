"use client";
import env from "@/lib/env";
import { ParamsWithSlug } from "@/types";
import SchedulePage from "./SchedulePage";

const Schedule = ({ params }: ParamsWithSlug) => {
  const teamFeatures = env.teamFeatures;

  return <SchedulePage slug={params.slug} teamFeatures={teamFeatures} />;
};

export default Schedule;
