import { AuthProvider, MagicLinkForm } from "@/components/auth";
import app from "@/lib/app";
import { getServerAuthSession } from "@/server/auth";
import { Anchor, Button, Divider, Paper, Text, Title } from "@mantine/core";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập bằng liên kết - " + app.name
};

export default async function Login() {
  const session = await getServerAuthSession();

  return (
    <>
      <Title order={2} ta="center">
        Đăng nhập
      </Title>
      <Text ta="center" mt="xs">
        Chưa có tài khoản? <Anchor href="/auth/join">Đăng ký dùng thử</Anchor>
      </Text>

      <AuthProvider session={session}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <MagicLinkForm />
          <Divider label="HOẶC" my="md" />
          <Button variant="light" component="a" href="/auth/login" fullWidth>
            Đăng nhập bằng mật khẩu
          </Button>
        </Paper>
      </AuthProvider>
    </>
  );
}
