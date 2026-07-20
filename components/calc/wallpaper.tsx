"use client"

import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"
import { usePersistedState } from "@/lib/use-persisted-state"

type WallpaperState = {
  perimeter: number | ""
  height: number | ""
  openings: number | ""
  rollWidth: number | ""
  rollLength: number | ""
  rapport: number | ""
}

const INITIAL: WallpaperState = {
  perimeter: 14,
  height: 2.7,
  openings: 3.5,
  rollWidth: 1.06,
  rollLength: 10,
  rapport: 0,
}

export function WallpaperCalculator() {
  const [s, setS] = usePersistedState<WallpaperState>("calc-wallpaper-v1", INITIAL)

  const p = num(s.perimeter)
  const h = num(s.height)
  const wallArea = Math.max(0, p * h - num(s.openings))

  const rw = num(s.rollWidth)
  const rl = num(s.rollLength)
  const rap = num(s.rapport)

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
        `Площадь проёмов: ${fmt(num(s.openings))} м²`,
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
              <NumberField
                label="Периметр стен"
                value={s.perimeter}
                onChange={(perimeter) => setS((prev) => ({ ...prev, perimeter }))}
                unit="м"
              />
              <NumberField
                label="Высота"
                value={s.height}
                onChange={(height) => setS((prev) => ({ ...prev, height }))}
                unit="м"
              />
              <NumberField
                label="Площадь проёмов"
                value={s.openings}
                onChange={(openings) => setS((prev) => ({ ...prev, openings }))}
                unit="м²"
              />
            </div>
          </Section>
          <Section title="Параметры рулона">
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label="Ширина рулона"
                value={s.rollWidth}
                onChange={(rollWidth) => setS((prev) => ({ ...prev, rollWidth }))}
                unit="м"
              />
              <NumberField
                label="Длина рулона"
                value={s.rollLength}
                onChange={(rollLength) => setS((prev) => ({ ...prev, rollLength }))}
                unit="м"
              />
              <NumberField
                label="Раппорт (подгонка)"
                value={s.rapport}
                onChange={(rapport) => setS((prev) => ({ ...prev, rapport }))}
                unit="м"
              />
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
