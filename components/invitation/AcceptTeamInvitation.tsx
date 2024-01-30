"use client";

import { Error, Loading } from "@/components/shared";
import useNotify, { Variant } from "@/hooks/useNotify";
import { defaultHeaders } from "@/lib/common";
import { Button, Paper, Stack, Title } from "@mantine/core";
import useInvitation from "hooks/useInvitation";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

const AcceptTeamInvitation = () => {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { notify } = useNotify();

  const { token } = params as { token: string };

  const { isLoading, isError, invitation } = useInvitation(token as string);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!invitation) {
    return null;
  }

  const acceptInvitation = async () => {
    const response = await fetch(`/api/teams/${invitation.team.slug}/invitations`, {
      method: "PUT",
      headers: defaultHeaders,
      body: JSON.stringify({ inviteToken: invitation.token })
    });

    const json = await response.json();

    if (!response.ok) {
      notify(json.message, Variant.Error);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <Stack>
        <Title order={2} ta="center">
          {`${invitation.team.name} mời bạn sử dụng ứng dụng AnPhat Core.`}
        </Title>
        <Title order={3} ta="center">
          {status === "authenticated"
            ? "Bạn có thể chấp nhận lời mời tham gia tổ chức bằng cách nhấp vào nút bên dưới."
            : "Để tiếp tục, bạn phải tạo tài khoản mới hoặc đăng nhập vào tài khoản hiện có."}
        </Title>
        {status === "unauthenticated" ? (
          <>
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                router.push(`/auth/join?token=${invitation.token}`);
              }}>
              Tạo tài khoản mới
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                router.push(`/auth/login?token=${invitation.token}`);
              }}>
              Đăng nhập
            </Button>
          </>
        ) : (
          <Button onClick={acceptInvitation} fullWidth>
            Chấp nhận lời mời
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default AcceptTeamInvitation;
