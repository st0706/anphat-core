import { ResetPassword } from "@/components/auth";
import app from "@/lib/app";
import { ParamsWithToken } from "@/types";
import { Text, Title } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu - " + app.name
};

export default function ResetPasswordPage({ params }: ParamsWithToken) {
  return (
    <>
      <Title order={2} ta="center">
        Khởi tạo lại mật khẩu
      </Title>
      <Text ta="center" mt="xs">
        Nhập mật khẩu mới
      </Text>
      <ResetPassword params={params.token} />
    </>
  );
}
