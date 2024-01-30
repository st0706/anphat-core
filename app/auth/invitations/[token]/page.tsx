import { AuthProvider } from "@/components/auth";
import { AcceptTeamInvitation } from "@/components/invitation";
import { getServerAuthSession } from "@/server/auth";
import { ParamsWithToken } from "@/types";
import { Text, Title } from "@mantine/core";
import { setCookie } from "cookies-next";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: `Bạn đã được mời tham gia ${AcceptTeamInvitation.name}`
};

export default async function InvitationPage({ params }: ParamsWithToken) {
  const headersList = headers();
  const token = params.token;
  const pathname = headersList.get("'x-pathname'");
  const session = await getServerAuthSession();

  setCookie(
    "pending-invite",
    {
      token,
      url: pathname
    },
    {
      //req,
      //res,
      maxAge: 60 * 6 * 24,
      httpOnly: true,
      sameSite: "lax"
    }
  );

  return (
    <>
      <Title order={2} ta="center">
        Chấp nhận lời mời
      </Title>
      <Text ta="center" mt="xs">
        Hãy xem trang web của chúng tôi nếu bạn muốn tìm hiểu thêm trước khi bắt đầu.
      </Text>
      <AuthProvider session={session}>
        <AcceptTeamInvitation />
      </AuthProvider>
    </>
  );
}
