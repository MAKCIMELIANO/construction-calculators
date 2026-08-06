"use client"

import { useEffect, useState } from "react"

export function usePersistedState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    const isServer = typeof window === "undefined"
    // #region agent log
    if (isServer) {
      // server: cannot fetch; skip
    } else {
      fetch("http://127.0.0.1:7521/ingest/75578629-efc8-4af4-a1a9-a560773acbbe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "ce2b3f",
        },
        body: JSON.stringify({
          sessionId: "ce2b3f",
          runId: "pre-fix",
          hypothesisId: "A",
          location: "use-persisted-state.ts:init",
          message: "usePersistedState initializer",
          data: {
            key,
            isServer,
            hasStored: !!localStorage.getItem(key),
            storedPreview: (localStorage.getItem(key) || "").slice(0, 120),
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
    }
    // #endregion
    if (isServer) return initial
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return initial
      return JSON.parse(raw) as T
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // ignore quota / private mode
    }
  }, [key, state])

  return [state, setState] as const
}
