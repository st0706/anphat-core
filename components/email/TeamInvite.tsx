import { Team } from "@prisma/client";
import { Button, Container, Head, Html, Preview, Text } from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface TeamInviteEmailProps {
  team: Team;
  invitationLink: string;
  userFirstname?: string;
}

const TeamInviteEmail = ({ team, invitationLink }: TeamInviteEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Lời mời sử dụng ứng dụng</Preview>
      <EmailLayout>
        <Text>Bạn đã được mời tham gia vào {team.name}.</Text>
        <Text>Nhấp vào liên kết bên dưới để chấp nhận lời mời và tham gia:</Text>

        <Container className="text-center">
          <Button
            href={invitationLink}
            className="px-5 py-4 bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center">
            Tham gia
          </Button>
        </Container>
      </EmailLayout>
    </Html>
  );
};

export default TeamInviteEmail;
