import { NextResponse } from "next/server";
import { z } from "zod";
import { getPlanById, updatePlan } from "@/lib/serverStore";

const AddSchema = z.object({ email: z.string().email() });

export async function POST(req: Request, context: any) {
  try {
    const body = await req.json();
    const { email } = AddSchema.parse(body);
    const plan = getPlanById(context.params.id as string);
    if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const next = Array.from(new Set([...(plan.participants || []), email]));
    const updated = updatePlan(context.params.id as string, { participants: next } as any);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


