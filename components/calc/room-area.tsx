"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"

type Opening = {
  id: string
  kind: "window" | "door"
  width: number | ""
  height: number | ""
  count: number | ""
}

let idCounter = 0
function newId() {
  idCounter += 1
  return `op-${idCounter}`
}

export function RoomAreaCalculator() {
  const [length, setLength] = useState<number | "">(4)
  const [width, setWidth] = useState<number | "">(3)
  const [height, setHeight] = useState<number | "">(2.7)
  const [subtractFromWalls, setSubtractFromWalls] = useState(true)
  const [openings, setOpenings] = useState<Opening[]>([
    { id: newId(), kind: "window", width: 1.4, height: 1.5, count: 1 },
    { id: newId(), kind: "door", width: 0.9, height: 2.1, count: 1 },
  ])

  const l = num(length)
  const w = num(width)
  const h = num(height)

  const floor = l * w
  const ceiling = floor
  const perimeter = 2 * (l + w)
  const wallsGross = perimeter * h

  // per-wall breakdown (two pairs)
  const wallA = l * h // long walls x2 later
  const wallB = w * h

  const openingsArea = openings.reduce((sum, op) => sum + num(op.width) * num(op.height) * num(op.count), 0)
  const wallsNet = Math.max(0, wallsGross - (subtractFromWalls ? openingsArea : 0))
  const totalSurface = wallsNet + floor + ceiling

  function updateOpening(id: string, patch: Partial<Opening>) {
    setOpenings((prev) => prev.map((op) => (op.id === id ? { ...op, ...patch } : op)))
  }

  function addOpening(kind: Opening["kind"]) {
    setOpenings((prev) => [
      ...prev,
      kind === "window"
        ? { id: newId(), kind, width: 1.4, height: 1.5, count: 1 }
        : { id: newId(), kind, width: 0.9, height: 2.1, count: 1 },
    ])
  }

  function removeOpening(id: string) {
    setOpenings((prev) => prev.filter((op) => op.id !== id))
  }

  return (
    <CalcLayout
      title="Площадь комнаты"
      description="Считает пол, потолок и все 4 стены отдельно. Окна и двери можно вычесть из площади стен."
      reportText={[
        "СтройКалькулятор — Площадь комнаты",
        "",
        `Размеры: ${fmt(l)} x ${fmt(w)} x ${fmt(h)} м`,
        `Вычитать проёмы: ${subtractFromWalls ? "да" : "нет"}`,
        "",
        "Проёмы:",
        ...openings.map(
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
          <Section title="Размеры комнаты">
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField label="Длина" value={length} onChange={setLength} unit="м" />
              <NumberField label="Ширина" value={width} onChange={setWidth} unit="м" />
              <NumberField label="Высота" value={height} onChange={setHeight} unit="м" />
            </div>
          </Section>

          <Section
            title="Окна и двери"
            description="Добавьте проёмы, чтобы вычесть их площадь из стен."
          >
            <div className="flex flex-col gap-3">
              {openings.map((op) => (
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
                  <NumberField label="Ширина" value={op.width} onChange={(v) => updateOpening(op.id, { width: v })} unit="м" />
                  <NumberField label="Высота" value={op.height} onChange={(v) => updateOpening(op.id, { height: v })} unit="м" />
                  <NumberField label="Кол-во" value={op.count} onChange={(v) => updateOpening(op.id, { count: v })} min={1} step={1} />
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
                checked={subtractFromWalls}
                onChange={(e) => setSubtractFromWalls(e.target.checked)}
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
