"use client";

import { MRT_Localization_VI } from "@/hooks/useCustomTable";
import { api } from "@/server/api";
import { DataGrid, TreeNode } from "@/types";
import { ActionIcon, Button, Card, Flex, Group, Stack, Text, Tooltip } from "@mantine/core";
import { Organization, Team } from "@prisma/client";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { useMemo, useState } from "react";
import { LetterAvatar, Loading } from "../../../../../components/shared";
import CreateOrganizationModal from "./CreateOrganizationModal";
import UpdateOrganizationModal from "./UpdateOrganizationModal";
import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";

const ORGANIZATION = "đơn vị trực thuộc";

function buildDataToGrid(data: Organization[], parentId: string | null = null): DataGrid[] {
  const tree: DataGrid[] = [];
  data.forEach((item) => {
    if (item.parentId === parentId || (parentId === null && item.parentId === "null")) {
      const subRows = buildDataToGrid(data, item.id);
      const node: DataGrid = {
        id: item.id,
        parentId: item.parentId,
        name: item.name,
        logo: item.logo,
        subRows,
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

export default function DataGridViewOrganizations({ team }: { team: Team }) {
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

  const columns = useMemo<MRT_ColumnDef<DataGrid>[]>(
    () => [
      {
        accessorKey: "organizationId",
        header: "ID"
      },
      {
        accessorKey: "name",
        header: "Tên"
      },
      {
        accessorKey: "abbreviation",
        header: "Tên viết tắt"
      },
      {
        accessorKey: "phoneNumber",
        header: "Số điện thoại"
      },
      {
        accessorKey: "email",
        header: "Email"
      },
      {
        accessorKey: "website",
        header: "Website"
      },
      {
        accessorFn: (row) => row,
        header: "Logo",
        Cell: ({ cell }) => (
          <LetterAvatar size={70} name={cell.getValue<DataGrid>().name} url={cell.getValue<DataGrid>().logo} />
        )
      },
      {
        accessorFn: (row) => row,
        header: "Thao tác",
        Cell: ({ cell }) => (
          <Flex gap="md" rowGap={"sm"} align={"center"} justify={"start"}>
            <Tooltip label={`Tạo mới ${ORGANIZATION} của đơn vị này`}>
              <ActionIcon
                onClick={() => {
                  setShowModalCreate(true);
                  setOrganization(cell.getValue<DataGrid>());
                }}>
                <IconPlus />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Xem/Chỉnh sửa">
              <ActionIcon
                onClick={() => {
                  setShowModalUpdate(true);
                  setOrganization(cell.getValue<DataGrid>());
                }}>
                <IconEdit />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Xoá">
              <ActionIcon
                color="red"
                onClick={() =>
                  confirmDelete(
                    ORGANIZATION,
                    () => handleDelete(cell.getValue<DataGrid>().id),
                    cell.getValue<DataGrid>().name,
                    DeleteAction.Delete,
                    `Tất cả ${ORGANIZATION} bên trong cũng sẽ bị xóa`
                  )
                }>
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          </Flex>
        )
      }
    ],
    []
  );

  const [ShowModalCreate, setShowModalCreate] = useState<boolean>(false);
  const [ShowModalUpdate, setShowModalUpdate] = useState<boolean>(false);
  const [organization, setOrganization] = useState<DataGrid | TreeNode | null>(null);

  let { data, isLoading, isFetching } = api.organization.getAll.useQuery({
    teamId: team.id
  });

  if (isLoading || isFetching) {
    return <Loading />;
  }

  const dataRender: DataGrid[] = buildDataToGrid(data || []);

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
              Danh sách {ORGANIZATION} (dạng bảng).
            </Text>
          </Stack>
          <Button
            variant="outline"
            onClick={() => {
              setShowModalCreate(true);
              setOrganization(null);
            }}>
            Thêm {ORGANIZATION} gốc
          </Button>
          <MantineReactTable
            columns={columns}
            data={dataRender}
            enableExpandAll
            enableExpanding
            filterFromLeafRows
            initialState={{ expanded: true }}
            paginateExpandedRows
            localization={MRT_Localization_VI}
          />
        </Group>
      </Card>
    </>
  );
}
