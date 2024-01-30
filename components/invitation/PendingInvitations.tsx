"use client";

import { Error, LetterAvatar } from "@/components/shared";
import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { localeDate } from "@/lib/datatime";
import { Button, Card, Table, Text } from "@mantine/core";
import { Invitation, Team } from "@prisma/client";
import useInvitations from "hooks/useInvitations";

const PendingInvitations = ({ team }: { team: Team }) => {
  const { notifyResult } = useNotify();
  const { confirmDelete } = useModal();

  const { isLoading, isError, invitations, mutateInvitation } = useInvitations(team.slug);

  /* if (isLoading) {
    return <Loading />;
  } */

  if (isError) {
    return <Error message={isError.message} />;
  }

  const deleteInvitation = async (invitation: Invitation | null) => {
    if (!invitation) return;

    const sp = new URLSearchParams({ id: invitation.id });

    const response = await fetch(`/api/teams/${team.slug}/invitations?${sp.toString()}`, {
      method: "DELETE",
      headers: defaultHeaders
    });

    const json = await response.json();

    if (!response.ok) {
      notifyResult(Action.Delete, "lời mời", false, json.message);
      return;
    }

    mutateInvitation();
    notifyResult(Action.Delete, "lời mời", true);
  };

  if (!invitations || !invitations.length) {
    return null;
  }

  return (
    <>
      <Card radius="md" withBorder>
        <Text fw={500} size="lg">
          Lời mời đang chờ xử lý
        </Text>
        <Text c="dimmed" size="sm" mt="xs">
          Lời mời đã được gửi tới người dùng nhưng chưa được xác nhận.
        </Text>
        <Table verticalSpacing="xs" mt="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th colSpan={2}>Email</Table.Th>
              <Table.Th>Vai trò</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {invitations.map((invitation) => {
              return (
                <Table.Tr key={invitation.token}>
                  <Table.Td colSpan={2}>
                    <div className="flex items-center justify-start space-x-2">
                      <LetterAvatar name={invitation.email} />
                      <span>{invitation.email}</span>
                    </div>
                  </Table.Td>
                  <Table.Td>{invitation.role}</Table.Td>
                  <Table.Td>{localeDate(invitation.createdAt)}</Table.Td>
                  <Table.Td>
                    <Button
                      size="sm"
                      color="red"
                      variant="outline"
                      onClick={() =>
                        confirmDelete(
                          "lời mời",
                          () => deleteInvitation(invitation),
                          invitation.email,
                          DeleteAction.Delete,
                          "Xóa lời mời sẽ ngăn thành viên tham gia tổ chức sau này."
                        )
                      }>
                      Xóa
                    </Button>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>
    </>
  );
};

export default PendingInvitations;
