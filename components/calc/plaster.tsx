"use client"

import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"
import { usePersistedState } from "@/lib/use-persisted-state"

type PlasterState = {
  area: number | ""
  openings: number | ""
  thickness: number | ""
  consumption: number | ""
  bagWeight: number | ""
}

const INITIAL: PlasterState = {
  area: 30,
  openings: 4,
  thickness: 15,
  consumption: 8.5,
  bagWeight: 30,
}

export function PlasterCalculator() {
  const [s, setS] = usePersistedState<PlasterState>("calc-plaster-v1", INITIAL)

  const wallArea = Math.max(0, num(s.area) - num(s.openings))
  const t = num(s.thickness)
  const dryKg = wallArea * num(s.consumption) * (t / 10)
  const bags = num(s.bagWeight) > 0 ? Math.ceil(dryKg / num(s.bagWeight)) : 0

  return (
    <CalcLayout
      title="Штукатурка"
      description="Количество мешков штукатурной смеси по площади стен и толщине слоя."
      reportText={[
        "СтройКалькулятор — Штукатурка",
        "",
        `Площадь стен: ${fmt(num(s.area))} м²`,
        `Вычесть проёмы: ${fmt(num(s.openings))} м²`,
        `Толщина слоя: ${fmt(t, 0)} мм`,
        `Расход на 10 мм: ${fmt(num(s.consumption), 1)} кг/м²`,
        `Вес мешка: ${fmt(num(s.bagWeight), 0)} кг`,
        "",
        `Площадь стен: ${fmt(wallArea)} м²`,
        `Сухая смесь: ${fmt(dryKg, 0)} кг`,
        `Мешков купить: ${bags} шт`,
      ].join("\n")}
      inputs={
        <>
          <Section title="Стены">
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label="Площадь стен"
                value={s.area}
                onChange={(area) => setS((p) => ({ ...p, area }))}
                unit="м²"
              />
              <NumberField
                label="Вычесть проёмы"
                value={s.openings}
                onChange={(openings) => setS((p) => ({ ...p, openings }))}
                unit="м²"
              />
              <NumberField
                label="Толщина слоя"
                value={s.thickness}
                onChange={(thickness) => setS((p) => ({ ...p, thickness }))}
                unit="мм"
                step={1}
              />
            </div>
          </Section>
          <Section title="Смесь" description="Расход обычно указан на упаковке на 10 мм слоя.">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Расход на 10мм"
                value={s.consumption}
                onChange={(consumption) => setS((p) => ({ ...p, consumption }))}
                unit="кг/м²"
              />
              <NumberField
                label="Вес мешка"
                value={s.bagWeight}
                onChange={(bagWeight) => setS((p) => ({ ...p, bagWeight }))}
                unit="кг"
                step={1}
              />
            </div>
          </Section>
        </>
      }
      results={
        <div>
          <ResultRow label="Площадь стен" value={fmt(wallArea)} unit="м²" />
          <ResultRow label="Сухая смесь" value={fmt(dryKg, 0)} unit="кг" />
          <ResultRow label="Мешков купить" value={bags} unit="шт" emphasize />
        </div>
      }
    />
  )
}
