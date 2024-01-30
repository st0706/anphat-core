import { ResendEmailToken } from "@/components/auth";
import app from "@/lib/app";
import { Title } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gửi lại mã xác nhận - " + app.name
};

const VerifyAccount = () => {
  return (
    <>
      <Title order={2} ta="center">
        Xác minh tài khoản của bạn
      </Title>
      <ResendEmailToken />
    </>
  );
};

export default VerifyAccount;
