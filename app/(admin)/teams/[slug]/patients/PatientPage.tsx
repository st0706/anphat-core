"use client";

import { Error, Loading } from "@/components/shared";
import { TeamTab } from "@/components/team";
import useTeam from "@/hooks/useTeam";
import PatientList from "./patientList";
const PatientPage = ({ slug, teamFeatures }) => {
  const { isLoading, isError, team } = useTeam(slug);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!team) {
    return <Error message="Không tìm thấy bệnh viện" />;
  }

  return (
    <>
      <TeamTab activeTab="patients" team={team} teamFeatures={teamFeatures} />
      <PatientList />
    </>
  );
};

export default PatientPage;
