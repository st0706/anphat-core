import app from "@/lib/app";
import env from "@/lib/env";
import { Button, Container, Head, Html, Preview, Text } from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface ResetPasswordEmailProps {
  url: string;
}

const ResetPasswordEmail = ({ url }: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Đặt lại mật khẩu {app.name} của bạn</Preview>
      <EmailLayout>
        <Text>
          Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu {app.name} của bạn. Nếu bạn không yêu cầu đặt lại mật khẩu,
          vui lòng bỏ qua email này.
        </Text>
        <Text>Để đặt lại mật khẩu của bạn, vui lòng nhấp vào liên kết bên dưới:</Text>

        <Container className="text-center">
          <Button
            href={`${env.appUrl}/auth/reset-password/${url}`}
            className="px-5 py-4 bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center">
            Đặt lại mật khẩu
          </Button>
        </Container>

        <Text>Liên kết này sẽ hết hạn sau 60 phút. Sau đó, bạn sẽ cần yêu cầu đặt lại mật khẩu khác.</Text>
      </EmailLayout>
    </Html>
  );
};

export default ResetPasswordEmail;
