"use client";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container" style={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <div className="stack fade-in" style={{ alignItems: "center", gap: 16 }}>
        <div style={{ width: 220, height: 220 }}>
          <Image src="/spiral.svg" alt="Spiral" width={220} height={220} priority />
        </div>
        <h1 className="title" style={{ fontSize: 28 }}>cupNgo</h1>
        <p className="subtle" style={{ textAlign: "center" }}>Solo dates, simplified</p>
        <p className="subtle" style={{ textAlign: "center" }}>overload on fun, not choices</p>
        <a className="btn btn-primary btn-block" href="/vibes">Get started</a>
      </div>
    </div>
  );
}
