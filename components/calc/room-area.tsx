"use client"

import { useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"
import { usePersistedState } from "@/lib/use-persisted-state"
import {
  DEFAULT_ROOM_STORE,
  ROOM_STORAGE_KEY,
  notifyRoomsUpdated,
  type Opening,
  type Room,
  type RoomStore,
} from "@/lib/rooms"
import { useT } from "@/lib/i18n/context"

let idCounter = 0
function newId(prefix = "id") {
  idCounter += 1
  return `${prefix}-${Date.now()}-${idCounter}`
}

function createRoom(name: string): Room {
  return {
    id: newId("room"),
    name,
    length: 4,
    width: 3,
    height: 2.7,
    subtractFromWalls: true,
    openings: [
      { id: newId("op"), kind: "window", width: 1.4, height: 1.5, count: 1 },
      { id: newId("op"), kind: "door", width: 0.9, height: 2.1, count: 1 },
    ],
  }
}

export function RoomAreaCalculator() {
  const t = useT()
  const [store, setStore] = usePersistedState<RoomStore>(ROOM_STORAGE_KEY, DEFAULT_ROOM_STORE)

  useEffect(() => {
    notifyRoomsUpdated()
  }, [store])

  const room = store.rooms.find((r) => r.id === store.activeId) ?? store.rooms[0]
  if (!room) return null

  const l = num(room.length)
  const w = num(room.width)
  const h = num(room.height)

  const floor = l * w
  const ceiling = floor
  const perimeter = 2 * (l + w)
  const wallsGross = perimeter * h
  const wallA = l * h
  const wallB = w * h

  const openingsArea = room.openings.reduce(
    (sum, op) => sum + num(op.width) * num(op.height) * num(op.count),
    0,
  )
  const wallsNet = Math.max(0, wallsGross - (room.subtractFromWalls ? openingsArea : 0))
  const totalSurface = wallsNet + floor + ceiling
  const roomName = room.name || t("common.unnamed")

  function patchRoom(patch: Partial<Room>) {
    setStore((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) => (r.id === room.id ? { ...r, ...patch } : r)),
    }))
  }

  function updateOpening(id: string, patch: Partial<Opening>) {
    patchRoom({
      openings: room.openings.map((op) => (op.id === id ? { ...op, ...patch } : op)),
    })
  }

  function addOpening(kind: Opening["kind"]) {
    patchRoom({
      openings: [
        ...room.openings,
        kind === "window"
          ? { id: newId("op"), kind, width: 1.4, height: 1.5, count: 1 }
          : { id: newId("op"), kind, width: 0.9, height: 2.1, count: 1 },
      ],
    })
  }

  function removeOpening(id: string) {
    patchRoom({ openings: room.openings.filter((op) => op.id !== id) })
  }

  function addRoom() {
    const next = createRoom(t("room.defaultName", { n: store.rooms.length + 1 }))
    setStore((prev) => ({
      activeId: next.id,
      rooms: [...prev.rooms, next],
    }))
  }

  function removeRoom(id: string) {
    setStore((prev) => {
      if (prev.rooms.length <= 1) return prev
      const rooms = prev.rooms.filter((r) => r.id !== id)
      const activeId = prev.activeId === id ? rooms[0].id : prev.activeId
      return { rooms, activeId }
    })
  }

  return (
    <CalcLayout
      title={t("room.title")}
      description={t("room.description")}
      reportText={[
        t("room.reportHeader"),
        "",
        t("room.report.room", { name: roomName }),
        t("room.report.dimensions", { dims: `${fmt(l)} x ${fmt(w)} x ${fmt(h)}` }),
        t("room.report.subtract", {
          value: room.subtractFromWalls ? t("common.yes") : t("common.no"),
        }),
        "",
        t("room.report.openingsTitle"),
        ...room.openings.map((op, index) =>
          t("room.report.openingLine", {
            n: index + 1,
            kind: op.kind === "window" ? t("room.kind.window") : t("room.kind.door"),
            w: fmt(num(op.width)),
            h: fmt(num(op.height)),
            count: fmt(num(op.count), 0),
          }),
        ),
        "",
        t("room.report.floor", { value: fmt(floor) }),
        t("room.report.ceiling", { value: fmt(ceiling) }),
        t("room.report.perimeter", { value: fmt(perimeter) }),
        t("room.report.wallsGross", { value: fmt(wallsGross) }),
        t("room.report.openings", { value: fmt(openingsArea) }),
        t("room.report.wallsNet", { value: fmt(wallsNet) }),
        t("room.report.totalSurface", { value: fmt(totalSurface) }),
      ].join("\n")}
      inputs={
        <>
          <Section title={t("room.sections.rooms")} description={t("room.sections.roomsDesc")}>
            <div className="flex flex-col gap-1">
              {store.rooms.map((r) => {
                const isActive = r.id === room.id
                return (
                  <div key={r.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStore((prev) => ({ ...prev, activeId: r.id }))}
                      className={
                        isActive
                          ? "bg-primary text-primary-foreground flex min-w-0 flex-1 items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium"
                          : "text-foreground hover:bg-accent flex min-w-0 flex-1 items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors"
                      }
                    >
                      <span className="truncate">{r.name || t("common.unnamed")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRoom(r.id)}
                      disabled={store.rooms.length <= 1}
                      aria-label={t("room.aria.removeRoom", { name: r.name || t("common.unnamed") })}
                      className="border-border text-muted-foreground hover:border-destructive hover:text-destructive flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors disabled:pointer-events-none disabled:opacity-40"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )
              })}
            </div>
            <button
              type="button"
              onClick={addRoom}
              className="border-border text-foreground hover:bg-accent mt-3 inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
            >
              <Plus className="size-4" /> {t("room.actions.addRoom")}
            </button>
          </Section>

          <Section title={t("room.sections.name")}>
            <label className="flex flex-col gap-1.5">
              <span className="text-foreground text-sm font-medium">{t("room.fields.name")}</span>
              <input
                type="text"
                value={room.name}
                onChange={(e) => patchRoom({ name: e.target.value })}
                placeholder={t("room.fields.namePlaceholder")}
                className="border-input bg-card text-foreground focus:border-primary focus:ring-primary/20 h-11 w-full rounded-lg border px-3 text-base transition-colors outline-none focus:ring-2"
              />
            </label>
          </Section>

          <Section title={t("room.sections.dimensions")}>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label={t("room.fields.length")}
                value={room.length}
                onChange={(length) => patchRoom({ length })}
                unit={t("common.unit.m")}
              />
              <NumberField
                label={t("room.fields.width")}
                value={room.width}
                onChange={(width) => patchRoom({ width })}
                unit={t("common.unit.m")}
              />
              <NumberField
                label={t("room.fields.height")}
                value={room.height}
                onChange={(height) => patchRoom({ height })}
                unit={t("common.unit.m")}
              />
            </div>
          </Section>

          <Section title={t("room.sections.openings")} description={t("room.sections.openingsDesc")}>
            <div className="flex flex-col gap-3">
              {room.openings.map((op) => (
                <div
                  key={op.id}
                  className="border-border bg-background grid grid-cols-1 gap-3 rounded-lg border p-3 sm:grid-cols-2 lg:grid-cols-[7rem_1fr_1fr_1fr_auto] lg:items-end"
                >
                  <label className="flex flex-col gap-1.5">
                    <span className="text-foreground text-sm font-medium">{t("room.fields.type")}</span>
                    <select
                      value={op.kind}
                      onChange={(e) =>
                        updateOpening(op.id, { kind: e.target.value as Opening["kind"] })
                      }
                      className="border-input bg-card text-foreground focus:border-primary focus:ring-primary/20 h-11 rounded-lg border px-2 text-base outline-none focus:ring-2"
                    >
                      <option value="window">{t("room.kind.window")}</option>
                      <option value="door">{t("room.kind.door")}</option>
                    </select>
                  </label>
                  <NumberField
                    label={t("room.fields.width")}
                    value={op.width}
                    onChange={(v) => updateOpening(op.id, { width: v })}
                    unit={t("common.unit.m")}
                  />
                  <NumberField
                    label={t("room.fields.height")}
                    value={op.height}
                    onChange={(v) => updateOpening(op.id, { height: v })}
                    unit={t("common.unit.m")}
                  />
                  <NumberField
                    label={t("room.fields.count")}
                    value={op.count}
                    onChange={(v) => updateOpening(op.id, { count: v })}
                    min={1}
                    step={1}
                  />
                  <button
                    type="button"
                    onClick={() => removeOpening(op.id)}
                    aria-label={t("room.aria.removeOpening")}
                    className="border-border text-muted-foreground hover:border-destructive hover:text-destructive flex h-11 w-full items-center justify-center rounded-lg border transition-colors sm:col-span-2 lg:col-span-1 lg:mb-0.5 lg:w-11"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addOpening("window")}
                className="border-border text-foreground hover:bg-accent inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
              >
                <Plus className="size-4" /> {t("room.actions.addWindow")}
              </button>
              <button
                type="button"
                onClick={() => addOpening("door")}
                className="border-border text-foreground hover:bg-accent inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
              >
                <Plus className="size-4" /> {t("room.actions.addDoor")}
              </button>
            </div>
            <label className="text-foreground mt-4 flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={room.subtractFromWalls}
                onChange={(e) => patchRoom({ subtractFromWalls: e.target.checked })}
                className="size-4 accent-[var(--primary)]"
              />
              {t("room.actions.subtractOpenings")}
            </label>
          </Section>

          <Section title={t("room.sections.wallsSeparate")}>
            <div className="grid gap-2 sm:grid-cols-2">
              <ResultRow
                label={t("room.results.wall", { n: 1, dims: `${fmt(l)} × ${fmt(h)}` })}
                value={fmt(wallA)}
                unit={t("common.unit.m2")}
              />
              <ResultRow
                label={t("room.results.wall", { n: 2, dims: `${fmt(l)} × ${fmt(h)}` })}
                value={fmt(wallA)}
                unit={t("common.unit.m2")}
              />
              <ResultRow
                label={t("room.results.wall", { n: 3, dims: `${fmt(w)} × ${fmt(h)}` })}
                value={fmt(wallB)}
                unit={t("common.unit.m2")}
              />
              <ResultRow
                label={t("room.results.wall", { n: 4, dims: `${fmt(w)} × ${fmt(h)}` })}
                value={fmt(wallB)}
                unit={t("common.unit.m2")}
              />
            </div>
          </Section>
        </>
      }
      results={
        <div>
          <ResultRow label={t("room.results.room")} value={roomName} />
          <ResultRow label={t("room.results.floor")} value={fmt(floor)} unit={t("common.unit.m2")} />
          <ResultRow label={t("room.results.ceiling")} value={fmt(ceiling)} unit={t("common.unit.m2")} />
          <ResultRow label={t("room.results.perimeter")} value={fmt(perimeter)} unit={t("common.unit.m")} />
          <ResultRow
            label={t("room.results.wallsGross")}
            value={fmt(wallsGross)}
            unit={t("common.unit.m2")}
          />
          <ResultRow
            label={t("room.results.openings")}
            value={fmt(openingsArea)}
            unit={t("common.unit.m2")}
          />
          <ResultRow
            label={t("room.results.wallsNet")}
            value={fmt(wallsNet)}
            unit={t("common.unit.m2")}
            emphasize
          />
          <ResultRow
            label={t("room.results.totalSurface")}
            value={fmt(totalSurface)}
            unit={t("common.unit.m2")}
            emphasize
          />
        </div>
      }
    />
  )
}
