"use client";
import { useEffect, useState } from "react";
import { useTone } from "@/ui/ToneProvider";
import Image from "next/image";
import { renderCafeText, renderTimeText, renderBooksHeader, renderOutfitText, getCtaLabels, renderHeader } from "@/lib/tone";

type Plan = {
  vibe: string;
  cafe: { name: string; address: string; image: string };
  books: { title: string; author: string; image: string }[];
  outfit: { suggestion: string; colors: string[] };
  start: string; end: string; calendarLink: string; funTip: string; funActivity?: string;
};

export default function PlanViewPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const { tone } = useTone();

  useEffect(() => {
    try {
      const s = sessionStorage.getItem("last_plan");
      if (s) setPlan(JSON.parse(s));
    } catch {}
  }, []);

  if (!plan) return (
    <div className="container">
      <div className="card"><div className="subtle">No plan found. Generate one from your shelf.</div></div>
      <div className="card"><a className="btn btn-primary btn-block" href="/shelf">Go to shelf</a></div>
    </div>
  );

  return (
    <div className="container">
      <div className="stack" style={{ gap: 16 }}>
        <h1 className="title">{renderHeader(tone as any)}</h1>
        <div className="card">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="stack" style={{ gap: 8 }}>
              <div className="row"><span className="badge">{(plan as any).vibe}</span></div>
              <strong>Cafe</strong>
              <div style={{ borderRadius: 12, overflow: "hidden" }}>
                <Image src={plan.cafe.image} alt={plan.cafe.name} width={800} height={480} style={{ width: "100%", height: "auto" }} />
              </div>
              <div>{renderCafeText(tone as any, plan.cafe.name)}</div>
              <div className="subtle">{plan.cafe.address}</div>
            </div>
            <div className="stack" style={{ gap: 8 }}>
              <strong>{renderBooksHeader(tone as any, plan.books.length)}</strong>
              <div style={{ borderRadius: 12, overflow: "hidden" }}>
                <Image src={plan.books[0].image} alt={plan.books[0].title} width={800} height={480} style={{ width: "100%", height: "auto" }} />
              </div>
              <div>
                {plan.books[0].title} — <span className="subtle">{plan.books[0].author}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="stack">
            <strong>Time</strong>
            <div>{renderTimeText(tone as any, new Date(plan.start), new Date(plan.end))}</div>
          </div>
        </div>

        <div className="card">
          <div className="stack">
            <strong>Outfit</strong>
            <div>{renderOutfitText(tone as any, plan.outfit.suggestion)}</div>
          </div>
        </div>

        <div className="card">
          <div className="stack">
            <a className="btn btn-primary btn-block" href={plan.calendarLink} target="_blank" rel="noreferrer">{getCtaLabels(tone as any).calendar}</a>
            <button
              className="btn btn-secondary btn-block"
              onClick={async () => {
                try {
                  const date = new Date().toISOString().slice(0,10);
                  const vibes = ["any"]; // re-roll surprise
                  const originStr = localStorage.getItem("preferred_origin");
                  const origin = originStr ? JSON.parse(originStr) : undefined;
                  const res = await fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date, vibes, origin }) });
                  if (!res.ok) return;
                  const data = await res.json();
                  setPlan({ ...data, start: data.start, end: data.end });
                  try { sessionStorage.setItem("last_plan", JSON.stringify(data)); } catch {}
                } catch {}
              }}
            >
              {getCtaLabels(tone as any).regenerate}
            </button>
            <button
              className="btn btn-secondary btn-block"
              onClick={() => {
                (async () => {
                  try {
                    const payload = {
                      owner: null,
                      confirmed: true,
                      participants: [],
                      vibe: (plan as any).vibe,
                      cafe: { name: plan.cafe.name, address: plan.cafe.address, image: plan.cafe.image },
                      book: plan.books?.[0]?.title || "",
                      outfit: plan.outfit?.suggestion || "",
                      funTip: (plan as any).funTip || "",
                      funActivity: (plan as any).funActivity || "",
                      start: plan.start,
                      end: plan.end,
                    };
                    const res = await fetch("/api/plans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
                    if (!res.ok) throw new Error("Failed to save plan");
                    window.location.assign("/shelf");
                  } catch {}
                })();
              }}
            >
              {getCtaLabels(tone as any).confirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


