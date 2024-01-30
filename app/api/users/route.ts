import { getServerAuthSession } from "@/server/auth";
import { ApiError } from "@/lib/errors";
import { recordMetric } from "@/lib/metrics";
import { db } from "@/server/db";
import { NextResponse } from "next/server";
import { invalid } from "@/lib/messages";

export async function PUT(req: Request) {
  try {
    const session = await getServerAuthSession();
    const toUpdate = {};
    const { email, name, image } = (await req.json()) as {
      email: string;
      name: string;
      image: string;
    };
    if (email) {
      toUpdate["email"] = email;
    }
    if (name) {
      toUpdate["name"] = name;
    }
    if (image) {
      toUpdate["image"] = image;
    }

    if (Object.keys(toUpdate).length === 0) {
      throw new ApiError(400, invalid("Yêu cầu"));
    }

    const user = await db.user.update({
      where: { id: session?.user.id },
      data: toUpdate
    });

    recordMetric("user.updated");
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
