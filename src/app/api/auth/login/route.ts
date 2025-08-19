import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { SignInSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { signAuthToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = SignInSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const db = await getDb();

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signAuthToken({ userId: user._id.toString(), email: user.email });
    return NextResponse.json({ token, user: { id: user._id.toString(), email: user.email, name: user.name } });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


