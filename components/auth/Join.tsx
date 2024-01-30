"use client";

import useNotify, { Action } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { invalid, required } from "@/lib/messages";
import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Join = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notifyResult } = useNotify();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      team: ""
    },
    validateInputOnBlur: true,
    validate: {
      name: isNotEmpty(required("tên")),
      email: (val) => (val.length === 0 ? required("email") : /^\S+@\S+$/.test(val) ? null : invalid("Email")),
      password: (val) =>
        val.length === 0 ? required("mật khẩu") : val.length >= 8 ? null : "Độ dài mật khẩu quá ngắn",
      team: (val) => (val.length === 0 ? required("tên bệnh viện") : val.length >= 3 ? null : "Tên bệnh viện quá ngắn")
    }
  });

  const handleSubmit = async (values: { name: string; email: string; password: string; team: string }) => {
    setIsSubmitting(true);
    const response = await fetch("/api/auth/join", {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        ...values
      })
    });

    // const json = (await response.json()) as ApiResponse<
    //   User & { confirmEmail: boolean }
    // >;
    const json = await response.json();

    if (!response.ok) {
      notifyResult(Action.Create, "tài khoản", false, json.message);
      form.reset();
      setIsSubmitting(false);
      return;
    }

    form.reset();

    if (json.data.confirmEmail) {
      router.push("/auth/verify-email");
    } else {
      notifyResult(Action.Create, "tài khoản", true);
      router.push("/auth/login");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput type="text" label="Tên" name="name" placeholder="Tên của bạn" {...form.getInputProps("name")} />
        <TextInput
          type="text"
          label="Bệnh viện"
          name="team"
          placeholder="Tên bệnh viện"
          {...form.getInputProps("team")}
        />
        <TextInput
          type="email"
          label="Email"
          name="email"
          placeholder="Địa chỉ email"
          {...form.getInputProps("email")}
        />
        <PasswordInput label="Mật khẩu" name="password" placeholder="Mật khẩu" {...form.getInputProps("password")} />
        <Button type="submit" loading={isSubmitting} disabled={!form.isDirty} fullWidth mt="md">
          Tạo tài khoản
        </Button>
      </Stack>
    </form>
  );
};

export default Join;
