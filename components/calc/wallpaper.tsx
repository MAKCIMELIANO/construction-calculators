"use client"

import { useState } from "react"
import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"

export function WallpaperCalculator() {
  const [perimeter, setPerimeter] = useState<number | "">(14)
  const [height, setHeight] = useState<number | "">(2.7)
  const [openings, setOpenings] = useState<number | "">(3.5)
  const [rollWidth, setRollWidth] = useState<number | "">(1.06)
  const [rollLength, setRollLength] = useState<number | "">(10)
  const [rapport, setRapport] = useState<number | "">(0)

  const p = num(perimeter)
  const h = num(height)
  const wallArea = Math.max(0, p * h - num(openings))

  const rw = num(rollWidth)
  const rl = num(rollLength)
  const rap = num(rapport)

  // strips per roll accounting for pattern repeat
  const stripHeight = h + rap
  const stripsPerRoll = stripHeight > 0 ? Math.floor(rl / stripHeight) : 0
  const stripsNeeded = rw > 0 ? Math.ceil(p / rw) : 0
  const rollsByStrips = stripsPerRoll > 0 ? Math.ceil(stripsNeeded / stripsPerRoll) : 0

  const rollArea = rw * rl
  const rollsByArea = rollArea > 0 ? Math.ceil((wallArea * 1.1) / rollArea) : 0

  const rolls = Math.max(rollsByStrips, rollsByArea)

  return (
    <CalcLayout
      title="Обои"
      description="Расчёт количества рулонов обоев по периметру стен, высоте и размеру рулона."
      reportText={[
        "СтройКалькулятор — Обои",
        "",
        `Периметр стен: ${fmt(p)} м`,
        `Высота: ${fmt(h)} м`,
        `Площадь проёмов: ${fmt(num(openings))} м²`,
        `Размер рулона: ${fmt(rw)} x ${fmt(rl)} м`,
        `Раппорт: ${fmt(rap)} м`,
        "",
        `Площадь стен: ${fmt(wallArea)} м²`,
        `Полос на рулон: ${stripsPerRoll} шт`,
        `Нужно полос: ${stripsNeeded} шт`,
        `Рулонов по полосам: ${rollsByStrips} шт`,
        `Рулонов по площади: ${rollsByArea} шт`,
        `Купить рулонов: ${rolls} шт`,
      ].join("\n")}
      inputs={
        <>
          <Section title="Стены">
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField label="Периметр стен" value={perimeter} onChange={setPerimeter} unit="м" />
              <NumberField label="Высота" value={height} onChange={setHeight} unit="м" />
              <NumberField label="Площадь проёмов" value={openings} onChange={setOpenings} unit="м²" />
            </div>
          </Section>
          <Section title="Параметры рулона">
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField label="Ширина рулона" value={rollWidth} onChange={setRollWidth} unit="м" />
              <NumberField label="Длина рулона" value={rollLength} onChange={setRollLength} unit="м" />
              <NumberField label="Раппорт (подгонка)" value={rapport} onChange={setRapport} unit="м" />
            </div>
          </Section>
        </>
      }
      results={
        <div>
          <ResultRow label="Площадь стен" value={fmt(wallArea)} unit="м²" />
          <ResultRow label="Полос на рулон" value={stripsPerRoll} unit="шт" />
          <ResultRow label="Нужно полос" value={stripsNeeded} unit="шт" />
          <ResultRow label="Рулонов (по полосам)" value={rollsByStrips} unit="шт" />
          <ResultRow label="Рулонов (по площади)" value={rollsByArea} unit="шт" />
          <ResultRow label="Купить рулонов" value={rolls} unit="шт" emphasize />
        </div>
      }
    />
  )
}
