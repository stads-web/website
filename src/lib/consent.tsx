"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ConsentChoice = "accepted" | "rejected";

interface ConsentState {
  choice: ConsentChoice | null;
  bannerOpen: boolean;
  acceptAll: () => void;
  reject: () => void;
  openSettings: () => void;
}

const STORAGE_KEY = "stads-cookie-consent";

const ConsentContext = createContext<ConsentState | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  // Starts closed on both server and first client render (avoids a flash-of-banner
  // mismatch), then opens after mount if no stored choice exists yet.
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "accepted" || stored === "rejected") {
        setChoice(stored);
      } else {
        setBannerOpen(true);
      }
    } catch {
      setBannerOpen(true);
    }
  }, []);

  const persist = useCallback((next: ConsentChoice) => {
    setChoice(next);
    setBannerOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (private mode etc.) - consent still applies for this session
    }
  }, []);

  const acceptAll = useCallback(() => persist("accepted"), [persist]);
  const reject = useCallback(() => persist("rejected"), [persist]);
  const openSettings = useCallback(() => setBannerOpen(true), []);

  return (
    <ConsentContext.Provider
      value={{ choice, bannerOpen, acceptAll, reject, openSettings }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return ctx;
}
