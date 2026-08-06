"use client"

import { useEffect, useState } from "react"

export function usePersistedState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) setState(JSON.parse(raw) as T)
    } catch {
      // ignore broken JSON / private mode
    }
    setHydrated(true)
  }, [key])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // ignore quota / private mode
    }
  }, [key, state, hydrated])

  return [state, setState] as const
}
