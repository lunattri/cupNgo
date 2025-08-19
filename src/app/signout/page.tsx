"use client";
import { useState } from "react";
import Link from "next/link";

type SignOutState = "idle" | "processing" | "done" | "error";

export default function SignOutPage() {
  const [state, setState] = useState<SignOutState>("idle");

  async function handleSignOut() {
    try {
      setState("processing");
      localStorage.removeItem("auth_token");
      await fetch("/api/auth/logout", { method: "POST" });
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "2rem auto", textAlign: "center" }}>
      {state === "idle" && (
        <>
          <h1>Ready to sign out?</h1>
          <p>This will end your current session.</p>
          <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={handleSignOut}>Sign out</button>
            <Link href="/dashboard">Cancel</Link>
          </div>
        </>
      )}

      {state === "processing" && <h1>Signing you out…</h1>}

      {state === "done" && (
        <>
          <h1>You have been signed out</h1>
          <div style={{ marginTop: 16 }}>
            <Link href="/signin">Go to sign in</Link>
          </div>
        </>
      )}

      {state === "error" && (
        <>
          <h1>Something went wrong</h1>
          <p>Please try again.</p>
          <div style={{ marginTop: 16 }}>
            <button onClick={handleSignOut}>Try again</button>
          </div>
        </>
      )}
    </div>
  );
}


