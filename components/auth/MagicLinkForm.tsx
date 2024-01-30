"use client";

import { Loading } from "@/components/shared";
import useNotify, { Variant } from "@/hooks/useNotify";
import env from "@/lib/env";
import { invalid, required } from "@/lib/messages";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MagicLinkForm = () => {
  const { status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (values: { email: string | undefined }) => {
    const csrfToken = getCsrfToken();
    const response = await signIn("email", {
      email: values.email,
      csrfToken,
      redirect: false,
      callbackUrl: env.redirectIfAuthenticated
    });

    form.reset();

    if (response?.error) {
      notify("Đã xảy ra lỗi khi gửi email. Vui lòng thử lại sau.", Variant.Error);
      form.reset();
      setIsSubmitting(false);
      return;
    }

    if (response?.status === 200 && response?.ok) {
      notify("Liên kết đăng nhập đã được gửi đến địa chỉ email của bạn. Liên kết sẽ hết hạn sau 24 giờ.");
      return;
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "authenticated") {
    router.push(env.redirectIfAuthenticated);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        type="email"
        label="Email"
        name="email"
        placeholder="email@pacs.store"
        description="Chúng tôi sẽ gửi cho bạn một liên kết qua email để đăng nhập không cần mật khẩu."
        {...form.getInputProps("email")}
      />
      <Button type="submit" loading={isSubmitting} disabled={!form.isDirty} fullWidth mt="xl">
        Gửi liên kết đăng nhập
      </Button>
    </form>
  );
};

export default MagicLinkForm;
