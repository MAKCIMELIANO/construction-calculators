"use client"

import { useState } from "react"
import { Home } from "lucide-react"
import { Section, fmt } from "./fields"
import { useRoomMetricsList, type RoomMetrics } from "@/lib/rooms"
import { useT } from "@/lib/i18n/context"

export function RoomPicker({
  description,
  onApply,
}: {
  description: string
  onApply: (metrics: RoomMetrics) => void
}) {
  const t = useT()
  const rooms = useRoomMetricsList()
  const [selectedId, setSelectedId] = useState("")
  const [appliedName, setAppliedName] = useState<string | null>(null)

  const selected = rooms.find((r) => r.id === selectedId)

  function handleApply() {
    if (!selected) return
    onApply(selected)
    setAppliedName(selected.name || t("common.unnamed"))
  }

  return (
    <Section title={t("roomPicker.title")} description={description}>
      {rooms.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("roomPicker.empty")}</p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="text-foreground text-sm font-medium">{t("roomPicker.room")}</span>
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value)
                setAppliedName(null)
              }}
              className="border-input bg-card text-foreground focus:border-primary focus:ring-primary/20 h-11 w-full rounded-lg border px-3 text-base outline-none focus:ring-2"
            >
              <option value="">{t("roomPicker.select")}</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {t("roomPicker.option", {
                    name: r.name || t("common.unnamed"),
                    floor: fmt(r.floor),
                    walls: fmt(r.wallsNet),
                  })}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={!selected}
            onClick={handleApply}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40"
          >
            <Home className="size-4" />
            {t("roomPicker.apply")}
          </button>
        </div>
      )}

      {selected ? (
        <p className="text-muted-foreground mt-3 text-xs">
          {t("roomPicker.hint", {
            perimeter: fmt(selected.perimeter),
            height: fmt(selected.height),
            openings: fmt(selected.openingsArea),
            floor: fmt(selected.floor),
            walls: fmt(selected.wallsNet),
          })}
        </p>
      ) : null}

      {appliedName ? (
        <p className="text-primary mt-2 text-xs font-medium">
          {t("roomPicker.applied", { name: appliedName })}
        </p>
      ) : null}
    </Section>
  )
}
