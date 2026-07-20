"use client"

import { useSyncExternalStore } from "react"

function num(v: number | ""): number {
  return typeof v === "number" && !Number.isNaN(v) ? v : 0
}

export const ROOM_STORAGE_KEY = "calc-room-v1"
export const ROOM_UPDATED_EVENT = "calc-room-updated"

export type Opening = {
  id: string
  kind: "window" | "door"
  width: number | ""
  height: number | ""
  count: number | ""
}

export type Room = {
  id: string
  name: string
  length: number | ""
  width: number | ""
  height: number | ""
  subtractFromWalls: boolean
  openings: Opening[]
}

export type RoomStore = {
  activeId: string
  rooms: Room[]
}

export type RoomMetrics = {
  id: string
  name: string
  length: number
  width: number
  height: number
  perimeter: number
  floor: number
  ceiling: number
  wallsGross: number
  openingsArea: number
  wallsNet: number
}

export const DEFAULT_ROOM_STORE: RoomStore = {
  activeId: "room-default",
  rooms: [
    {
      id: "room-default",
      name: "Зал",
      length: 4,
      width: 3,
      height: 2.7,
      subtractFromWalls: true,
      openings: [
        { id: "op-window-1", kind: "window", width: 1.4, height: 1.5, count: 1 },
        { id: "op-door-1", kind: "door", width: 0.9, height: 2.1, count: 1 },
      ],
    },
  ],
}

export function computeRoomMetrics(room: Room): RoomMetrics {
  const length = num(room.length)
  const width = num(room.width)
  const height = num(room.height)
  const perimeter = 2 * (length + width)
  const floor = length * width
  const wallsGross = perimeter * height
  const openingsArea = room.openings.reduce(
    (sum, op) => sum + num(op.width) * num(op.height) * num(op.count),
    0,
  )
  const wallsNet = Math.max(0, wallsGross - (room.subtractFromWalls ? openingsArea : 0))

  return {
    id: room.id,
    name: room.name || "Без названия",
    length,
    width,
    height,
    perimeter,
    floor,
    ceiling: floor,
    wallsGross,
    openingsArea,
    wallsNet,
  }
}

export function readRoomStore(): RoomStore {
  if (typeof window === "undefined") return DEFAULT_ROOM_STORE
  try {
    const raw = localStorage.getItem(ROOM_STORAGE_KEY)
    if (!raw) return DEFAULT_ROOM_STORE
    const parsed = JSON.parse(raw) as RoomStore
    if (!parsed?.rooms?.length) return DEFAULT_ROOM_STORE
    return parsed
  } catch {
    return DEFAULT_ROOM_STORE
  }
}

export function listRoomMetrics(): RoomMetrics[] {
  return readRoomStore().rooms.map(computeRoomMetrics)
}

export function notifyRoomsUpdated() {
  if (typeof window === "undefined") return
  cachedSnapshot = null
  window.dispatchEvent(new Event(ROOM_UPDATED_EVENT))
}

function subscribeRooms(onStoreChange: () => void) {
  function handle() {
    cachedSnapshot = null
    onStoreChange()
  }
  window.addEventListener(ROOM_UPDATED_EVENT, handle)
  window.addEventListener("storage", handle)
  return () => {
    window.removeEventListener(ROOM_UPDATED_EVENT, handle)
    window.removeEventListener("storage", handle)
  }
}

let cachedSnapshot: { raw: string | null; metrics: RoomMetrics[] } | null = null

function getRoomsSnapshot(): RoomMetrics[] {
  const raw = localStorage.getItem(ROOM_STORAGE_KEY)
  if (cachedSnapshot && cachedSnapshot.raw === raw) return cachedSnapshot.metrics
  const metrics = listRoomMetrics()
  cachedSnapshot = { raw, metrics }
  return metrics
}

const serverSnapshot = DEFAULT_ROOM_STORE.rooms.map(computeRoomMetrics)

export function useRoomMetricsList(): RoomMetrics[] {
  return useSyncExternalStore(subscribeRooms, getRoomsSnapshot, () => serverSnapshot)
}
