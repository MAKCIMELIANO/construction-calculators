"use client"

import { useState } from "react"
import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"

export function ScreedCalculator() {
  const [area, setArea] = useState<number | "">(20)
  const [thickness, setThickness] = useState<number | "">(50) // мм
  const [consumption, setConsumption] = useState<number | "">(18) // кг/м² на 10мм
  const [bagWeight, setBagWeight] = useState<number | "">(25)

  const a = num(area)
  const t = num(thickness)
  const volume = a * (t / 1000) // м³
  const drySmesKg = a * num(consumption) * (t / 10)
  const bags = num(bagWeight) > 0 ? Math.ceil(drySmesKg / num(bagWeight)) : 0

  return (
    <CalcLayout
      title="Стяжка / смесь"
      description="Объём стяжки и количество мешков сухой смеси по площади и толщине слоя."
      reportText={[
        "СтройКалькулятор — Стяжка / смесь",
        "",
        `Площадь: ${fmt(a)} м²`,
        `Толщина слоя: ${fmt(t, 0)} мм`,
        `Расход на 10 мм: ${fmt(num(consumption), 0)} кг/м²`,
        `Вес мешка: ${fmt(num(bagWeight), 0)} кг`,
        "",
        `Объём: ${fmt(volume, 3)} м³`,
        `Сухая смесь: ${fmt(drySmesKg, 0)} кг`,
        `Мешков купить: ${bags} шт`,
      ].join("\n")}
      inputs={
        <>
          <Section title="Параметры пола">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Площадь" value={area} onChange={setArea} unit="м²" />
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
          <ResultRow label="Объём" value={fmt(volume, 3)} unit="м³" />
          <ResultRow label="Сухая смесь" value={fmt(drySmesKg, 0)} unit="кг" />
          <ResultRow label="Мешков купить" value={bags} unit="шт" emphasize />
        </div>
      }
    />
  )
}
