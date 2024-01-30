"use client";

import TableRowActions from "@/components/table/TableRowActions";
import TableToolbar from "@/components/table/TableToolbar";
import { useCustomTable } from "@/hooks/useCustomTable";
import useModal from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import useTeam from "@/hooks/useTeam";
import { api } from "@/server/api";
import { Anchor, Paper, Stack, Title } from "@mantine/core";
import { Staff } from "@prisma/client";
import { MRT_ColumnDef, MRT_PaginationState, MantineReactTable } from "mantine-react-table";
import "mantine-react-table/styles.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Error } from "../../../../../components/shared";
import TeamTab from "../../../../../components/team/TeamTab";

export default function StaffPage({ slug, teamFeatures }) {
  const { isLoading: isLoadingTeam, isError: isErrorTeam, team } = useTeam(slug);
  const utils = api.useUtils();
  const { notifyResult } = useNotify();
  const { confirmDelete } = useModal();
  const [globalFilter, setGlobalFilter] = useState("");

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const { data, isLoading, isError } = api.staff.get.useQuery({
    teamId: team?.id!,
    searchKey: globalFilter || "",
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  });

  const { mutateAsync: deleteStaff, isLoading: isDeleting } = api.staff.delete.useMutation({
    onSuccess: async () => {
      await utils.staff.invalidate();
      notifyResult(Action.Delete, "nhân sự", true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, "nhân sự", false, e.message);
    }
  });
  const router = useRouter();

  const handleDelete = async (staff: Staff) => {
    if (!staff) return;

    await deleteStaff({ staffId: staff.id });
  };

  const columns = useMemo<MRT_ColumnDef<Staff>[]>(
    () => [
      {
        accessorKey: "staffID",
        header: "Mã nhân sự"
      },
      {
        accessorFn: (row) => row,
        header: "Họ tên",
        Cell: ({ cell }) => (
          <Anchor component={Link} href={`staffs/${cell.getValue<Staff>().staffID}`} fw={500}>
            {cell.getValue<Staff>().familyName + " " + cell.getValue<Staff>().name}
          </Anchor>
        )
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
        accessorKey: "organizationName",
        header: "Tên tổ chức"
      }
    ],
    []
  );
  const table = useCustomTable<Staff>({
    columns,
    data: data?.queryData ?? [],
    rowCount: data?.rowCount,
    state: {
      isLoading,
      globalFilter,
      pagination,
      showAlertBanner: isError || isErrorTeam,
      showProgressBars: isLoading || isLoadingTeam || isDeleting // || isImporting || isDeletingAll
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getRowId: (row) => row.staffID,
    renderRowActions: ({ row }) => (
      <TableRowActions
        onUpdate={() => router.push(`staffs/${row.id}`)}
        onDelete={() => confirmDelete("nhân sự", () => handleDelete(row.original), row.original.name)}
      />
    ),
    renderTopToolbar: () => <TableToolbar table={table} onCreate={() => router.push(`staffs/create`)} />
  });

  if (isErrorTeam) {
    return <Error message={isErrorTeam.message} />;
  }

  if (!team) {
    return <Error message="Không tìm thấy nhân sự" />;
  }

  return (
    <Stack>
      <TeamTab activeTab="staffs" team={team} teamFeatures={teamFeatures} />
      <Stack>
        <Paper withBorder radius="md">
          <Title order={3} mt="md" px="md">
            Danh sách nhân sự
          </Title>
          <MantineReactTable table={table} />
        </Paper>
      </Stack>
    </Stack>
  );
}
