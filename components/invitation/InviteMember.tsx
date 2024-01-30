"use client";

import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { invalid, required } from "@/lib/messages";
import { availableRoles } from "@/lib/permissions";
import { Button, Group, Input, Modal, Stack } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import type { Team } from "@prisma/client";
import useInvitations from "hooks/useInvitations";
import { useState } from "react";

const InviteMember = ({
  visible,
  setVisible,
  team
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  team: Team;
}) => {
  const { mutateInvitation } = useInvitations(team.slug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notifyResult } = useNotify();

  const form = useForm({
    initialValues: {
      email: "",
      role: availableRoles[0].id
    },
    validateInputOnBlur: true,
    validate: {
      email: isEmail(invalid("Email")),
      role: (val) =>
        val.length === 0
          ? required("vai trò", "chọn")
          : availableRoles.some((role) => JSON.stringify(role.id) === JSON.stringify(val))
            ? null
            : "Vai trò không tồn tại"
    }
  });

  const handleSubmit = async (values: { email: string; role: "ADMIN" | "OWNER" | "MEMBER" }) => {
    setIsSubmitting(true);
    const response = await fetch(`/api/teams/${team.slug}/invitations`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(values)
    });

    const json = await response.json();

    if (!response.ok) {
      notifyResult(Action.Submit, "lời mời", false, json.message);
      form.reset();
      setIsSubmitting(false);
      return;
    }

    notifyResult(Action.Submit, "lời mời", true);
    mutateInvitation();
    setVisible(false);
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <Modal opened={visible} onClose={() => setVisible(false)} title="Mời thành viên mới">
      <form onSubmit={form.onSubmit(handleSubmit)} method="POST">
        <Stack>
          <p>Mời thành viên mới qua email tham gia tổ chức của bạn.</p>
          <Input
            name="email"
            className="flex-grow"
            color={form.isTouched("email") && form.errors ? "error" : undefined}
            placeholder="email@pacs.store"
            required
            {...form.getInputProps("email")}
          />
          <select
            className="select-bordered select flex-grow rounded"
            name="role"
            {...form.getInputProps("role")}
            required>
            {availableRoles.map((role) => (
              <option value={role.id} key={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {form.isTouched("email") && form.errors.email && (
            <span
              className="text-red-600"
              style={{
                position: "absolute",
                left: 30,
                bottom: 55,
                fontSize: "0.75em"
              }}>
              {form.errors.email}
            </span>
          )}
        </Stack>
        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={isSubmitting} disabled={!form.isDirty}>
            Gửi lời mời
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default InviteMember;
