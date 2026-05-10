import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "UniPlacement AI",
    timestamp: new Date().toISOString(),
  });
}
