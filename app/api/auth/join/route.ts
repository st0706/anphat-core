import { hashPassword, validatePasswordPolicy } from "@/server/auth";
import { generateToken, slugify } from "@/lib/common";
import { sendVerificationEmail } from "@/lib/email/sendVerificationEmail";
import { db } from "@/server/db";
import { isBusinessEmail } from "@/lib/email/utils";
import env from "@/lib/env";
import { ApiError } from "@/lib/errors";
import { createTeam, isTeamExists } from "models/team";
import { createUser, getUser } from "models/user";
import { recordMetric } from "@/lib/metrics";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Signup the user
    const { name, email, password, team } = (await req.json()) as {
      name: string;
      email: string;
      password: string;
      team: string;
    };

    const existingUser = await getUser({ email });

    if (existingUser) {
      throw new ApiError(400, "Người dùng với email này đã tồn tại.");
    }

    validatePasswordPolicy(password);

    if (env.disableNonBusinessEmailSignup && !isBusinessEmail(email)) {
      throw new ApiError(
        400,
        `Chúng tôi hiện chỉ chấp nhận địa chỉ email cơ quan để đăng ký. Vui lòng sử dụng email công việc của bạn để tạo một tài khoản. Nếu bạn không có email công việc, vui lòng liên hệ với nhóm hỗ trợ của chúng tôi để được hỗ trợ.`
      );
    }

    // Create a new team
    if (team) {
      const slug = slugify(team);

      const nameCollisions = await isTeamExists([{ name: team }, { slug }]);

      if (nameCollisions > 0) {
        throw new ApiError(400, "Đã tồn tại bệnh viện với tên này.");
      }
    }

    const user = await createUser({
      name,
      email,
      password: await hashPassword(password)
    });

    if (team) {
      const slug = slugify(team);

      await createTeam({
        userId: user.id,
        name: team,
        slug
      });
    }

    // Send account verification email
    // if (env.confirmEmail) {
    //   const verificationToken = await db.verificationToken.create({
    //     data: {
    //       identifier: email,
    //       token: generateToken(),
    //       expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 24 hours
    //     }
    //   });

    //   await sendVerificationEmail({ user, verificationToken });
    // }

    recordMetric("user.signup");
    return NextResponse.json(
      {
        data: {
          user
          // confirmEmail: env.confirmEmail
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    const message = error.message || "Đã xảy ra lỗi";
    const status = error.status || 500;
    return new NextResponse(
      JSON.stringify({
        status,
        message
      }),
      { status: 500 }
    );
  }
}
