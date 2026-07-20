"use client"

import { useState } from "react"
import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"

export function PaintCalculator() {
  const [area, setArea] = useState<number | "">(40)
  const [openings, setOpenings] = useState<number | "">(0)
  const [coats, setCoats] = useState<number | "">(2)
  const [consumption, setConsumption] = useState<number | "">(0.12) // л/м² за слой
  const [canVolume, setCanVolume] = useState<number | "">(2.5)

  const paintArea = Math.max(0, num(area) - num(openings))
  const litres = paintArea * num(consumption) * num(coats)
  const cans = num(canVolume) > 0 ? Math.ceil(litres / num(canVolume)) : 0

  return (
    <CalcLayout
      title="Краска"
      description="Расчёт литров краски и количества банок по площади, расходу и числу слоёв."
      reportText={[
        "СтройКалькулятор — Краска",
        "",
        `Площадь окраски: ${fmt(num(area))} м²`,
        `Вычесть проёмы: ${fmt(num(openings))} м²`,
        `Слоёв: ${fmt(num(coats), 0)}`,
        `Расход за слой: ${fmt(num(consumption), 3)} л/м²`,
        `Объём банки: ${fmt(num(canVolume))} л`,
        "",
        `Площадь: ${fmt(paintArea)} м²`,
        `Требуется краски: ${fmt(litres)} л`,
        `Банок купить: ${cans} шт`,
      ].join("\n")}
      inputs={
        <>
          <Section title="Поверхность">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Площадь окраски" value={area} onChange={setArea} unit="м²" />
              <NumberField label="Вычесть проёмы" value={openings} onChange={setOpenings} unit="м²" />
            </div>
          </Section>
          <Section title="Параметры краски">
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField label="Слоёв" value={coats} onChange={setCoats} min={1} step={1} />
              <NumberField label="Расход за слой" value={consumption} onChange={setConsumption} unit="л/м²" />
              <NumberField label="Объём банки" value={canVolume} onChange={setCanVolume} unit="л" />
            </div>
          </Section>
        </>
      }
      results={
        <div>
          <ResultRow label="Площадь" value={fmt(paintArea)} unit="м²" />
          <ResultRow label="Требуется краски" value={fmt(litres)} unit="л" emphasize />
          <ResultRow label="Банок купить" value={cans} unit="шт" emphasize />
        </div>
      }
    />
  )
}
