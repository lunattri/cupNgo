"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to sign in");
      }
      const data = await res.json();
      localStorage.setItem("auth_token", data.token);
      window.location.assign("/vibes");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: "2rem auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", marginBottom: 12, gap: 8 }}>
        <h1 style={{ margin: 0 }}>Lock in</h1>
        <div style={{ position: "relative" }}>
          <div style={{
            background: "#fff", border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 16, padding: 10, maxWidth: 300,
            boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
          }}>
            <small style={{ fontSize: 10, color: "#606060", lineHeight: 1.3 }}>
              TAKING AWAY FROM MAKING DECISIONS SO U DONT <strong>break</strong> YOUR BRAIN WHILE TRYING TO GET A CUP OF WATER
            </small>
            <div style={{
              position: "absolute", top: "50%", right: -6, transform: "translateY(-50%)",
              width: 0, height: 0, borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent", borderLeft: "8px solid rgba(0,0,0,0.12)"
            }} />
            <div style={{
              position: "absolute", top: "50%", right: -5, transform: "translateY(-50%)",
              width: 0, height: 0, borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent", borderLeft: "8px solid #fff"
            }} />
          </div>
        </div>
      </div>
      <p className="subtle" style={{ marginBottom: 16 }}>overload on fun and not choices</p>
      <form onSubmit={onSubmit}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <div style={{ flex: "1 1 260px" }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>
        </div>
        {error && (
          <p style={{ color: "red", marginBottom: 12 }}>{error}</p>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="submit"
            disabled={loading}
            aria-label="Lock in"
            className="btn btn-primary"
            style={{ width: 56, height: 56, borderRadius: "50%", padding: 0, fontSize: 20 }}
          >
            {loading ? "🔒" : "🔓"}
          </button>
        </div>
      </form>
    </div>
  );
}


