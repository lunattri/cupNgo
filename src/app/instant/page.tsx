"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTone } from "@/ui/ToneProvider";
import { Icon } from "@/ui/icons";
import { renderHeader, renderCafeText, renderBooksHeader, renderTimeText, renderOutfitText, renderFunTipText, getCtaLabels } from "@/lib/tone";

type Plan = {
  vibe: string;
  cafe: { name: string; address: string; image: string };
  books: { title: string; author: string; image: string }[];
  outfit: { suggestion: string; colors: string[] };
  start: string; end: string; calendarLink: string; funTip: string; funActivity?: string;
};

export default function InstantPage() {
  const { tone } = useTone();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0); // 0: cafe, 1: details

  useEffect(() => {
    // Use saved origin if present, else attempt geolocation
    try {
      const saved = localStorage.getItem("preferred_origin");
      if (saved) {
        setGeo(JSON.parse(saved));
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => setGeo(null),
          { enableHighAccuracy: true, maximumAge: 60_000, timeout: 10_000 }
        );
      }
    } catch {}
  }, []);

  async function generate() {
    try {
      setLoading(true);
      setError(null);
      const date = new Date().toISOString().slice(0, 10);
      const pref = (() => { try { return localStorage.getItem("vibe_pref"); } catch { return null; } })();
      const vibes = pref ? [pref as any] : ["any"];
      const origin = geo ?? undefined;
      const mood = (() => { try { return localStorage.getItem("vibe_check") || undefined; } catch { return undefined; } })();
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, vibes, origin, mood })
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      const data = await res.json();
      setPlan({ ...data });
      try { sessionStorage.setItem("last_plan", JSON.stringify(data)); } catch {}
      setPage(0);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo?.lat, geo?.lng]);

  const cta = getCtaLabels(tone as any);

  if (loading) return <div className="container"><div className="card"><div>Generating…</div></div></div>;
  if (error) return (
    <div className="container">
      <div className="card"><div className="subtle">{error}</div></div>
      <div className="card"><button className="btn btn-primary btn-block" onClick={generate}>{cta.regenerate}</button></div>
    </div>
  );
  if (!plan) return null;

  return (
    <div className="container">
      <div className="stack" style={{ gap: 16 }}>
        <h1 className="title">{renderHeader(tone as any)}</h1>

        <div className="slides" style={{ transform: `translateX(-${page * 100}%)`, transition: 'transform .25s ease' }}>
          {/* Slide 1: Cafe + Book */}
          <div className="slide">
            <div className="card">
              <div className="grid-2">
                <div className="stack">
                  <div className="row"><span className="badge">{(plan as any).vibe}</span></div>
                  <strong>Cafe</strong>
                  <div style={{ borderRadius: 12, overflow: "hidden" }}>
                    <Image src={plan.cafe.image} alt={plan.cafe.name} width={800} height={480} style={{ width: "100%", height: "auto" }} />
                  </div>
                  <div>{renderCafeText(tone as any, plan.cafe.name)}</div>
                  <div className="subtle">{plan.cafe.address}</div>
                </div>
                <div className="stack">
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
          </div>

          {/* Slide 2: Time + Outfit + Fun Activity */}
          <div className="slide">
            <div className="card">
              <div className="stack">
                <div className="stack">
                  <strong>Outfit</strong>
                  <div>{renderOutfitText(tone as any, plan.outfit.suggestion)}</div>
                </div>

                <div className="circle-icons">
                  <div className="circle"><Icon.shirt size={22} /></div>
                  <div className="circle"><Icon.clock size={22} /></div>
                  <div className="circle"><Icon.sparkle size={22} /></div>
                </div>

                <div className="stack">
                  <strong>Time</strong>
                  <div>{renderTimeText(tone as any, new Date(plan.start), new Date(plan.end))}</div>
                </div>

                {plan.funActivity && (
                  <div className="stack">
                    <strong>Fun activity</strong>
                    <div>{plan.funActivity}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="card">
          <div className="stack">
            <div className="pager">
              <span className={`dot ${page === 0 ? 'active' : ''}`} />
              <span className={`dot ${page === 1 ? 'active' : ''}`} />
            </div>
            <div className="row">
              {page === 1 && (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setPage(0)}>Back</button>
              )}
              {page === 0 && (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setPage(1)}>Next</button>
              )}
            </div>
            <a className="btn btn-primary btn-block" href={plan.calendarLink} target="_blank" rel="noreferrer">{cta.calendar}</a>
            <div className="row">
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={generate}>{cta.regenerate}</button>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => {
                  try {
                    const s = localStorage.getItem("plans");
                    const arr = s ? JSON.parse(s) : [];
                    const start = new Date(plan.start);
                    const timeStr = start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
                    const flattened = {
                      id: Date.now().toString(),
                      date: plan.start,
                      cafe: plan.cafe.name,
                      time: timeStr,
                      book: plan.books?.[0]?.title || "",
                      outfit: plan.outfit?.suggestion || "",
                      funTip: "",
                      funActivity: plan.funActivity || "",
                      confirmed: true,
                      createdAt: new Date().toISOString(),
                    };
                    const next = [flattened, ...arr].slice(0, 50);
                    localStorage.setItem("plans", JSON.stringify(next));
                    window.location.assign("/shelf");
                  } catch {}
                }}
              >
                {cta.confirm}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



