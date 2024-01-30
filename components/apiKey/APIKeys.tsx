"use client";

import { WithLoadingAndError } from "@/components/shared";
import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { localeDate } from "@/lib/datatime";
import fetcher from "@/lib/fetcher";
import { Alert, Badge, Button, Card, Group, Stack, Table, Text } from "@mantine/core";
import type { ApiKey, Team } from "@prisma/client";
import { IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";
import useSWR from "swr";
import type { ApiResponse } from "types";
import NewAPIKey from "./NewAPIKey";

interface APIKeysProps {
  team: Team;
}

const APIKeys = ({ team }: APIKeysProps) => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const { notifyResult } = useNotify();
  const { confirmDelete } = useModal();

  // Fetch API Keys
  const { data, isLoading, error, mutate } = useSWR<{ data: ApiKey[] }>(`/api/teams/${team.slug}/api-keys`, fetcher);

  // Delete API Key
  const deleteApiKey = async (apiKey: ApiKey | null) => {
    if (!apiKey) return;

    const res = await fetch(`/api/teams/${team.slug}/api-keys/${apiKey.id}`, {
      method: "DELETE"
    });

    const { data, error } = (await res.json()) as ApiResponse<null>;

    if (error) {
      notifyResult(Action.Delete, "khóa API", false, error.message);
      return;
    }

    if (data) {
      mutate();
      notifyResult(Action.Delete, "khóa API", true);
    }
  };

  const apiKeys = data?.data ?? [];

  return (
    <WithLoadingAndError isLoading={isLoading} error={error}>
      <Card radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Stack gap="xs">
            <Text fw={500} size="lg">
              Khóa API
            </Text>
            <Text c="dimmed" size="sm">
              Khóa API dùng để xác thực gọi API từ ứng dụng khác.
            </Text>
          </Stack>
          <Button variant="outline" onClick={() => setCreateModalVisible(true)}>
            Tạo khóa API
          </Button>
        </Group>
        {apiKeys.length === 0 ? (
          <Alert title="Bạn chưa tạo Khóa API nào" icon={<IconInfoCircle />}>
            Khóa API cho phép ứng dụng khác của bạn giao tiếp với AnPhat Core
          </Alert>
        ) : (
          <>
            <Table verticalSpacing="xs">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tên</Table.Th>
                  <Table.Th>Trạng thái</Table.Th>
                  <Table.Th>Ngày tạo</Table.Th>
                  <Table.Th>Thao tác</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {apiKeys.map((apiKey) => {
                  return (
                    <Table.Tr key={apiKey.id}>
                      <Table.Td>{apiKey.name}</Table.Td>
                      <Table.Td>
                        <Badge color="green">Hoạt động</Badge>
                      </Table.Td>
                      <Table.Td>{localeDate(apiKey.createdAt)}</Table.Td>
                      <Table.Td>
                        <Button
                          size="xs"
                          color="red"
                          variant="outline"
                          onClick={() =>
                            confirmDelete("khóa API", () => deleteApiKey(apiKey), apiKey.name, DeleteAction.Revoke)
                          }>
                          Thu hồi
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </>
        )}
      </Card>
      <NewAPIKey team={team} createModalVisible={createModalVisible} setCreateModalVisible={setCreateModalVisible} />
    </WithLoadingAndError>
  );
};

export default APIKeys;
