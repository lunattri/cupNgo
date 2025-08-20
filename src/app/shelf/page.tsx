"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconBadge } from "@/ui/IconBadge";
import { AddressAutocomplete } from "@/ui/AddressAutocomplete";
import { Modal } from "@/ui/Modal";
import { CircleModal } from "@/ui/CircleModal";
import { Skeleton } from "@/ui/Skeleton";

interface PlanListItem {
  id: string;
  start: string;
  end: string;
  cafe: { name: string; address: string; image?: string };
  book?: string;
  outfit?: string;
  funTip?: string;
  funActivity?: string;
  confirmed: boolean;
  createdAt: string;
  participants: string[];
}

export default function ShelfPage() {
  const router = useRouter();
  const [items, setItems] = useState<PlanListItem[]>([]);
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);
  const [showLocationSetup, setShowLocationSetup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [q, setQ] = useState("");
  const [onlyConfirmed] = useState(true);
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [addFriendEmail, setAddFriendEmail] = useState("");
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  async function fetchPlans() {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (onlyConfirmed) params.set("confirmed", "true");
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/plans?${params.toString()}`, { cache: "no-store", headers: { Authorization: token ? `Bearer ${token}` : "" } });
      if (!res.ok) throw new Error("Failed to load plans");
      const data = await res.json();
      setItems(data.items || []);
    } catch (e: any) {
      setError(e.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // If not logged in, redirect to signup
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        window.location.assign("/signup");
        return;
      }
    } catch {}
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, onlyConfirmed]);

  useEffect(() => {
    // Load saved location
    const savedLocation = localStorage.getItem("preferred_origin");
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setGeo(parsed);
      } catch (e) {
        console.error("Failed to parse saved location");
      }
    }
  }, []);

  async function addParticipant(planId: string, email: string) {
    try {
      const res = await fetch(`/api/plans/${planId}/participants`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!res.ok) throw new Error("Failed to add participant");
      await fetchPlans();
    } catch (e) {
      alert((e as any).message || "Failed to add participant");
    }
  }

  const getConfirmedPlans = () => items.filter(p => p.confirmed).slice(0, 5);
  const getRecentPlans = () => items.slice(0, 5);

  async function surpriseMe() {
    const date = new Date().toISOString().slice(0, 10);
    const vibes = ["any"];
    const origin = geo ?? undefined;
    const mood = (() => { try { return localStorage.getItem("vibe_check") || undefined; } catch { return undefined; } })();
    const res = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, vibes, origin, mood }),
    });

    if (res.ok) {
      const plan = await res.json();
      sessionStorage.setItem("last_plan", JSON.stringify(plan));
      router.push("/plan/view");
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="container">
      {/* Location Setup - Top Left Corner */}
      <div className="location-corner">
        <button 
          onClick={() => setShowLocationSetup(!showLocationSetup)}
          className="location-toggle"
          title="Set your location for cafe recommendations"
        >
          📍
        </button>
        
        {showLocationSetup && (
          <div className="location-panel">
            <h3>Set Your Location</h3>
            <p>This helps us find cafes near you</p>
            
            <button 
              onClick={() => {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    const newGeo = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setGeo(newGeo);
                    localStorage.setItem("preferred_origin", JSON.stringify(newGeo));
                    setShowLocationSetup(false);
                  },
                  () => alert("Couldn't get your location")
                );
              }}
              className="btn btn-block"
            >
              Use My Location
            </button>
            
            <div className="divider">or</div>
            
            <AddressAutocomplete
              onSelect={async ({ description, place_id }) => {
                try {
                  const res = await fetch(`/api/places/details?id=${encodeURIComponent(place_id)}`);
                  if (!res.ok) return;
                  const info = await res.json();
                  const newGeo = info?.location || null;
                  if (newGeo) {
                    setGeo(newGeo);
                    localStorage.setItem("preferred_origin", JSON.stringify(newGeo));
                    setShowLocationSetup(false);
                  }
                } catch {}
              }}
            />
            
            {geo && (
              <div className="current-location">
                <span>📍 Current: {geo.lat.toFixed(4)}, {geo.lng.toFixed(4)}</span>
                <button 
                  onClick={() => {
                    setGeo(null);
                    localStorage.removeItem("preferred_origin");
                  }}
                  className="btn-small"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Shelf Content */}
      <div className="shelf-container">
        <h1 className="title">Your Shelf</h1>
        
        {/* Dashboard Section */}
        <div className="shelf-dashboard">
          <div className="dashboard-header">
            <h2>Create a Plan</h2>
            <p>Plan your next solo date adventure</p>
          </div>
          
          <div className="dashboard-actions">
            <button 
              onClick={() => router.push("/onboarding")}
              className="btn btn-primary btn-block"
            >
              ✨ Create Plan
            </button>
            
            <button 
              onClick={() => router.push("/instant")}
              className="btn btn-secondary btn-block"
            >
              🎲 Surprise Me
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="card">
          <div className="row" style={{ gap: 12, alignItems: "center" }}>
            <input className="input" placeholder="Search by cafe, book, people..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        {/* Confirmed Plans Shelf (only if there are items) */}
        {loading ? (
          <div className="shelf-section">
            <div className="shelf-header">
              <h3>📚 Confirmed Plans</h3>
              <span className="shelf-count">—</span>
            </div>
            <div className="plans-grid">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="plan-card confirmed">
                  <div className="plan-header">
                    <Skeleton width={120} height={16} />
                    <Skeleton width={80} height={16} />
                  </div>
                  <div className="plan-content">
                    <div className="plan-item"><Skeleton width={180} height={14} /></div>
                    <div className="plan-item"><Skeleton width={100} height={14} /></div>
                    <div className="plan-item"><Skeleton width={160} height={14} /></div>
                    <div className="plan-item"><Skeleton width={120} height={14} /></div>
                  </div>
                  <div className="plan-footer">
                    <Skeleton width={200} height={12} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : getConfirmedPlans().length > 0 && (
          <div className="shelf-section">
            <div className="shelf-header">
              <h3>📚 Confirmed Plans</h3>
              <span className="shelf-count">{getConfirmedPlans().length}</span>
            </div>
            <div className="plans-grid">
              {getConfirmedPlans().map((plan) => (
                <div key={plan.id} className="plan-card confirmed">
                  <div className="plan-header">
                    <span className="plan-date">{formatDate(plan.start)}</span>
                    <span className="plan-status">✓ Confirmed</span>
                  </div>
                  <div className="plan-content">
                    <div className="plan-item">
                      <span className="item-label">☕</span>
                      <span className="item-text">{plan.cafe.name}</span>
                    </div>
                    <div className="plan-item">
                      <span className="item-label">🕐</span>
                      <span className="item-text">{new Date(plan.start).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                    </div>
                    <div className="plan-item">
                      <span className="item-label">📖</span>
                      <span className="item-text">{plan.book}</span>
                    </div>
                    <div className="plan-item">
                      <span className="item-label">👕</span>
                      <span className="item-text">{plan.outfit}</span>
                    </div>
                    {!!plan.participants?.length && (
                      <div className="plan-item">
                        <span className="item-label">👥</span>
                        <span className="item-text">{plan.participants.join(", ")}</span>
                      </div>
                    )}
                  </div>
                  <div className="plan-footer">
                    <span className="fun-tip">💡 {plan.funTip}</span>
                    <button className="btn btn-small" onClick={() => { setActivePlanId(plan.id); setAddFriendOpen(true); }}>Add friend</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Generated Plans (only if there are items) */}
        {loading ? (
          <div className="shelf-section">
            <div className="shelf-header">
              <h3>🔄 Recent Generated</h3>
              <span className="shelf-count">—</span>
            </div>
            <div className="plans-grid">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="plan-card pending">
                  <div className="plan-header">
                    <Skeleton width={120} height={16} />
                    <Skeleton width={80} height={16} />
                  </div>
                  <div className="plan-content">
                    <div className="plan-item"><Skeleton width={180} height={14} /></div>
                    <div className="plan-item"><Skeleton width={100} height={14} /></div>
                    <div className="plan-item"><Skeleton width={160} height={14} /></div>
                    <div className="plan-item"><Skeleton width={120} height={14} /></div>
                  </div>
                  <div className="plan-footer">
                    <Skeleton width={200} height={12} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : getRecentPlans().length > 0 && (
          <div className="shelf-section">
            <div className="shelf-header">
              <h3>🔄 Recent Generated</h3>
              <span className="shelf-count">{getRecentPlans().length}</span>
            </div>
            <div className="plans-grid">
              {getRecentPlans().map((plan) => (
                <div key={plan.id} className={`plan-card ${plan.confirmed ? 'confirmed' : 'pending'}`}>
                  <div className="plan-header">
                    <span className="plan-date">{formatDate(plan.start)}</span>
                    <span className={`plan-status ${plan.confirmed ? 'confirmed' : 'pending'}`}>
                      {plan.confirmed ? '✓ Confirmed' : '⏳ Pending'}
                    </span>
                  </div>
                  <div className="plan-content">
                    <div className="plan-item">
                      <span className="item-label">☕</span>
                      <span className="item-text">{plan.cafe.name}</span>
                    </div>
                    <div className="plan-item">
                      <span className="item-label">🕐</span>
                      <span className="item-text">{new Date(plan.start).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                    </div>
                    <div className="plan-item">
                      <span className="item-label">📖</span>
                      <span className="item-text">{plan.book}</span>
                    </div>
                    <div className="plan-item">
                      <span className="item-label">👕</span>
                      <span className="item-text">{plan.outfit}</span>
                    </div>
                  </div>
                  <div className="plan-footer">
                    <span className="fun-tip">💡 {plan.funTip}</span>
                    <button className="btn btn-small" onClick={() => { setActivePlanId(plan.id); setAddFriendOpen(true); }}>Add friend</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <CircleModal
          open={addFriendOpen}
          onClose={() => { setAddFriendOpen(false); setAddFriendEmail(""); setActivePlanId(null); }}
          size={280}
          accent="#CFF6C8"
          secondary="#FFF3B0"
        >
          <div className="stack" style={{ gap: 10 }}>
            <div className="title" style={{ fontSize: 18 }}>Add a Friend</div>
            <div className="subtle">Invite a buddy to join this plan</div>
            <input
              className="input"
              type="email"
              placeholder="friend@gmail.com"
              value={addFriendEmail}
              onChange={(e) => setAddFriendEmail(e.target.value)}
              style={{ textAlign: "center" }}
            />
            <div className="row" style={{ gap: 8, justifyContent: "center" }}>
              <button className="btn btn-secondary" onClick={() => { setAddFriendOpen(false); setAddFriendEmail(""); setActivePlanId(null); }} style={{ minWidth: 96 }}>Cancel</button>
              <button
                className="btn btn-primary"
                style={{ minWidth: 96 }}
                onClick={async () => {
                  if (!activePlanId || !addFriendEmail) return;
                  await addParticipant(activePlanId, addFriendEmail);
                  setAddFriendOpen(false);
                  setAddFriendEmail("");
                  setActivePlanId(null);
                }}
              >
                Add
              </button>
            </div>
          </div>
        </CircleModal>
      </div>
    </div>
  );
}


