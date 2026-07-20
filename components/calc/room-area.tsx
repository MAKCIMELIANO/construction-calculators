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
    const next = createRoom(`Комната ${store.rooms.length + 1}`)
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
      title="Площадь комнаты"
      description="Считает пол, потолок и стены. Можно завести несколько комнат (зал, спальня…) — данные сохраняются на этом устройстве."
      reportText={[
        "СтройКалькулятор — Площадь комнаты",
        "",
        `Комната: ${room.name || "Без названия"}`,
        `Размеры: ${fmt(l)} x ${fmt(w)} x ${fmt(h)} м`,
        `Вычитать проёмы: ${room.subtractFromWalls ? "да" : "нет"}`,
        "",
        "Проёмы:",
        ...room.openings.map(
          (op, index) =>
            `${index + 1}. ${op.kind === "window" ? "Окно" : "Дверь"}: ${fmt(num(op.width))} x ${fmt(num(op.height))} м, ${fmt(num(op.count), 0)} шт`,
        ),
        "",
        `Пол: ${fmt(floor)} м²`,
        `Потолок: ${fmt(ceiling)} м²`,
        `Периметр: ${fmt(perimeter)} м`,
        `Стены без вычета: ${fmt(wallsGross)} м²`,
        `Проёмы: ${fmt(openingsArea)} м²`,
        `Стены чистые: ${fmt(wallsNet)} м²`,
        `Всего поверхностей: ${fmt(totalSurface)} м²`,
      ].join("\n")}
      inputs={
        <>
          <Section title="Комнаты" description="Добавьте комнаты объекта и укажите размеры.">
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
                          ? "flex min-w-0 flex-1 items-center rounded-lg bg-primary px-3 py-2.5 text-left text-sm font-medium text-primary-foreground"
                          : "flex min-w-0 flex-1 items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      }
                    >
                      <span className="truncate">{r.name || "Без названия"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRoom(r.id)}
                      disabled={store.rooms.length <= 1}
                      aria-label={`Удалить ${r.name}`}
                      className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive disabled:pointer-events-none disabled:opacity-40"
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
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Plus className="size-4" /> Добавить комнату
            </button>
          </Section>

          <Section title="Название">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">Как назвать</span>
              <input
                type="text"
                value={room.name}
                onChange={(e) => patchRoom({ name: e.target.value })}
                placeholder="Например: Зал, Спальня"
                className="h-11 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </Section>

          <Section title="Размеры комнаты">
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label="Длина"
                value={room.length}
                onChange={(length) => patchRoom({ length })}
                unit="м"
              />
              <NumberField
                label="Ширина"
                value={room.width}
                onChange={(width) => patchRoom({ width })}
                unit="м"
              />
              <NumberField
                label="Высота"
                value={room.height}
                onChange={(height) => patchRoom({ height })}
                unit="м"
              />
            </div>
          </Section>

          <Section title="Окна и двери" description="Добавьте проёмы, чтобы вычесть их площадь из стен.">
            <div className="flex flex-col gap-3">
              {room.openings.map((op) => (
                <div
                  key={op.id}
                  className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-background p-3 sm:grid-cols-2 lg:grid-cols-[7rem_1fr_1fr_1fr_auto] lg:items-end"
                >
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-foreground">Тип</span>
                    <select
                      value={op.kind}
                      onChange={(e) => updateOpening(op.id, { kind: e.target.value as Opening["kind"] })}
                      className="h-11 rounded-lg border border-input bg-card px-2 text-base text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="window">Окно</option>
                      <option value="door">Дверь</option>
                    </select>
                  </label>
                  <NumberField
                    label="Ширина"
                    value={op.width}
                    onChange={(v) => updateOpening(op.id, { width: v })}
                    unit="м"
                  />
                  <NumberField
                    label="Высота"
                    value={op.height}
                    onChange={(v) => updateOpening(op.id, { height: v })}
                    unit="м"
                  />
                  <NumberField
                    label="Кол-во"
                    value={op.count}
                    onChange={(v) => updateOpening(op.id, { count: v })}
                    min={1}
                    step={1}
                  />
                  <button
                    type="button"
                    onClick={() => removeOpening(op.id)}
                    aria-label="Удалить проём"
                    className="flex h-11 w-full items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive sm:col-span-2 lg:col-span-1 lg:mb-0.5 lg:w-11"
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Plus className="size-4" /> Добавить окно
              </button>
              <button
                type="button"
                onClick={() => addOpening("door")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Plus className="size-4" /> Добавить дверь
              </button>
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={room.subtractFromWalls}
                onChange={(e) => patchRoom({ subtractFromWalls: e.target.checked })}
                className="size-4 accent-[var(--primary)]"
              />
              Вычитать проёмы из площади стен
            </label>
          </Section>

          <Section title="Стены по отдельности">
            <div className="grid gap-2 sm:grid-cols-2">
              <ResultRow label={`Стена 1 (${fmt(l)} × ${fmt(h)})`} value={fmt(wallA)} unit="м²" />
              <ResultRow label={`Стена 2 (${fmt(l)} × ${fmt(h)})`} value={fmt(wallA)} unit="м²" />
              <ResultRow label={`Стена 3 (${fmt(w)} × ${fmt(h)})`} value={fmt(wallB)} unit="м²" />
              <ResultRow label={`Стена 4 (${fmt(w)} × ${fmt(h)})`} value={fmt(wallB)} unit="м²" />
            </div>
          </Section>
        </>
      }
      results={
        <div>
          <ResultRow label="Комната" value={room.name || "—"} />
          <ResultRow label="Пол" value={fmt(floor)} unit="м²" />
          <ResultRow label="Потолок" value={fmt(ceiling)} unit="м²" />
          <ResultRow label="Периметр" value={fmt(perimeter)} unit="м" />
          <ResultRow label="Стены (без вычета)" value={fmt(wallsGross)} unit="м²" />
          <ResultRow label="Проёмы" value={fmt(openingsArea)} unit="м²" />
          <ResultRow label="Стены (чистые)" value={fmt(wallsNet)} unit="м²" emphasize />
          <ResultRow label="Всего поверхностей" value={fmt(totalSurface)} unit="м²" emphasize />
        </div>
      }
    />
  )
}
