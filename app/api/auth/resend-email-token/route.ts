import { generateToken, validateEmail } from "@/lib/common";
import { sendVerificationEmail } from "@/lib/email/sendVerificationEmail";
import { ApiError } from "@/lib/errors";
import { invalid } from "@/lib/messages";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Signup the user
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
      throw new ApiError(422, `Chúng tôi không thể tìm thấy người dùng có địa chỉ email đó`);
    }

    const newVerificationToken = await db.verificationToken.create({
      data: {
        identifier: email,
        token: generateToken(),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 24 hours),
      }
    });

    await sendVerificationEmail({
      user,
      verificationToken: newVerificationToken
    });
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
