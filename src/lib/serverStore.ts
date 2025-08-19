import fs from "fs";
import path from "path";

export type ServerPlan = {
  id: string;
  owner: string | null;
  confirmed: boolean;
  participants: string[];
  vibe?: string;
  cafe: { name: string; address: string; image?: string };
  book?: string;
  outfit?: string;
  funTip?: string;
  funActivity?: string;
  start: string; // ISO
  end: string;   // ISO
  createdAt: string; // ISO
};

function dataDir(): string {
  const dir = process.env.DATA_DIR || path.join(process.cwd(), ".data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function dataFile(): string {
  return path.join(dataDir(), "plans.json");
}

export function loadPlans(): ServerPlan[] {
  const f = dataFile();
  if (!fs.existsSync(f)) return [];
  try {
    const txt = fs.readFileSync(f, "utf8");
    const arr = JSON.parse(txt);
    if (Array.isArray(arr)) return arr as ServerPlan[];
    return [];
  } catch {
    return [];
  }
}

export function savePlans(plans: ServerPlan[]) {
  const f = dataFile();
  fs.writeFileSync(f, JSON.stringify(plans, null, 2), "utf8");
}

export function addPlan(plan: Omit<ServerPlan, "id" | "createdAt">): ServerPlan {
  const plans = loadPlans();
  const full: ServerPlan = {
    ...plan,
    id: String(Date.now()) + Math.random().toString(36).slice(2, 8),
    createdAt: new Date().toISOString(),
  };
  plans.unshift(full);
  savePlans(plans);
  return full;
}

export function getPlanById(id: string): ServerPlan | null {
  const plans = loadPlans();
  return plans.find((p) => p.id === id) || null;
}

export function updatePlan(id: string, patch: Partial<ServerPlan>): ServerPlan | null {
  const plans = loadPlans();
  const idx = plans.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const next = { ...plans[idx], ...patch } as ServerPlan;
  plans[idx] = next;
  savePlans(plans);
  return next;
}

export function removePlan(id: string): boolean {
  const plans = loadPlans();
  const next = plans.filter((p) => p.id !== id);
  if (next.length === plans.length) return false;
  savePlans(next);
  return true;
}


