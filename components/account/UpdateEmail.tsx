"use client";

import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders, validateEmail } from "@/lib/common";
import { invalid } from "@/lib/messages";
import { Button, Card, Group, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { User } from "@prisma/client";
import { useState } from "react";
import type { ApiResponse } from "types";

const UpdateEmail = ({ user }: { user: User }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notifyResult } = useNotify();

  const form = useForm({
    initialValues: {
      email: user.email
    },
    validateInputOnBlur: true,
    validate: {
      email: (value) => {
        if (value === "" || value === null) {
          return null;
        } else {
          return validateEmail(value) ? null : invalid("Email");
        }
      }
    }
  });

  async function handleSubmit(values) {
    setIsSubmitting(true);

    const response = await fetch("/api/users", {
      method: "PUT",
      headers: defaultHeaders,
      body: JSON.stringify(values)
    });

    const json = (await response.json()) as ApiResponse<User>;
    setIsSubmitting(false);

    if (!response.ok) {
      notifyResult(Action.Update, "email", false, json.error.message);
      return;
    }

    notifyResult(Action.Update, "email", true);
    form.resetDirty();
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Card radius="md" withBorder>
        <Text fw={500} size="lg">
          Địa chỉ email
        </Text>
        <Text mt="xs" c="dimmed" size="sm">
          Địa chỉ email dùng để đăng nhập vào tài khoản của bạn.
        </Text>
        <TextInput
          mt="md"
          type="email"
          name="email"
          placeholder="Email của bạn"
          {...form.getInputProps("email")}
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

export default UpdateEmail;
