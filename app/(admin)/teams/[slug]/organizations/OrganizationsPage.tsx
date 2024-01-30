"use client";

import { Error, Loading } from "@/components/shared";
import { TeamTab } from "@/components/team";
import { Box, Button, Center, Tooltip } from "@mantine/core";
import { IconBinaryTree, IconListTree } from "@tabler/icons-react";
import useTeam from "hooks/useTeam";
import { useState } from "react";
import DataGridViewOrganizations from "./DataGridViewOrganizations";
import TreeViewOrganizations from "./TreeViewOrganizations";

export default function OrganizationsPage({ slug, teamFeatures }) {
  const { isLoading, isError, team } = useTeam(slug);
  const [display, setDisplay] = useState("Dạng cây");

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
      <TeamTab activeTab="organizations" team={team} teamFeatures={teamFeatures} />
      <Center>
        {display === "Dạng cây" ? (
          <Tooltip label="Chế độ hiển thị dạng bảng">
            <Button variant="default" onClick={() => setDisplay("Dạng bảng")}>
              <IconBinaryTree></IconBinaryTree>
            </Button>
          </Tooltip>
        ) : (
          <Tooltip label="Chế độ hiển thị dạng cây">
            <Button variant="default" onClick={() => setDisplay("Dạng cây")}>
              <IconListTree></IconListTree>
            </Button>
          </Tooltip>
        )}
      </Center>
      <Box mt="md">
        {display === "Dạng cây" ? <TreeViewOrganizations team={team} /> : <DataGridViewOrganizations team={team} />}
      </Box>
    </>
  );
}
