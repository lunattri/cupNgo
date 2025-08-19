"use client";
import { useEffect, useRef, useState } from "react";

type Suggestion = { description: string; place_id: string };

export function AddressAutocomplete({
  onSelect,
  placeholder = "Enter your address",
}: {
  onSelect: (payload: { description: string; place_id: string }) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    async function run() {
      if (!query || query.length < 3) { setSuggestions([]); return; }
      const res = await fetch(`/api/places/autocomplete?q=${encodeURIComponent(query)}`, { signal: ctrl.signal });
      if (!res.ok) return;
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setOpen(true);
    }
    run();
    return () => ctrl.abort();
  }, [query]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        className="input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {open && suggestions.length > 0 && (
        <div style={{ position: "absolute", zIndex: 30, left: 0, right: 0, background: "#fff", borderRadius: 12, boxShadow: "0 10px 24px rgba(0,0,0,0.08)", overflow: "hidden", marginTop: 6 }}>
          {suggestions.map((s) => (
            <button
              key={s.place_id}
              className="btn"
              style={{ height: 44, border: "none", background: "transparent", justifyContent: "flex-start", paddingInline: 12 }}
              onClick={() => { onSelect(s); setOpen(false); setQuery(s.description); }}
            >
              {s.description}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}








