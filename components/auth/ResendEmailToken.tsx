"use client";

import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { invalid, required } from "@/lib/messages";
import { Button, Paper, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

const ResendEmailToken = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notify, notifyResult } = useNotify();

  const form = useForm({
    initialValues: {
      email: ""
    },
    validateInputOnBlur: true,
    validate: {
      email: (val) => (val.length === 0 ? required("email") : /^\S+@\S+$/.test(val) ? null : invalid("Email"))
    }
  });

  const handleSubmit = async (values: { email: string | undefined }) => {
    setIsSubmitting(true);
    const response = await fetch("/api/auth/resend-email-token", {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(values)
    });

    const json = await response.json();

    if (!response.ok) {
      notifyResult(Action.Submit, "liên kết xác minh", false, json.message);
      form.reset();
      setIsSubmitting(false);
      return;
    }

    form.reset();
    notify("Đã gửi liên kết xác minh. Vui lòng kiểm tra email của bạn.");
    setIsSubmitting(false);
  };

  // const [message, setMessage] = useState<{
  //   text: string | null;
  //   color: MantineColor | null;
  // }>({
  //   text: null,
  //   color: null,
  // });

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput type="email" label="Email" name="email" placeholder="Email" {...form.getInputProps("email")} />
        <Button type="submit" loading={isSubmitting} disabled={!form.isDirty} fullWidth mt="xl">
          Gửi lại liên kết
        </Button>
      </form>
    </Paper>
  );
};

export default ResendEmailToken;
