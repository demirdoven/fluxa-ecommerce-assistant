"use client";

import { useEffect } from "react";

function randomLetters(length: number): string {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let out = "";
  const cryptoObj: Crypto | undefined = typeof crypto !== "undefined" ? crypto : undefined;
  if (cryptoObj && "getRandomValues" in cryptoObj) {
    const arr = new Uint32Array(length);
    cryptoObj.getRandomValues(arr);
    for (let i = 0; i < length; i++) {
      out += letters[arr[i] % letters.length];
    }
    return out;
  }
  for (let i = 0; i < length; i++) {
    out += letters[Math.floor(Math.random() * letters.length)];
  }
  return out;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomIdLettersOnly(): string {
  const len = randomInt(12, 24); // inclusive
  return randomLetters(len);
}

function randomEmail(): string {
  const user = randomLetters(randomInt(6, 12)).toLowerCase();
  const domain = randomLetters(randomInt(5, 10)).toLowerCase();
  const tld = ["com", "net", "org"][randomInt(0, 2)];
  return `${user}@${domain}.${tld}`;
}

export default function ClientInit() {
  useEffect(() => {
    (async () => {
      try {
        if (typeof window === "undefined") return;
        const LS_KEY = "flx_uuid";
        const LOCK_KEY = "flx_init_in_progress";
        const existing = localStorage.getItem(LS_KEY);
        if (existing && existing.trim()) {
          // Already initialized; keep silent as requested
          return;
        }

        // If another render already started init (React StrictMode dev can double-invoke), skip.
        if (localStorage.getItem(LOCK_KEY) === "1") {
          return;
        }
        localStorage.setItem(LOCK_KEY, "1");

        const id = randomIdLettersOnly();
        const email = randomEmail();

        // Set immediately to close race conditions, then notify listeners
        try {
          localStorage.setItem(LS_KEY, id);
          window.dispatchEvent(new CustomEvent('flx_uuid_ready', { detail: id }));
        } catch {}

        const resp = await fetch("/api/sensay/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, id, linkedAccounts: [], name: "Visitor" }),
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || data?.success === false) {
          // eslint-disable-next-line no-console
          console.error("CREATING NEW USER FAILED:", data || resp.status);
          localStorage.removeItem(LOCK_KEY);
          return;
        }
        // Ensure persisted (it was already set above, but keep idempotent)
        localStorage.setItem(LS_KEY, id);
        localStorage.removeItem(LOCK_KEY);
        // eslint-disable-next-line no-console
        // console.log("CREATING NEW USER:", { email, id });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("ClientInit error:", e);
        try { localStorage.removeItem("flx_init_in_progress"); } catch {}
      }
    })();
  }, []);

  return null;
}
