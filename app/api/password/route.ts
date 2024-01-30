import { getServerAuthSession, hashPassword, validatePasswordPolicy, verifyPassword } from "@/server/auth";
import { recordMetric } from "@/lib/metrics";
import { db } from "@/server/db";
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const session = await getServerAuthSession();
    const { currentPassword, newPassword } = (await req.json()) as {
      currentPassword: string;
      newPassword: string;
    };

    const user = await db.user.findFirstOrThrow({
      where: { id: session?.user.id }
    });

    if (!(await verifyPassword(currentPassword, user.password as string))) {
      throw new ApiError(400, "Mật khẩu hiện tại của bạn không chính xác");
    }

    validatePasswordPolicy(newPassword);

    await db.user.update({
      where: { id: session?.user.id },
      data: { password: await hashPassword(newPassword) }
    });

    recordMetric("user.password.updated");
    return NextResponse.json({ data: user }, { status: 200 });
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
