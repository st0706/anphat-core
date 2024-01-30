import { ForgotPasswordForm } from "@/components/auth";
import app from "@/lib/app";
import { Anchor, Text, Title } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu - " + app.name
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Title order={2} ta="center">
        Khởi tạo lại mật khẩu
      </Title>
      <Text ta="center" mt="xs">
        Đã có tài khoản? <Anchor href="/auth/login">Đăng nhập</Anchor>
      </Text>
      <ForgotPasswordForm />
    </>
  );
}
