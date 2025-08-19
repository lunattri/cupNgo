import { NextResponse } from "next/server";
import { z } from "zod";
import { getPlanById, removePlan, updatePlan } from "@/lib/serverStore";

const UpdateSchema = z.object({
  confirmed: z.boolean().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  book: z.string().optional(),
  outfit: z.string().optional(),
  funTip: z.string().optional(),
  funActivity: z.string().optional(),
  vibe: z.string().optional(),
});

export async function GET(_: Request, context: any) {
  const plan = getPlanById(context.params.id as string);
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(plan);
}

export async function PATCH(req: Request, context: any) {
  try {
    const body = await req.json();
    const patch = UpdateSchema.parse(body);
    const updated = updatePlan(context.params.id as string, patch as any);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_: Request, context: any) {
  const ok = removePlan(context.params.id as string);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}


