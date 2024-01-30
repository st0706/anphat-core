import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { required } from "@/lib/messages";
import { Button, Card, Group, PasswordInput, Text } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";

const UpdatePassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notifyResult } = useNotify();

  const form = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: ""
    },
    validateInputOnBlur: true,
    validate: {
      newPassword: isNotEmpty(required("mật khẩu mới"))
    }
  });

  async function handleSubmit(values) {
    setIsSubmitting(true);

    const response = await fetch("/api/password", {
      method: "PUT",
      headers: defaultHeaders,
      body: JSON.stringify(values)
    });

    const json = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      notifyResult(Action.Update, "mật khẩu", false, json.message);
      return;
    }

    notifyResult(Action.Update, "mật khẩu", true);
    form.reset();
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Card radius="md" withBorder>
        <Text fw={500} size="lg">
          Mật khẩu
        </Text>
        <Text mt="xs" c="dimmed" size="sm">
          Bạn có thể thay đổi mật khẩu tại đây.
        </Text>
        <PasswordInput
          mt="md"
          label="Mật khẩu hiện tại"
          name="currentPassword"
          placeholder="Nhập mật khẩu hiện tại"
          {...form.getInputProps("currentPassword")}
        />
        <PasswordInput
          mt="md"
          label="Mật khẩu mới"
          name="newPassword"
          placeholder="Nhập mật khẩu mới"
          {...form.getInputProps("newPassword")}
        />
        <Group justify="flex-end" mt="md">
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting} disabled={!form.isDirty()}>
              Đổi mật khẩu
            </Button>
          </div>
        </Group>
      </Card>
    </form>
  );
};

export default UpdatePassword;
