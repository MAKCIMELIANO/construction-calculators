"use client"

import { useState } from "react"
import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"

export function PlasterCalculator() {
  const [area, setArea] = useState<number | "">(30)
  const [openings, setOpenings] = useState<number | "">(4)
  const [thickness, setThickness] = useState<number | "">(15) // мм
  const [consumption, setConsumption] = useState<number | "">(8.5) // кг/м² на 10мм
  const [bagWeight, setBagWeight] = useState<number | "">(30)

  const wallArea = Math.max(0, num(area) - num(openings))
  const t = num(thickness)
  const dryKg = wallArea * num(consumption) * (t / 10)
  const bags = num(bagWeight) > 0 ? Math.ceil(dryKg / num(bagWeight)) : 0

  return (
    <CalcLayout
      title="Штукатурка"
      description="Количество мешков штукатурной смеси по площади стен и толщине слоя."
      reportText={[
        "СтройКалькулятор — Штукатурка",
        "",
        `Площадь стен: ${fmt(num(area))} м²`,
        `Вычесть проёмы: ${fmt(num(openings))} м²`,
        `Толщина слоя: ${fmt(t, 0)} мм`,
        `Расход на 10 мм: ${fmt(num(consumption), 1)} кг/м²`,
        `Вес мешка: ${fmt(num(bagWeight), 0)} кг`,
        "",
        `Площадь стен: ${fmt(wallArea)} м²`,
        `Сухая смесь: ${fmt(dryKg, 0)} кг`,
        `Мешков купить: ${bags} шт`,
      ].join("\n")}
      inputs={
        <>
          <Section title="Стены">
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField label="Площадь стен" value={area} onChange={setArea} unit="м²" />
              <NumberField label="Вычесть проёмы" value={openings} onChange={setOpenings} unit="м²" />
              <NumberField label="Толщина слоя" value={thickness} onChange={setThickness} unit="мм" />
            </div>
          </Section>
          <Section title="Смесь" description="Расход обычно указан на упаковке на 10 мм слоя.">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Расход на 10мм" value={consumption} onChange={setConsumption} unit="кг/м²" />
              <NumberField label="Вес мешка" value={bagWeight} onChange={setBagWeight} unit="кг" />
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
