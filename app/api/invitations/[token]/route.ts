import { getInvitation } from "models/invitation";
import { recordMetric } from "@/lib/metrics";
import { NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";

export async function GET(req: Request) {
  try {
    // Get the invitation by token
    const header = req.headers.get("referer");
    const pathArray = header?.split("/");
    const token = pathArray![pathArray!.length - 1];
    if (token) {
      const invitation = await getInvitation({ token });
      recordMetric("invitation.fetched");
      return NextResponse.json(
        {
          data: invitation
        },
        { status: 200 }
      );
    } else {
      throw new ApiError(400, `Thiếu mã thông báo bắt buộc`);
    }
  } catch (error: any) {
    const message = error?.message || "Đã xảy ra lỗi";
    const status = error?.status || 400;
    return new NextResponse(
      JSON.stringify({
        status,
        message
      }),
      { status: 400 }
    );
  }
}
