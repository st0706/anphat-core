"use client";

import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { Button, Card, Group, Text } from "@mantine/core";
import { Team } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ApiResponse } from "types";

const RemoveTeam = ({ team }: { team: Team }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { notifyResult } = useNotify();
  const { confirmDelete } = useModal();

  const removeTeam = async () => {
    setLoading(true);

    const response = await fetch(`/api/teams/${team.slug}`, {
      method: "DELETE",
      headers: defaultHeaders
    });

    const json = (await response.json()) as ApiResponse;

    setLoading(false);

    if (!response.ok) {
      notifyResult(Action.Delete, "bệnh viện", false, json.error?.message);
      return;
    }

    notifyResult(Action.Delete, "bệnh viện", true);
    router.push("/teams");
  };

  return (
    <>
      <Card radius="md" withBorder>
        <Text fw={500} size="lg">
          Xóa bệnh viện
        </Text>
        <Text mt="xs" c="dimmed" size="sm">
          Xóa bệnh viện sẽ xóa tất cả tài nguyên và dữ liệu liên quan đến bệnh viện này. Hành động này không thể hoàn
          tác.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button
            color="red"
            onClick={() =>
              confirmDelete(
                "bệnh viện",
                () => removeTeam(),
                team.name,
                DeleteAction.Delete,
                "Thao tác xóa sẽ xóa tất cả tài nguyên và dữ liệu liên quan đến bệnh viện này."
              )
            }
            loading={loading}
            variant="outline">
            Xóa bệnh viện
          </Button>
        </Group>
      </Card>
    </>
  );
};

export default RemoveTeam;
