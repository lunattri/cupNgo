import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  // No-op: client will clear localStorage
  return NextResponse.json({ ok: true });
}


