"use client";

import { ReactNode } from "react";

export function CircleModal({
  open,
  onClose,
  children,
  accent = "#FFB959",
  secondary,
  size = 320,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  accent?: string; // primary color
  secondary?: string; // optional secondary color for gradient
  size?: number;
}) {
  if (!open) return null;
  const diameter = size;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: size + 12,
          height: size + 12,
          borderRadius: "50%",
          border: `2px dashed ${accent}66`,
          animation: "spin 1.6s linear infinite",
        }}
      />
      <div
        style={{
          width: diameter,
          height: diameter,
          borderRadius: "50%",
          background: secondary
            ? `radial-gradient(ellipse at top, ${accent} 0%, ${secondary} 55%, #ffffff 75%)`
            : `radial-gradient(ellipse at top, ${accent} 0%, #ffffff 60%)`,
          boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
          border: `2px solid ${accent}55`,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "none",
            background: accent,
            color: "#1E1E1E",
            cursor: "pointer",
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          ×
        </button>
        <div style={{ textAlign: "center", width: "85%" }}>
          {children}
        </div>
      </div>
      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}


