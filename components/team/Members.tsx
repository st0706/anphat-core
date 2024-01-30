"use client";

import { InviteMember } from "@/components/invitation";
import { Error, LetterAvatar, Loading } from "@/components/shared";
import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { Button, Card, Group, Stack, Table, Text } from "@mantine/core";
import { Team, TeamMember } from "@prisma/client";
import useCanAccess from "hooks/useCanAccess";
import useTeamMembers from "hooks/useTeamMembers";
import { useSession } from "next-auth/react";
import { useState } from "react";
import type { ApiResponse } from "types";
import UpdateMemberRole from "./UpdateMemberRole";

const Members = ({ team }: { team: Team }) => {
  const { data: session } = useSession();
  const { canAccess } = useCanAccess();
  const [visible, setVisible] = useState(false);
  const { notifyResult } = useNotify();
  const { confirmDelete } = useModal();
  const { isLoading, isError, members, mutateTeamMembers } = useTeamMembers(team.slug);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!members) {
    return null;
  }

  const removeTeamMember = async (member: TeamMember | null) => {
    if (!member) return;

    const sp = new URLSearchParams({ memberId: member.userId });

    const response = await fetch(`/api/teams/${team.slug}/members?${sp.toString()}`, {
      method: "DELETE",
      headers: defaultHeaders
    });

    const json = (await response.json()) as ApiResponse;

    if (!response.ok) {
      notifyResult(Action.Delete, "thành viên", false, json.error?.message);
      return;
    }

    mutateTeamMembers();
    notifyResult(Action.Delete, "thành viên", true);
  };

  const canUpdateRole = (member: TeamMember) => {
    return session?.user.id != member.userId && canAccess("team_member", ["update"]);
  };

  const canRemoveMember = (member: TeamMember) => {
    return session?.user.id != member.userId && canAccess("team_member", ["delete"]);
  };

  return (
    <>
      <Card radius="md" withBorder>
        <Group justify="space-between">
          <Stack gap="xs">
            <Text fw={500} size="lg">
              Thành viên
            </Text>
            <Text c="dimmed" size="sm">
              Danh sách thành viên và vai trò.
            </Text>
          </Stack>
          <Button variant="outline" onClick={() => setVisible(!visible)}>
            Thêm thành viên
          </Button>
        </Group>
        <Table verticalSpacing="xs" mt="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Tên</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Vai trò</Table.Th>
              {canAccess("team_member", ["delete"]) && <Table.Th>Thao tác</Table.Th>}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {members.map((member) => {
              return (
                <Table.Tr key={member.id}>
                  <Table.Td>
                    <div className="flex items-center justify-start space-x-2">
                      <LetterAvatar name={member.user.name} />
                      <span>{member.user.name}</span>
                    </div>
                  </Table.Td>
                  <Table.Td>{member.user.email}</Table.Td>
                  <Table.Td>
                    {canUpdateRole(member) ? (
                      <UpdateMemberRole team={team} member={member} />
                    ) : (
                      <span>{member.role}</span>
                    )}
                  </Table.Td>
                  <Table.Td>
                    {canRemoveMember(member) ? (
                      <Button
                        size="sm"
                        color="red"
                        variant="outline"
                        onClick={() =>
                          confirmDelete(
                            "lời mời",
                            () => removeTeamMember(member),
                            member.user.name,
                            DeleteAction.Delete,
                            "Xóa một thành viên sẽ xóa tất cả hoạt động liên quan đến thành viên đó."
                          )
                        }>
                        Xóa
                      </Button>
                    ) : (
                      <span>-</span>
                    )}
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>
      <InviteMember visible={visible} setVisible={setVisible} team={team} />
    </>
  );
};

export default Members;
