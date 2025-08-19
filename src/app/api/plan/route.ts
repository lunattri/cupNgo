import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generatePlanAsync } from "@/lib/plan";
import { googleCalendarLink } from "@/lib/calendar";

const Schema = z.object({
  date: z.string(),
  vibes: z
    .array(
      z.enum([
        "any",
        "cozy",
        "quiet",
        "airy",
        "artsy",
        "study",
        "chic",
        "minimalist",
        "crowded",
        "not_busy",
        "colorful",
      ])
    )
    .min(1)
    .max(3),
  cafeId: z.string().optional(),
  origin: z.object({ lat: z.number(), lng: z.number() }).optional(),
  start: z.string().optional(),
  mood: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { date, vibes, cafeId, origin, start, mood } = Schema.parse(json);
    const dateISO = date.length <= 10 ? `${date}T00:00:00` : date;
    const plan = await generatePlanAsync(dateISO, vibes, { cafeId, origin, start, mood });

    const calendarLink = googleCalendarLink({
      title: `Cafe date at ${plan.cafe.name}`,
      details: `Vibe: ${plan.vibe}\nBooks: ${plan.books.map((b:any)=>b.title).join(", ")}\nOutfit: ${plan.outfit.suggestion}`,
      location: `${plan.cafe.name}, ${plan.cafe.address}`,
      start: plan.start,
      end: plan.end,
    });

    return NextResponse.json({ ...plan, calendarLink });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


