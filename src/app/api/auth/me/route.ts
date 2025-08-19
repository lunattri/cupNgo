import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/jwt";
import { getDb } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    let payload;
    try {
      payload = verifyAuthToken(token);
    } catch {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne({ _id: new (await import("mongodb")).ObjectId(payload.userId) }, { projection: { passwordHash: 0 } });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


