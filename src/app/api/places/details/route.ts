import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { placeDetails } from "@/lib/google";

const Schema = z.object({ id: z.string().min(1) });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || "";
    const { id: placeId } = Schema.parse({ id });
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return NextResponse.json({ error: "Missing GOOGLE_PLACES_API_KEY" }, { status: 500 });
    }
    const details = await placeDetails(placeId);
    if (!details) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(details);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


