import { sendEmail } from "./sendEmail";
import { render } from "@react-email/render";
import { ResetPasswordEmail } from "@/components/email";

export const sendPasswordResetEmail = async (email: string, url: string) => {
  const html = render(ResetPasswordEmail({ url }));
  await sendEmail({
    to: email,
    subject: "Khởi tạo lại mật khẩu AnPhat Core",
    html
  });
};
