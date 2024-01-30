"use client";

import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { required } from "@/lib/messages";
import { Button, Card, Group, Input, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";

const UpdateName = ({ user }: { user: User }) => {
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notifyResult } = useNotify();

  const form = useForm({
    initialValues: {
      name: user.name
    },
    validateInputOnBlur: true,
    validate: {
      name: (values) => (values === "" ? required("tên") : null)
    }
  });

  async function handleSubmit(values) {
    setIsSubmitting(true);

    const response = await fetch("/api/users", {
      method: "PUT",
      headers: defaultHeaders,
      body: JSON.stringify(values)
    });

    const json = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      notifyResult(Action.Update, "tên", false, json.error.message);
      return;
    }

    notifyResult(Action.Update, "tên", true);
    form.resetDirty();
    setIsSubmitting(false);

    await update({
      ...session,
      user: {
        ...session?.user,
        name: json.data.name
      }
    });
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Card radius="md" withBorder>
        <Text fw={500} size="lg">
          Tên
        </Text>
        <Text mt="xs" c="dimmed" size="sm">
          Tên của bạn hiển thị trong giao diện.
        </Text>
        <Input
          mt="md"
          type="text"
          name="name"
          placeholder="Tên của bạn"
          {...form.getInputProps("name")}
          className="w-full max-w-md"
          required
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={isSubmitting} disabled={!form.isDirty() || !form.isValid()}>
            Lưu thay đổi
          </Button>
        </Group>
      </Card>
    </form>
  );
};

export default UpdateName;
