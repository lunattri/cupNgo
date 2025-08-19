"use client";
import { useState } from "react";
import { useTone } from "@/ui/ToneProvider";
import { Dropdown } from "@/ui/Dropdown";
import { Icon } from "@/ui/icons";
import Link from "next/link";

export default function TonePage() {
  const { tone: currentTone, setTone } = useTone();
  const [tone, setToneLocal] = useState<string>(currentTone);

  return (
    <div className="container">
      <div className="stack" style={{ gap: 16 }}>
        <h1 className="title">Set your tone</h1>
        <div className="card">
          <div className="stack">
            <Dropdown
              ariaLabel="Select tone"
              value={tone}
              onChange={(v) => setToneLocal(v)}
              options={[
                { value: "bucky", label: "Bucky (assertive/heroic)", icon: <Icon.bucky /> },
                { value: "saira", label: "Saira (friendly)", icon: <Icon.saira /> },
                { value: "hai", label: "Hai (dominant)", icon: <Icon.hai /> },
                { value: "bubbles", label: "Bubbles (chill)", icon: <Icon.ari /> },
                { value: "friday", label: "Friday (rude but nice)", icon: <Icon.taylor /> },
                { value: "taylor", label: "Taylor (formal)", icon: <Icon.taylor /> },
              ]}
            />
            <button
              className="btn btn-primary btn-block"
              onClick={() => {
                setTone(tone as any);
                window.location.assign("/shelf");
              }}
            >
              Continue
            </button>
          </div>
        </div>
        <div><Link className="btn btn-secondary" href="/shelf">Skip</Link></div>
      </div>
    </div>
  );
}




