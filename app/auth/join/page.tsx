import { AuthProvider, GoogleButton, Join, JoinWithInvitation } from "@/components/auth";
import app from "@/lib/app";
import { authProviderEnabled, getServerAuthSession } from "@/server/auth";
import { ParamsWithToken } from "@/types";
import { Anchor, Divider, Group, Paper, Text, Title } from "@mantine/core";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký dùng thử - " + app.name
};

export default async function Signup(params) {
  const authProviders = authProviderEnabled();
  const session = await getServerAuthSession();
  const token = params.token;
  return (
    <>
      <Title order={2} ta="center">
        Đăng ký dùng thử
      </Title>
      <Text ta="center" mt="xs">
        Đã có tài khoản? <Anchor href="/auth/login">Đăng nhập</Anchor>
      </Text>
      <AuthProvider session={session}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          {authProviders.google && (
            <Group justify="center">
              <GoogleButton />
            </Group>
          )}

          {authProviders.google && authProviders.credentials && <Divider label="HOẶC" my="md" />}

          {authProviders.credentials && <>{token ? <JoinWithInvitation inviteToken={token} /> : <Join />}</>}
        </Paper>
      </AuthProvider>
    </>
  );
}
