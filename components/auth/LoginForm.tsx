"use client";

import { Loading } from "@/components/shared";
import useNotify, { Variant } from "@/hooks/useNotify";
import env from "@/lib/env";
import { invalid, required } from "@/lib/messages";
import { Alert, Anchor, Button, Group, MantineColor, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Message {
  text: string | null;
  color: MantineColor | null;
}

const LoginForm = () => {
  const router = useRouter();
  const params = useParams();
  const { status } = useSession();
  const [message, setMessage] = useState<Message>({ text: null, color: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notify } = useNotify();

  const { error, success, token } = params as {
    error: string;
    success: string;
    token: string;
  };

  useEffect(() => {
    if (error) {
      setMessage({ text: error, color: "error" });
    }

    if (success) {
      setMessage({ text: success, color: "success" });
    }
  }, [error, success]);

  const redirectUrl = token ? `/invitations/${token}` : env.redirectIfAuthenticated;

  const form = useForm({
    initialValues: {
      email: "",
      password: ""
    },
    validateInputOnBlur: true,
    validate: {
      email: (val) => (val.length === 0 ? required("email") : /^\S+@\S+$/.test(val) ? null : invalid("Email")),
      password: (val) => (val.length === 0 ? required("mật khẩu") : null)
    }
  });

  const handleSubmit = async (values) => {
    const { email, password } = values;
    setIsSubmitting(true);

    const csrfToken = await getCsrfToken();

    const response = await signIn("credentials", {
      email,
      password,
      csrfToken,
      redirect: false,
      callbackUrl: redirectUrl
    });

    form.reset();

    if (!response?.ok) {
      if (response?.error) {
        notify(response?.error, Variant.Error);
      }
    }
    setIsSubmitting(false);
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "authenticated") {
    router.push(redirectUrl);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        {message.text && message.color && <Alert color={message.color}>{message.text}</Alert>}
        <TextInput label="Email" name="email" placeholder="Email" {...form.getInputProps("email")} />
        <Stack gap={1}>
          <Group justify="space-between">
            <Text component="label" htmlFor="password" size="sm" fw={500}>
              Mật khẩu
            </Text>
            <Anchor href="/auth/forgot-password" fw={500} fz="xs" mb={3}>
              Quên mật khẩu?
            </Anchor>
          </Group>
          <PasswordInput id="password" name="password" placeholder="Mật khẩu" {...form.getInputProps("password")} />
        </Stack>
        <Button variant="filled" type="submit" loading={isSubmitting} disabled={!form.isDirty} fullWidth mt="md">
          Đăng nhập
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
