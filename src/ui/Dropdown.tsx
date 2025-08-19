"use client";
import { useEffect, useRef, useState } from "react";

type Option<T extends string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

export function Dropdown<T extends string>(props: {
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  placeholder?: string;
  ariaLabel?: string;
}) {
  const { value, onChange, options, placeholder, ariaLabel } = props;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="input"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          textAlign: "left",
          paddingInline: 12,
          height: 48,
        }}
        onClick={() => setOpen((s) => !s)}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {selected?.icon}
          <span>{selected?.label ?? placeholder ?? "Select"}</span>
        </span>
        <span aria-hidden>▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            zIndex: 20,
            left: 0,
            right: 0,
            marginTop: 6,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="btn"
              style={{
                width: "100%",
                height: 44,
                background: opt.value === value ? "var(--color-primary-50)" : "transparent",
                border: "none",
                borderRadius: 0,
                justifyContent: "flex-start",
                paddingInline: 12,
                color: "inherit",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {opt.icon}
                <span>{opt.label}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}









