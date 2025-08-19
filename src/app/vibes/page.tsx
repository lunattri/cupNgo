"use client";
import Image from "next/image";

type VibeCard = {
  key: string;
  title: string;
  image: string;
  caption: string;
};

const VIBES: VibeCard[] = [
  { key: "cozy", title: "Cozy wood", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1600&auto=format&fit=crop", caption: "warm woods, calm corners" },
  { key: "airy", title: "Bright + airy", image: "https://images.unsplash.com/photo-1461988091159-192b6df7054f?q=80&w=1600&auto=format&fit=crop", caption: "sunlit, pastel blues" },
  { key: "artsy", title: "Artsy color", image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1600&auto=format&fit=crop", caption: "statement walls, playful" },
  { key: "quiet", title: "Minimal quiet", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop", caption: "clean, low-noise" },
  { key: "study", title: "Study focus", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1600&auto=format&fit=crop", caption: "get-it-done energy" },
  { key: "colorful", title: "Playful color", image: "https://images.unsplash.com/photo-1520975922376-4b1f04f3e05c?q=80&w=1600&auto=format&fit=crop", caption: "bold, fun, bright" },
];

export default function VibesPage() {
  return (
    <div className="container">
      <div className="stack" style={{ gap: 16 }}>
        <h1 className="title">Pick your vibe</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          {VIBES.map(v => (
            <button
              key={v.key}
              onClick={() => {
                try { localStorage.setItem("vibe_pref", v.key); } catch {}
                window.location.assign("/shelf");
              }}
              className="card"
              style={{ textAlign: "left", padding: 0, overflow: "hidden", display: "block", width: "100%" }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
                <Image src={v.image} alt={v.title} fill style={{ objectFit: "cover" }} />
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontWeight: 700 }}>{v.title}</div>
                <div className="subtle">{v.caption}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="card">
          <div className="subtle">We will recommend books and an outfit that match this vibe. You can always change your mind later.</div>
        </div>
        <a className="btn btn-secondary btn-block" href="/shelf">Continue without picking</a>
      </div>
    </div>
  );
}


