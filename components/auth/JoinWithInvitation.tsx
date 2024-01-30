"use client";

import { Error, Loading } from "@/components/shared";
import useNotify, { Variant } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { invalid, required } from "@/lib/messages";
import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import type { User } from "@prisma/client";
import useInvitation from "hooks/useInvitation";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { ApiResponse } from "types";

const JoinWithInvitation = ({ inviteToken }: { inviteToken: string }) => {
  const router = useRouter();
  const { isLoading, isError, invitation } = useInvitation(inviteToken);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notify } = useNotify();

  const form = useForm({
    initialValues: {
      name: "",
      email: invitation?.email,
      password: ""
    },
    validateInputOnBlur: true,
    validate: {
      name: isNotEmpty(required("tên")),
      email: (val) => (val?.length === 0 ? required("email") : /^\S+@\S+$/.test(val!) ? null : invalid("Email")),
      password: (val) => (val.length === 0 ? required("mật khẩu") : val.length >= 8 ? null : "Độ dài mật khẩu quá ngắn")
    }
  });

  const handleSubmit = async (values: { name: string; email: string | undefined; password: string }) => {
    setIsSubmitting(true);
    const response = await fetch("/api/auth/join", {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        ...values
      })
    });

    const json = (await response.json()) as ApiResponse<User>;

    if (!response.ok) {
      notify(json.error.message, Variant.Error);
      form.reset();
      setIsSubmitting(false);
      return;
    }

    form.reset();
    notify("Bạn đã tham gia tổ chức thành công.");
    router.push(`/auth/login?token=${inviteToken}`);
    setIsSubmitting(false);
    return;
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput type="text" label="Tên" name="name" placeholder="Tên của bạn" {...form.getInputProps("name")} />
        <TextInput
          type="email"
          label="Email"
          name="email"
          placeholder="Email của bạn"
          {...form.getInputProps("email")}
        />
        <PasswordInput label="Mật khẩu" placeholder="Mật khẩu" {...form.getInputProps("password")} />
        <Button type="submit" loading={isSubmitting} disabled={!form.isDirty} fullWidth mt="md">
          Tạo tài khoản
        </Button>
      </Stack>
    </form>
  );
};

export default JoinWithInvitation;
