"use client"

import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"
import { usePersistedState } from "@/lib/use-persisted-state"

type PaintState = {
  area: number | ""
  openings: number | ""
  coats: number | ""
  consumption: number | ""
  canVolume: number | ""
}

const INITIAL: PaintState = {
  area: 40,
  openings: 0,
  coats: 2,
  consumption: 0.12,
  canVolume: 2.5,
}

export function PaintCalculator() {
  const [s, setS] = usePersistedState<PaintState>("calc-paint-v1", INITIAL)

  const paintArea = Math.max(0, num(s.area) - num(s.openings))
  const litres = paintArea * num(s.consumption) * num(s.coats)
  const cans = num(s.canVolume) > 0 ? Math.ceil(litres / num(s.canVolume)) : 0

  return (
    <CalcLayout
      title="Краска"
      description="Расчёт литров краски и количества банок по площади, расходу и числу слоёв."
      reportText={[
        "СтройКалькулятор — Краска",
        "",
        `Площадь окраски: ${fmt(num(s.area))} м²`,
        `Вычесть проёмы: ${fmt(num(s.openings))} м²`,
        `Слоёв: ${fmt(num(s.coats), 0)}`,
        `Расход за слой: ${fmt(num(s.consumption), 3)} л/м²`,
        `Объём банки: ${fmt(num(s.canVolume))} л`,
        "",
        `Площадь: ${fmt(paintArea)} м²`,
        `Требуется краски: ${fmt(litres)} л`,
        `Банок купить: ${cans} шт`,
      ].join("\n")}
      inputs={
        <>
          <Section title="Поверхность">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Площадь окраски"
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
            </div>
          </Section>
          <Section title="Параметры краски">
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label="Слоёв"
                value={s.coats}
                onChange={(coats) => setS((p) => ({ ...p, coats }))}
                min={1}
                step={1}
              />
              <NumberField
                label="Расход за слой"
                value={s.consumption}
                onChange={(consumption) => setS((p) => ({ ...p, consumption }))}
                unit="л/м²"
              />
              <NumberField
                label="Объём банки"
                value={s.canVolume}
                onChange={(canVolume) => setS((p) => ({ ...p, canVolume }))}
                unit="л"
              />
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
