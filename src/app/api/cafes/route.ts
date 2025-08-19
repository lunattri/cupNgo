import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchCafesNear } from "@/lib/google";

const Schema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  keyword: z.string().optional(),
  radius: z.coerce.number().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const input = Schema.parse({
      lat: searchParams.get("lat"),
      lng: searchParams.get("lng"),
      keyword: searchParams.get("keyword") || undefined,
      radius: searchParams.get("radius") || undefined,
    });
    const cafes = await searchCafesNear({ lat: input.lat, lng: input.lng }, input.keyword || "", input.radius ?? 7000);
    return NextResponse.json({ cafes });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


