import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addPlan, loadPlans } from "@/lib/serverStore";
import { verifyAuthToken } from "@/lib/jwt";

const CreateSchema = z.object({
  owner: z.string().email().optional().nullable(),
  confirmed: z.boolean().default(true),
  participants: z.array(z.string().email()).default([]),
  vibe: z.string().optional(),
  cafe: z.object({ name: z.string().min(1), address: z.string().default(""), image: z.string().optional().nullable() }),
  book: z.string().optional(),
  outfit: z.string().optional(),
  funTip: z.string().optional(),
  funActivity: z.string().optional(),
  start: z.string().min(1),
  end: z.string().min(1),
});

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let ownerEmail: string | null = null;
  try {
    const payload = verifyAuthToken(token);
    ownerEmail = payload.email;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").toLowerCase();
  const confirmedParam = url.searchParams.get("confirmed");
  const confirmed = confirmedParam === null ? undefined : confirmedParam === "true";
  const sort = url.searchParams.get("sort") || "date"; // date | createdAt | cafe
  const order = (url.searchParams.get("order") || "desc") as "asc" | "desc";
  const dateFrom = url.searchParams.get("dateFrom");
  const dateTo = url.searchParams.get("dateTo");
  const participant = url.searchParams.get("participant");
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = Math.min(parseInt(url.searchParams.get("pageSize") || "20", 10), 100);

  let items = loadPlans();
  // Scope to current user only
  items = items.filter((p) => (p.owner || "") === ownerEmail);
  if (typeof confirmed === "boolean") items = items.filter((p) => p.confirmed === confirmed);
  if (participant) items = items.filter((p) => p.participants?.some((e) => e.toLowerCase() === participant.toLowerCase()));
  if (dateFrom) items = items.filter((p) => new Date(p.start) >= new Date(dateFrom));
  if (dateTo) items = items.filter((p) => new Date(p.start) <= new Date(dateTo));
  if (q) {
    items = items.filter((p) => {
      const hay = [p.cafe?.name, p.book, p.owner, ...(p.participants || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  items.sort((a, b) => {
    let av: string | number = 0;
    let bv: string | number = 0;
    switch (sort) {
      case "createdAt":
        av = new Date(a.createdAt).getTime();
        bv = new Date(b.createdAt).getTime();
        break;
      case "cafe":
        av = a.cafe?.name?.toLowerCase() || "";
        bv = b.cafe?.name?.toLowerCase() || "";
        break;
      case "date":
      default:
        av = new Date(a.start).getTime();
        bv = new Date(b.start).getTime();
        break;
    }
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return order === "asc" ? cmp : -cmp;
  });

  const total = items.length;
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pageItems = items.slice(startIdx, endIdx);

  return NextResponse.json({ total, page, pageSize, items: pageItems });
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let ownerEmail: string | null = null;
  try {
    const payload = verifyAuthToken(token);
    ownerEmail = payload.email;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = CreateSchema.parse(body);
    const created = addPlan({
      owner: ownerEmail,
      confirmed: parsed.confirmed,
      participants: parsed.participants || [],
      vibe: parsed.vibe,
      cafe: { name: parsed.cafe.name, address: parsed.cafe.address, image: parsed.cafe.image || undefined },
      book: parsed.book,
      outfit: parsed.outfit,
      funTip: parsed.funTip,
      funActivity: parsed.funActivity,
      start: parsed.start,
      end: parsed.end,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


