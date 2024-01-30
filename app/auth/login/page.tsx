import { AuthProvider, GoogleButton } from "@/components/auth";
import app from "@/lib/app";
import { authProviderEnabled, getServerAuthSession } from "@/server/auth";
import { Anchor, Button, Divider, Group, Paper, Text, Title } from "@mantine/core";
import type { Metadata } from "next";
import LoginForm from "../../../components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập - " + app.name
};

export default async function Login() {
  const authProviders = authProviderEnabled();
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
          {authProviders.google && (
            <Group justify="center">
              <GoogleButton />
            </Group>
          )}

          {authProviders.google && authProviders.credentials && <Divider label="HOẶC" my="md" />}

          {authProviders.credentials && <LoginForm />}

          {authProviders.email && <Divider label="HOẶC" my="md" />}

          {authProviders.email && (
            <Button variant="light" component="a" href="/auth/magic-link" fullWidth>
              Đăng nhập bằng email
            </Button>
          )}
        </Paper>
      </AuthProvider>
    </>
  );
}
