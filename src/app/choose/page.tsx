import { IconBadge } from "@/ui/IconBadge";
import { Icon } from "@/ui/icons";

export default function ChoosePage() {
  return (
    <div className="container">
      <div className="stack" style={{ gap: 16 }}>
        <h1 className="title">Choose your mode</h1>
        <div className="card">
          <div className="row" style={{ gap: 20, justifyContent: "space-between", flexWrap: "wrap" }}>
            <a href="/shelf?mode=solo" style={{ textDecoration: "none" }}>
              <div className="stack" style={{ alignItems: "center", gap: 10 }}>
                <IconBadge size={96}><Icon.modeSolo size={56} /></IconBadge>
                <div className="title" style={{ fontSize: 18 }}>Solo date</div>
              </div>
            </a>
            <a href="/shelf?mode=together" style={{ textDecoration: "none" }}>
              <div className="stack" style={{ alignItems: "center", gap: 10 }}>
                <IconBadge size={96}><Icon.modeTogether size={56} /></IconBadge>
                <div className="title" style={{ fontSize: 18 }}>With someone</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}



