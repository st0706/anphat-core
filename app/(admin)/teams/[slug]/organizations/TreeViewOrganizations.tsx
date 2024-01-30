"use client";

import { LetterAvatar, Loading } from "@/components/shared";
import { api } from "@/server/api";
import { DataGrid, TreeNode } from "@/types";
import { Box, Button, Card, Divider, Grid, Group, Menu, Stack, Text, rem } from "@mantine/core";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { Organization, Team } from "@prisma/client";
import { IconChevronDown, IconChevronRight, IconEdit, IconFilePlus, IconFileX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import CreateOrganizationModal from "./CreateOrganizationModal";
import UpdateOrganizationModal from "./UpdateOrganizationModal";
import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";

const ORGANIZATION = "đơn vị trực thuộc";

function buildDataToTree(data: Organization[], parentId: string | null = null): TreeNode[] {
  const tree: TreeNode[] = [];
  data.forEach((item) => {
    if (item.parentId === parentId || (parentId === null && item.parentId === "null")) {
      const children = buildDataToTree(data, item.id);
      const node: TreeNode = {
        id: item.id,
        parentId: item.parentId,
        name: item.name,
        logo: item.logo,
        children,
        teamId: item.teamId,
        organizationId: item.organizationId,
        abbreviation: item.abbreviation,
        phoneNumber: item.phoneNumber,
        email: item.email,
        provinceAddress: item.provinceAddress,
        districtAddress: item.districtAddress,
        wardAddress: item.wardAddress,
        detailAddress: item.detailAddress,
        provinceVATBill: item.provinceVATBill,
        districtVATBill: item.districtVATBill,
        wardVATBill: item.wardVATBill,
        detailVATBill: item.detailVATBill,
        website: item.website
      };
      tree.push(node);
    }
  });
  return tree;
}

export default function TreeViewOrganizations({ team }: { team: Team }) {
  const { confirmDelete } = useModal();
  const { notifyResult } = useNotify();

  const context = api.useUtils();
  const deleteOrganization = api.organization.delete.useMutation({
    onSuccess: async () => {
      await context.organization.getAll.invalidate();
      notifyResult(Action.Delete, ORGANIZATION, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, ORGANIZATION, false, e.message);
    }
  });

  const handleDelete = async (organizationId) => {
    if (organizationId) {
      const objId = {
        id: organizationId
      };
      await deleteOrganization.mutate(objId);
    }
  };

  let { data, isLoading, isFetching } = api.organization.getAll.useQuery({
    teamId: team.id
  });

  const [ShowModalCreate, setShowModalCreate] = useState<boolean>(false);
  const [ShowModalUpdate, setShowModalUpdate] = useState<boolean>(false);
  const [ShowViewDetail, setShowViewDetail] = useState<boolean>(false);
  const [organization, setOrganization] = useState<TreeNode | DataGrid | null>(null);
  const [opened, setOpened] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0
  });
  const [dataTarget, setDataTarget] = useState<TreeNode | null>(null);

  const { data: getOrganization } = api.organization.get.useQuery({
    id: organization?.parentId
  });

  useEffect(() => {
    const handleClick = () => setOpened(false);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  if (isLoading || isFetching) {
    return <Loading />;
  }

  const handleOnRightClick = (e, node) => {
    e.preventDefault();
    e.stopPropagation();
    setOpened(true);
    setPoints({
      x: e.pageX,
      y: e.pageY
    });
    setDataTarget(node);
  };

  const dataRender: TreeNode[] = buildDataToTree(data || []);
  function renderTree(nodes) {
    return (
      <>
        {nodes.map((node) => (
          <React.Fragment key={node.id}>
            <TreeItem
              onContextMenu={(e) => handleOnRightClick(e, node)}
              key={node.id}
              nodeId={node.id}
              label={node.name}
              onClick={() => {
                setShowViewDetail(true);
                setOrganization(node);
              }}>
              {Array.isArray(node.children) && node.children.length > 0 ? renderTree(node.children) : null}
            </TreeItem>
          </React.Fragment>
        ))}
      </>
    );
  }

  const handleCloseModal = () => {
    setOrganization(null);
    setShowViewDetail(false);
  };

  return (
    <>
      <CreateOrganizationModal
        ShowModalCreate={ShowModalCreate}
        setShowModalCreate={setShowModalCreate}
        organization={organization}
        setOrganization={setOrganization}
        team={team}
      />
      <UpdateOrganizationModal
        ShowModalUpdate={ShowModalUpdate}
        setShowModalUpdate={setShowModalUpdate}
        organization={organization}
        setOrganization={setOrganization}
        team={team}
      />
      <Card radius="md" withBorder>
        <Group justify="space-between" mb={20}>
          <Stack gap="xs">
            <Text fw={500} size="lg">
              Đơn vị trực thuộc
            </Text>
            <Text c="dimmed" size="sm">
              Danh sách đơn vị trực thuộc (dạng cây). Bấm chuột phải để thực hiện các thao tác
            </Text>
          </Stack>
          <Button
            variant="outline"
            onClick={() => {
              setShowModalCreate(true);
              setOrganization(null);
            }}>
            Thêm đơn vị trực thuộc gốc
          </Button>
        </Group>
        <Card radius={"xs"} withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
              <Box style={{ minHeight: 110, flexGrow: 1, maxWidth: 300 }}>
                <TreeView
                  aria-label="rich object"
                  defaultCollapseIcon={<IconChevronDown />}
                  defaultExpanded={["root"]}
                  defaultExpandIcon={<IconChevronRight />}>
                  {renderTree(dataRender)}
                  <Menu opened={opened} onChange={setOpened} shadow="md" width={200}>
                    <Menu.Dropdown style={{ top: `${points.y}px`, left: `${points.x}px` }}>
                      <Menu.Item
                        onClick={() => {
                          setShowModalCreate(true);
                          setOrganization(dataTarget);
                        }}
                        leftSection={<IconFilePlus style={{ width: rem(14), height: rem(14) }} />}>
                        Thêm đơn vị trực thuộc con
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        onClick={() => {
                          setShowModalUpdate(true);
                          setOrganization(dataTarget);
                        }}
                        leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                        Sửa đơn vị trực thuộc
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        onClick={() =>
                          confirmDelete(
                            ORGANIZATION,
                            () => handleDelete(dataTarget?.id),
                            dataTarget?.name,
                            DeleteAction.Delete,
                            `Tất cả ${ORGANIZATION} bên trong cũng sẽ bị xóa`
                          )
                        }
                        leftSection={<IconFileX style={{ width: rem(14), height: rem(14) }} />}>
                        Xóa đơn vị trực thuộc
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </TreeView>
              </Box>
              <Divider orientation="horizontal" hiddenFrom="md"></Divider>
            </Grid.Col>
            <Divider orientation="vertical" visibleFrom="md" />
            <Grid.Col span={{ base: 12, md: 8.5, lg: 8.5 }}>
              {ShowViewDetail && (
                <>
                  {organization && (
                    <Box>
                      <Text mb={"lg"} fw={700} ta="center" size="xl">
                        Thông tin chi tiết {organization?.name}
                      </Text>
                      <Stack ml={50} justify="center">
                        <Group align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            ID:{" "}
                          </Text>
                          <Text size="lg">{organization.organizationId}</Text>
                        </Group>
                        <Group align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            Tên:{" "}
                          </Text>
                          <Text size="lg">{organization.name}</Text>
                        </Group>
                        <Group gap={100} align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            Logo:{" "}
                          </Text>
                          <LetterAvatar size={70} name={organization.name} url={organization.logo} />
                        </Group>
                        <Group align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            Đơn vị cấp trên:{" "}
                          </Text>
                          <Text size="lg">{getOrganization?.name ? getOrganization?.name : "Không có"}</Text>
                        </Group>
                        <Group align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            Thuộc bệnh viện:{" "}
                          </Text>
                          <Text size="lg">{team.name}</Text>
                        </Group>
                        <Group align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            Tên viết tắt:{" "}
                          </Text>
                          <Text size="lg">{organization.abbreviation}</Text>
                        </Group>
                        <Group align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            Số điện thoại:{" "}
                          </Text>
                          <Text size="lg">{organization.phoneNumber}</Text>
                        </Group>
                        <Group align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            Email:{" "}
                          </Text>
                          <Text size="lg">{organization.email}</Text>
                        </Group>
                        <Group align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            Địa chỉ:{" "}
                          </Text>
                          <Text size="lg">
                            {organization.detailAddress} {organization.wardAddress && `- ${organization.wardAddress}`}{" "}
                            {organization.districtAddress && `- ${organization.districtAddress}`}{" "}
                            {organization.provinceAddress && `- ${organization.provinceAddress}`}
                          </Text>
                        </Group>
                        <Group align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            Địa chỉ hóa đơn:{" "}
                          </Text>
                          <Text size="lg">
                            {organization.detailVATBill} {organization.wardVATBill && `- ${organization.wardVATBill}`}{" "}
                            {organization.districtVATBill && `- ${organization.districtVATBill}`}{" "}
                            {organization.provinceVATBill && `- ${organization.provinceVATBill}`}
                          </Text>
                        </Group>
                        <Group align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            Website:{" "}
                          </Text>
                          <Text size="lg">{organization.website}</Text>
                        </Group>
                      </Stack>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "5rem"
                        }}>
                        <Button size="md" onClick={() => handleCloseModal()} justify="center" my={15} variant="default">
                          Đóng
                        </Button>
                      </div>
                    </Box>
                  )}
                </>
              )}
            </Grid.Col>
          </Grid>
        </Card>
      </Card>
    </>
  );
}
