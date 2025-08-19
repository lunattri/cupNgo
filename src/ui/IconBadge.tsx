"use client";
import React from "react";

type Props = {
  children: React.ReactNode;
  bg?: string; // background color
  size?: number; // square size in px
};

export function IconBadge({ children, bg = "#F6F8FF", size = 64 }: Props) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 18,
        background: bg,
        boxShadow: "0 6px 14px rgba(15,24,49,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{
        filter: "drop-shadow(0 1px 0 rgba(255,255,255,.6))",
        fontSize: Math.round(size * 0.44),
      }}>
        {children}
      </div>
    </div>
  );
}







