import { generateToken, validateEmail } from "@/lib/common";
import { sendPasswordResetEmail } from "@/lib/email/sendPasswordResetEmail";
import { ApiError } from "@/lib/errors";
import { db } from "@/server/db";
import { recordMetric } from "@/lib/metrics";
import { NextResponse } from "next/server";
import { invalid } from "@/lib/messages";
export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as {
      email: string;
    };

    if (!email || !validateEmail(email)) {
      throw new ApiError(422, invalid("Địa chỉ email"));
    }

    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new ApiError(422, `Chúng tôi không thể tìm thấy người dùng có địa chỉ email này`);
    }

    const resetToken = generateToken();

    await db.passwordReset.create({
      data: {
        email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // Expires in 1 hour
      }
    });

    await sendPasswordResetEmail(email, encodeURIComponent(resetToken));

    recordMetric("user.password.request");

    return NextResponse.json({});
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
