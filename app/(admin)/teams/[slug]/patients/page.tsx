"use client";
import env from "@/lib/env";
import { ParamsWithSlug } from "@/types";
import PatientPage from "./PatientPage";

const Patients = ({ params }: ParamsWithSlug) => {
  const teamFeatures = env.teamFeatures;

  return <PatientPage slug={params.slug} teamFeatures={teamFeatures} />;
};

export default Patients;
