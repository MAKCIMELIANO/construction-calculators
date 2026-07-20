"use client"

import { useState } from "react"
import { Home } from "lucide-react"
import { Section, fmt } from "./fields"
import { useRoomMetricsList, type RoomMetrics } from "@/lib/rooms"

export function RoomPicker({
  description,
  onApply,
}: {
  description: string
  onApply: (metrics: RoomMetrics) => void
}) {
  const rooms = useRoomMetricsList()
  const [selectedId, setSelectedId] = useState("")
  const [appliedName, setAppliedName] = useState<string | null>(null)

  const selected = rooms.find((r) => r.id === selectedId)

  function handleApply() {
    if (!selected) return
    onApply(selected)
    setAppliedName(selected.name)
  }

  return (
    <Section
      title="Из комнаты"
      description={description}
    >
      {rooms.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Сначала добавь комнату во вкладке «Площадь комнаты».
        </p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Комната</span>
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value)
                setAppliedName(null)
              }}
              className="h-11 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Выбери комнату…</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — пол {fmt(r.floor)} м², стены {fmt(r.wallsNet)} м²
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={!selected}
            onClick={handleApply}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-40"
          >
            <Home className="size-4" />
            Подставить
          </button>
        </div>
      )}

      {selected ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Периметр {fmt(selected.perimeter)} м · высота {fmt(selected.height)} м · проёмы{" "}
          {fmt(selected.openingsArea)} м² · пол {fmt(selected.floor)} м² · стены чистые{" "}
          {fmt(selected.wallsNet)} м²
        </p>
      ) : null}

      {appliedName ? (
        <p className="mt-2 text-xs font-medium text-primary">Подставлено из «{appliedName}»</p>
      ) : null}
    </Section>
  )
}
