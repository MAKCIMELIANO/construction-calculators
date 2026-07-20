"use client"

import { useEffect, useState } from "react"

export function usePersistedState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial
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
