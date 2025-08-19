"use client";
import { useEffect, useMemo, useState } from "react";
import { useTone } from "@/ui/ToneProvider";
import { Dropdown } from "@/ui/Dropdown";
import { Icon } from "@/ui/icons";
import Image from "next/image";
import { renderCafeText, renderTimeText, renderBooksHeader, renderOutfitText, renderFunTipText, getCtaLabels, renderHeader } from "@/lib/tone";

type Vibe = "any" | "cozy" | "quiet" | "airy" | "artsy" | "study";

export default function OnboardingPage() {
  const [vibes, setVibes] = useState<Vibe[]>(["any"]);
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [useManualTime, setUseManualTime] = useState<boolean>(false);
  const [time, setTime] = useState<string>("");
  const [autoTime, setAutoTime] = useState<string>("");
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);
  const { tone } = useTone();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<null | { vibe: string; cafe: { name: string; address: string; image: string }; books: { title: string; author: string; image: string }[]; outfit: { suggestion: string; colors: string[] }; start: string; end: string; calendarLink: string; funTip: string; }>(null);

  const disabled = useMemo(() => !date || vibes.length === 0, [date, vibes]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setGeo(null),
        { enableHighAccuracy: true, maximumAge: 60_000, timeout: 10_000 }
      );
    }
  }, []);

  // Helper to pick a reasonable random time (10:00–17:45, 15-min intervals)
  function generateRandomTimeString(): string {
    const startHour = 10;
    const endHour = 17; // inclusive
    const hour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
    const minuteChoices = [0, 15, 30, 45];
    const minute = minuteChoices[Math.floor(Math.random() * minuteChoices.length)];
    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  // Generate on mount
  useEffect(() => {
    setAutoTime(generateRandomTimeString());
  }, []);

  // Re-roll suggested time when date changes (only if not using manual time)
  useEffect(() => {
    if (!useManualTime) {
      setAutoTime(generateRandomTimeString());
    }
  }, [date, useManualTime]);

  function toggleVibe(v: Vibe) {
    const next = vibes.includes(v) ? vibes.filter(x => x !== v) : [...vibes, v];
    setVibes(next.slice(0,3));
  }

  useEffect(() => {
    try {
      const pref = localStorage.getItem("vibe_pref");
      if (pref) setVibes([pref as Vibe]);
    } catch {}
  }, []);

  return (
    <div className="container">
      <div className="stack" style={{ gap: 16 }}>
        <h1 className="title">{renderHeader(tone as any)}</h1>
        <p className="subtle">Choose a cafe, vibe and date. You can set time manually or let us pick.</p>

        <div className="card">
          <div className="stack">
            
            <div>
              <label className="label">Your location</label>
              <div className="subtle">{geo ? `${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)}` : "Using device location if permitted"}</div>
            </div>
            <div>
              <label className="label">Cafe vibe</label>
              <Dropdown
                ariaLabel="Select cafe vibe"
                value={vibes[0]}
                onChange={(v) => setVibes([v as Vibe])}
                options={[
                  { value: "cozy", label: "Cozy", icon: <Icon.cozy /> },
                  { value: "chic", label: "Chic", icon: <Icon.chic /> } as any,
                  { value: "minimalist", label: "Minimalist", icon: <Icon.minimalist /> } as any,
                  { value: "quiet", label: "Quiet", icon: <Icon.quiet /> },
                  { value: "crowded", label: "Crowded", icon: <Icon.crowded /> } as any,
                  { value: "not_busy", label: "Not busy", icon: <Icon.not_busy /> } as any,
                  { value: "airy", label: "Airy", icon: <Icon.airy /> },
                  { value: "study", label: "Study", icon: <Icon.study /> },
                  { value: "colorful", label: "Colorful", icon: <Icon.colorful /> } as any,
                  { value: "artsy", label: "Artsy", icon: <Icon.artsy /> },
                ] as any}
              />
            </div>
            <div>
              <label className="label">Day</label>
              <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="label">Time</label>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={useManualTime}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setUseManualTime(next);
                      if (next && !time && autoTime) {
                        setTime(autoTime);
                      }
                    }}
                  />
                  <span>Set time manually</span>
                </label>
                {useManualTime && (
                  <input
                    className="input"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{ width: 160 }}
                  />
                )}
              </div>
              {!useManualTime && (
                <div className="subtle">
                  We’ll pick a great time based on your day
                  {autoTime && (
                    <>
                      {" "}— suggested {new Date(`${date}T${autoTime}:00`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </>
                  )}
                </div>
              )}
            </div>
            <button
              disabled={disabled || loading}
              className="btn btn-primary btn-block"
              onClick={async () => {
                try {
                  setLoading(true);
                  setError(null);
                  setPlan(null);
                  const origin = geo ?? undefined;
                  const mood = (() => { try { return localStorage.getItem("vibe_check") || undefined; } catch { return undefined; } })();
                  const effectiveTime = useManualTime && time ? time : (autoTime || generateRandomTimeString());
                  const start = `${date}T${effectiveTime}:00`;
                  const res = await fetch("/api/plan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ date, vibes, origin, start, mood }),
                  });
                  if (!res.ok) throw new Error("Failed to generate plan");
                  const data = await res.json();
                  setPlan({ ...data, start: data.start, end: data.end });
                  try { sessionStorage.setItem("last_plan", JSON.stringify(data)); } catch {}
                } catch (e: any) {
                  setError(e.message || "Something went wrong");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? "Generating…" : getCtaLabels(tone as any).confirm}
            </button>
          </div>
        </div>

        <div className="subtle">Tip: You can leave Cafe blank and we’ll pick one for you.</div>

        {error && (
          <div className="card">
            <div className="subtle" style={{ color: "#b00020" }}>{error}</div>
          </div>
        )}

        {plan && (
          <div className="stack" style={{ gap: 16 }}>
            <div className="card">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="stack" style={{ gap: 8 }}>
                  <div className="row"><span className="badge">{plan.vibe}</span></div>
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
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => window.location.assign("/plan/view")}
                >
                  Next
                </button>
                <button
                  className="btn btn-secondary btn-block"
                  onClick={async () => {
                    try {
                      setLoading(true);
                      setError(null);
                      const origin = geo ?? undefined;
                      const effectiveTime = useManualTime && time ? time : (autoTime || generateRandomTimeString());
                      const start = `${date}T${effectiveTime}:00`;
                      const res = await fetch("/api/plan", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ date, vibes, origin, start }),
                      });
                      if (!res.ok) throw new Error("Failed to regenerate plan");
                      const data = await res.json();
                      setPlan({ ...data, start: data.start, end: data.end });
                      try { sessionStorage.setItem("last_plan", JSON.stringify(data)); } catch {}
                    } catch (e: any) {
                      setError(e.message || "Something went wrong");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {getCtaLabels(tone as any).regenerate}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


