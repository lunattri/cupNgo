import { NextRequest, NextResponse } from "next/server";
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

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const plan = getPlanById(params.id);
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(plan);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const patch = UpdateSchema.parse(body);
    const updated = updatePlan(params.id, patch as any);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const ok = removePlan(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}


