import app from "@/lib/app";
import env from "@/lib/env";
import { Button, Container, Head, Html, Preview, Text } from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface WelcomeEmailProps {
  name: string;
  team: string;
  subject: string;
}

const WelcomeEmail = ({ name, subject, team }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <EmailLayout>
        <Text>Xin chào {name},</Text>
        <Text>
          Bạn đã đăng ký thành công vào {app.name} trong <b>{team}</b>.
        </Text>
        <Text>Nhấp vào liên kết dưới đây để đăng nhập ngay bây giờ:</Text>
        <Container className="text-center">
          <Button
            href={`${env.appUrl}/auth/login`}
            className="px-5 py-4 bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center">
            Đăng nhập vào tài khoản
          </Button>
        </Container>
      </EmailLayout>
    </Html>
  );
};

export default WelcomeEmail;
