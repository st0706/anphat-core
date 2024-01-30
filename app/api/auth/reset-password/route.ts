import { hashPassword, validatePasswordPolicy } from "@/server/auth";
import { db } from "@/server/db";
import { ApiError } from "next/dist/server/api-utils";
import { recordMetric } from "@/lib/metrics";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, password } = (await req.json()) as {
      token: string;
      password: string;
    };

    if (!token) {
      throw new ApiError(422, "Cần có mã thông báo đặt lại mật khẩu");
    }

    validatePasswordPolicy(password);

    const passwordReset = await db.passwordReset.findUnique({
      where: { token }
    });

    if (!passwordReset) {
      throw new ApiError(422, "Mã thông báo đặt lại mật khẩu không hợp lệ. Vui lòng lấy một mã khác.");
    }

    if (passwordReset.expiresAt < new Date()) {
      throw new ApiError(422, "Mã thông báo đặt lại mật khẩu đã hết hạn. Vui lòng lấy một mã khác.");
    }

    const hashedPassword = await hashPassword(password);

    await Promise.all([
      db.user.update({
        where: { email: passwordReset.email },
        data: {
          password: hashedPassword
        }
      }),
      db.passwordReset.delete({
        where: { token }
      })
    ]);

    recordMetric("user.password.reset");

    return NextResponse.json({ message: "Đặt lại mật khẩu thành công" }, { status: 200 });
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
