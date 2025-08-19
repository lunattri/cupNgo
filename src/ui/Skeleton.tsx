"use client";

export function Skeleton({ width = "100%", height = 16, radius = 8 }: { width?: number | string; height?: number | string; radius?: number | string }) {
  return (
    <>
      <div
        className="skeleton-shimmer"
        style={{
          width,
          height,
          borderRadius: radius,
          background: "linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.12) 37%, rgba(0,0,0,0.06) 63%)",
          backgroundSize: "400% 100%",
          animation: "skeletonShimmer 1.2s ease-in-out infinite",
        }}
      />
      <style jsx>{`
        @keyframes skeletonShimmer {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
    </>
  );
}


