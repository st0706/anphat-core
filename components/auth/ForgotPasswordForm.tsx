"use client";
import useCSR from "@/hooks/useCSR";
import useNotify, { Variant } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { invalid, required } from "@/lib/messages";
import { Button, Paper, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCSR] = useCSR();
  const { notify } = useNotify();

  const form = useForm({
    initialValues: {
      email: ""
    },
    validateInputOnBlur: true,
    validate: {
      email: (val) => (val.length === 0 ? required("email") : /^\S+@\S+$/.test(val) ? null : invalid("Email"))
    }
  });

  const handleSubmit = async (values: { email: string }) => {
    setIsSubmitting(true);
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        ...values
      })
    });

    const json = await response.json();

    form.reset();
    if (!response.ok) {
      notify(json.message, Variant.Error);
      form.reset();
      setIsSubmitting(false);
      return;
    }

    notify("Đã gửi liên kết đặt lại mật khẩu");
    setIsSubmitting(false);
  };

  if (!isCSR) return null;

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput type="email" label="Email" name="email" placeholder="Email" {...form.getInputProps("email")} />
          <Button type="submit" disabled={isSubmitting} fullWidth mt="md">
            Đặt lại mật khẩu
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
