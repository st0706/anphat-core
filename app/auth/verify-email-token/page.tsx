import { Loading } from "@/components/shared";
import { db } from "@/server/db";
import { ParamsWithToken } from "@/types";
import { redirect } from "next/navigation";

const VerifyEmailToken = async ({ params }: ParamsWithToken) => {
  const token = params.token;

  if (!token) {
    redirect("/");
  } else {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        token
      }
    });

    if (!verificationToken) {
      redirect("/auth/login?error=token-not-found");
    } else if (new Date() > verificationToken.expires) {
      redirect("/auth/resend-email-token?error=verify-account-expired");
    } else {
      await Promise.allSettled([
        db.user.update({
          where: {
            email: verificationToken?.identifier
          },
          data: {
            emailVerified: new Date()
          }
        }),

        db.verificationToken.delete({
          where: {
            token
          }
        })
      ]);

      redirect("/auth/login?success=email-verified");
    }
  }

  return <Loading />;
};

export default VerifyEmailToken;
