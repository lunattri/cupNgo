"use client";
import { useMemo, useState } from "react";
import { activities } from "@/data/activities";

function pickTwo(): [string, string] {
  const a = activities[Math.floor(Math.random() * activities.length)];
  let b = activities[Math.floor(Math.random() * activities.length)];
  if (b === a) b = activities[(activities.indexOf(a) + 7) % activities.length];
  return [a, b];
}

export function FunnyChoiceGame() {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [pair, setPair] = useState<[string, string]>(() => pickTwo());

  const done = round > 5;
  const vibe = useMemo(() => (score >= 3 ? "spontaneous" : "intentional"), [score]);

  function choose(which: 0 | 1) {
    if (done) return;
    setScore((s) => s + (which === 0 ? 1 : 0));
    setRound((r) => r + 1);
    setPair(pickTwo());
  }

  return (
    <div className="stack">
      <div className="subtle">Quick silly warm‑up • Round {Math.min(round, 5)} / 5</div>
      {!done ? (
        <>
          <div className="card">
            <div className="stack">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <button className="btn btn-secondary btn-block" onClick={() => choose(0)}>{pair[0]}</button>
                <button className="btn btn-secondary btn-block" onClick={() => choose(1)}>{pair[1]}</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <div className="stack">
            <div className="title">You’re {vibe} today ✨</div>
            <div className="subtle">Let’s turn that into a plan.</div>
            <a className="btn btn-primary btn-block" href="/onboarding">Create a plan</a>
            <a className="btn btn-secondary btn-block" href="/shelf">Go to shelf</a>
          </div>
        </div>
      )}
    </div>
  );
}








