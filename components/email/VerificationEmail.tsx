import app from "@/lib/app";
import { Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface VerificationEmailProps {
  subject: string;
  verificationLink: string;
}

const VerificationEmail = ({ subject, verificationLink }: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <EmailLayout>
        <Heading as="h2">Xác nhận tài khoản của bạn!</Heading>

        <Text>Trước khi bắt đầu, chúng tôi cần xác nhận tài khoản của bạn.</Text>
        <Text>
          Cảm ơn bạn đã đăng ký {app.name}. Để xác nhận tài khoản của bạn, vui lòng nhấp vào liên kết bên dưới:
        </Text>

        <Container className="text-center">
          <Button
            href={verificationLink}
            className="px-5 py-4 bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center">
            Xác nhận tài khoản
          </Button>
        </Container>

        <Text>Nếu bạn không tạo tài khoản này thì không cần làm gì.</Text>
      </EmailLayout>
    </Html>
  );
};

export default VerificationEmail;
