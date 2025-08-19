"use client";
import { useEffect, useState } from "react";
import { IconBadge } from "@/ui/IconBadge";
import { Icon } from "@/ui/icons";

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      window.location.assign("/signin");
      return;
    }
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!data.user) {
          window.location.assign("/signin");
          return;
        }
        setEmail(data.user.email);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleSignOut() {
    localStorage.removeItem("auth_token");
    fetch("/api/auth/logout", { method: "POST" }).finally(() => {
      window.location.assign("/signin");
    });
  }

  if (loading) return <div style={{ maxWidth: 720, margin: "2rem auto" }}>Loading…</div>;

  return (
    <div className="container">
      <div className="stack" style={{ gap: 16 }}>
        <div className="card">
          <div className="stack">
            <div className="title" style={{ fontSize: 20 }}>Vibe check</div>
            <div className="subtle">What are you feeling like today?</div>
            <div className="row" style={{ gap: 20, flexWrap: "wrap" }}>
              {[
                { key: "happy", label: "happi", icon: <Icon.moodHappy size={56} /> },
                { key: "meh", label: "meh", icon: <Icon.moodMeh size={56} /> },
                { key: "sad_af", label: "sad af", icon: <Icon.moodSad size={56} /> },
                { key: "mild_sad", label: "mild sad", icon: <Icon.moodMildSad size={56} /> },
                { key: "chill", label: "feeling chill", icon: <Icon.moodChill size={56} /> },
              ].map((v) => (
                <button
                  key={v.key}
                  className="btn btn-secondary"
                  onClick={() => {
                    try { localStorage.setItem("vibe_check", v.key); } catch {}
                    setToast(`${v.label} selected`);
                    setTimeout(() => window.location.assign("/shelf"), 700);
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 120,
                    height: 140,
                    borderRadius: 22,
                    gap: 8,
                  }}
                >
                  <IconBadge size={96}>
                    {v.icon}
                  </IconBadge>
                  <span style={{ fontSize: 14 }}>{v.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {toast && (
          <div className="fade-in" style={{ position: "fixed", left: "50%", bottom: 24, transform: "translateX(-50%)", background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "10px 14px", boxShadow: "0 10px 30px rgba(15,24,49,0.12)", zIndex: 1000 }}>
            <span className="subtle">{toast}</span>
          </div>
        )}
      </div>
    </div>
  );
}


