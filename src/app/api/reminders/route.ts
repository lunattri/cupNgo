import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { renderReminder } from "@/lib/reminders";

const Schema = z.object({
  tone: z.enum(["friendly","dominant","kind","chill","mean","enthusiastic","bratty","assertive","formal"]),
  cafe: z.string().min(1),
  when: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tone, cafe, when } = Schema.parse(body);
    const text = renderReminder(tone, cafe, new Date(when));
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


