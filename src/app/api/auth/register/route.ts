import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { SignUpSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = SignUpSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, name } = parseResult.data;
    const db = await getDb();

    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await db.collection("users").insertOne({
      email,
      name,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ userId: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


