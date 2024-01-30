"use client";

import { useCustomTable } from "@/hooks/useCustomTable";
import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Variant } from "@/hooks/useNotify";
import useTeams from "@/hooks/useTeams";
import { defaultHeaders, slugify } from "@/lib/common";
import { HOSPITAL, createTitle } from "@/lib/messages";
import { Anchor, Button, Group, Paper, TextInput, Title, rem } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Team } from "@prisma/client";
import { IconCirclePlus, IconDoorExit, IconSearch } from "@tabler/icons-react";
import { MRT_ColumnDef, MRT_ToggleFullScreenButton, MantineReactTable } from "mantine-react-table";
import "mantine-react-table/styles.css";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CreateTeam from "./CreateTeam";

const TeamPage = () => {
  const { teams, isError, isLoading, mutateTeams } = useTeams();
  const [search, setSearch] = useState("");
  const [searchedTeams, setSearchedTeams] = useState(teams);
  const { newTeam } = useParams();
  const { notify } = useNotify();
  const { confirmDelete } = useModal();

  useEffect(() => {
    setSearchedTeams(teams);
  }, [teams]);

  useEffect(() => {
    if (newTeam) {
      handleCreate();
    }
  }, [newTeam]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    const query = slugify(value);
    setSearchedTeams(
      teams?.filter((item) => {
        if (slugify(item.name).includes(query)) return item;
      })
    );
  };

  const handleCreate = () => {
    const modalId = "create-manufacturer";
    modals.open({
      modalId: modalId,
      title: createTitle(HOSPITAL),
      centered: true,
      closeOnClickOutside: false,
      children: <CreateTeam onClose={() => modals.close(modalId)} />
    });
  };

  const leaveTeam = async (team: Team) => {
    const response = await fetch(`/api/teams/${team.slug}/members`, {
      method: "PUT",
      headers: defaultHeaders
    });

    const json = await response.json();

    if (!response.ok) {
      notify(json.message, Variant.Error);
      return;
    }

    notify("Bạn đã rời tổ chức thành công.");
    mutateTeams();
  };

  const columns = useMemo<MRT_ColumnDef<Team>[]>(
    () => [
      {
        accessorFn: (row) => row,
        header: "Tên bệnh viện",
        Cell: ({ cell }) => (
          <Anchor component={Link} href={`/teams/${cell.getValue<Team>().slug}/settings`} fw={500}>
            {cell.getValue<Team>().name}
          </Anchor>
        )
      },
      {
        accessorKey: "slug",
        header: "Đường dẫn"
      },
      {
        accessorKey: "domain",
        header: "Tên miền"
      },
      {
        accessorKey: "address",
        header: "Địa chỉ"
      }
    ],
    []
  );

  const table = useCustomTable<Team>({
    columns,
    data: searchedTeams ?? [],
    rowCount: searchedTeams?.length ?? 0,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isLoading
    },
    enableGlobalFilter: false,
    renderRowActions: ({ row }) => (
      <Button
        variant="light"
        size="xs"
        color="red"
        onClick={() =>
          confirmDelete(
            "bệnh viện",
            () => leaveTeam(row.original),
            row.original.name,
            DeleteAction.Leave,
            "Bạn sẽ mất quyền truy cập vào tất cả các tài nguyên và dữ liệu liên quan đến bệnh viện."
          )
        }
        leftSection={<IconDoorExit size={18} />}>
        Rời khỏi
      </Button>
    ),
    renderTopToolbar: () => {
      return (
        <Group justify="space-between" wrap="wrap" mb="xs">
          <TextInput
            placeholder="Nhập tên bệnh viện cần tìm"
            miw={"40%"}
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />
          <Group gap="xs">
            <Button color="teal" leftSection={<IconCirclePlus size={18} />} onClick={handleCreate}>
              Thêm mới
            </Button>
            <MRT_ToggleFullScreenButton table={table} />
          </Group>
        </Group>
      );
    }
  });

  return (
    <Paper withBorder radius="md">
      <Title order={3} mt="md" px="md">
        Danh sách bệnh viện
      </Title>

      <MantineReactTable table={table} />
    </Paper>
  );
};

export default TeamPage;
