"use client";

import useCSR from "@/hooks/useCSR";
import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { required } from "@/lib/messages";
import { Button, Paper, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ApiResponse } from "types";

const ResetPassword = ({ params }: { params: string }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const token = params;
  const [isCSR] = useCSR();
  const { notifyResult } = useNotify();

  const form = useForm({
    initialValues: {
      password: "",
      confirmPassword: ""
    },
    validateInputOnBlur: true,
    validate: {
      password: (val) =>
        val.length === 0 ? required("mật khẩu") : val.length >= 8 ? null : "Độ dài mật khẩu quá ngắn",
      confirmPassword: (val, context) => (val !== context.confirmPassword ? "Nhập lại mật khẩu không đúng" : null)
    }
  });

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    setSubmitting(true);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        ...values,
        token
      })
    });

    const json = (await response.json()) as ApiResponse;

    setSubmitting(false);

    if (!response.ok) {
      notifyResult(Action.Update, "mật khẩu", false, json.error?.message);
      form.reset();
      setSubmitting(false);
      return;
    }

    form.reset();
    notifyResult(Action.Update, "mật khẩu", true);
    router.push("/auth/login");
  };

  if (!isCSR) return null;

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <PasswordInput
          type="password"
          label="Mật khẩu mới"
          name="password"
          placeholder="Nhập mật khẩu mới"
          {...form.getInputProps("password")}
        />
        <PasswordInput
          type="password"
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          {...form.getInputProps("confirmPassword")}
          mt="md"
        />
        <Button type="submit" loading={submitting} disabled={!form.isDirty} fullWidth mt="xl">
          Đặt lại mật khẩu
        </Button>
      </form>
    </Paper>
  );
};

export default ResetPassword;
