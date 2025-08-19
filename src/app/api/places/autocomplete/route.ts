import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { autocompletePlaces } from "@/lib/google";

const Schema = z.object({ q: z.string().min(1) });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const { q: query } = Schema.parse({ q });
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return NextResponse.json({ error: "Missing GOOGLE_PLACES_API_KEY" }, { status: 500 });
    }
    const suggestions = await autocompletePlaces(query);
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


