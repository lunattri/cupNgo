"use client";
import { useEffect, useRef, useState } from "react";

type Node = { id: number; x: number; y: number };

export function BrainCanvas({ onConnect }: { onConnect: () => void }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [hoverId, setHoverId] = useState<number | null>(null);

  useEffect(() => {
    // layout simple geometric "brain" shape
    const cols = 4;
    const rows = 5;
    const w = 320;
    const h = 200;
    const left = 20;
    const top = 20;
    const nx: Node[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const jitter = (Math.random() - 0.5) * 10;
        nx.push({ id: r * cols + c, x: left + (w / (cols - 1)) * c + jitter, y: top + (h / (rows - 1)) * r + jitter });
      }
    }
    setNodes(nx);
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // background gradient
      const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      g.addColorStop(0, "#fffef8");
      g.addColorStop(1, "#fff5d9");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // connections (simple nearest-neighbor aesthetic)
      ctx.strokeStyle = "rgba(30,30,30,0.15)";
      nodes.forEach((n) => {
        nodes.forEach((m) => {
          if (n.id !== m.id && Math.hypot(n.x - m.x, n.y - m.y) < 90) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        });
      });

      // nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.fillStyle = hoverId === n.id ? "#ffb959" : "#1e1e1e";
        ctx.arc(n.x, n.y, hoverId === n.id ? 5 : 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    draw();
  }, [nodes, hoverId]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const h = nodes.find((n) => Math.hypot(n.x - x, n.y - y) < 10)?.id ?? null;
      setHoverId(h);
    };
    const handleDown = () => {
      if (hoverId != null) setDragFrom(hoverId);
    };
    const handleUp = () => {
      if (hoverId != null && dragFrom != null && hoverId !== dragFrom) {
        onConnect();
      }
      setDragFrom(null);
    };
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    return () => {
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [nodes, hoverId, dragFrom, onConnect]);

  return <canvas ref={ref} width={360} height={240} style={{ width: "100%", height: 240, borderRadius: 16 }} />;
}









