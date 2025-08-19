"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type CanonicalTone = "bucky" | "saira" | "hai" | "bubbles" | "friday" | "taylor";
type AnyTone =
  | CanonicalTone
  | "friendly"
  | "dominant"
  | "chill"
  | "mean"
  | "assertive"
  | "formal"
  | "kind"
  | "enthusiastic"
  | "bratty";

function normalizeTone(tone: AnyTone): CanonicalTone {
  switch (tone) {
    case "friendly":
    case "kind":
      return "saira";
    case "dominant":
      return "hai";
    case "chill":
      return "bubbles";
    case "mean":
    case "bratty":
      return "friday";
    case "assertive":
    case "enthusiastic":
      return "bucky";
    case "formal":
      return "taylor";
    default:
      return tone as CanonicalTone;
  }
}

type ToneContextValue = {
  tone: CanonicalTone;
  setTone: (tone: AnyTone) => void;
};

const ToneContext = createContext<ToneContextValue | undefined>(undefined);

export function ToneProvider({ children }: { children: React.ReactNode }) {
  const [tone, setToneState] = useState<CanonicalTone>(() => {
    try {
      const saved = localStorage.getItem("ui_tone");
      return saved ? normalizeTone(saved as AnyTone) : "saira";
    } catch {
      return "saira";
    }
  });

  const setTone = (t: AnyTone) => {
    const normalized = normalizeTone(t);
    setToneState(normalized);
    try {
      localStorage.setItem("ui_tone", normalized);
    } catch {}
  };

  useEffect(() => {
    try {
      document.body.setAttribute("data-tone", tone);
    } catch {}
  }, [tone]);

  const value = useMemo(() => ({ tone, setTone }), [tone]);

  return <ToneContext.Provider value={value}>{children}</ToneContext.Provider>;
}

export function useTone() {
  const ctx = useContext(ToneContext);
  if (!ctx) throw new Error("useTone must be used within a ToneProvider");
  return ctx;
}






