import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPlanById, updatePlan } from "@/lib/serverStore";

const AddSchema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { email } = AddSchema.parse(body);
    const plan = getPlanById(params.id);
    if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const next = Array.from(new Set([...(plan.participants || []), email]));
    const updated = updatePlan(params.id, { participants: next } as any);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


