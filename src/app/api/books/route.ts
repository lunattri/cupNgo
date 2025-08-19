import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { books } from "@/data/books";

const SubmitSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  vibe: z.enum(["cozy","quiet","airy","artsy","study"]),
  cafeId: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({ books });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = SubmitSchema.parse(body);
    // In-memory append (demo). In production, persist to DB and moderate.
    books.push({ title: data.title, author: data.author, vibe: data.vibe });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
}









