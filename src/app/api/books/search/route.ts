import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchBooksByQuery } from "@/lib/google";

const Schema = z.object({ q: z.string().min(1) });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const { q: query } = Schema.parse({ q });
    const books = await searchBooksByQuery(query);
    return NextResponse.json({ books });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}










