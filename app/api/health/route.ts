import { db } from "@/server/db";
import packageInfo from "@/package.json";
import { NextResponse } from "next/server";

const handler = async () => {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ version: packageInfo.version }, { status: 200 });
  } catch (err: any) {
    const { statusCode = 503 } = err;
    return NextResponse.json({ error: { statusCode } });
  }
};

export async function POST() {
  handler();
}

export async function PUT() {
  handler();
}

export async function PATCH() {
  handler();
}

export async function DELETE() {
  handler();
}

export async function GET() {
  return NextResponse.json({ message: "Phương thức GET không được phép" }, { status: 500 });
}
