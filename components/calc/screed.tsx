"use client"

import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"
import { usePersistedState } from "@/lib/use-persisted-state"

type ScreedState = {
  area: number | ""
  thickness: number | ""
  consumption: number | ""
  bagWeight: number | ""
}

const INITIAL: ScreedState = {
  area: 20,
  thickness: 50,
  consumption: 18,
  bagWeight: 25,
}

export function ScreedCalculator() {
  const [s, setS] = usePersistedState<ScreedState>("calc-screed-v1", INITIAL)

  const a = num(s.area)
  const t = num(s.thickness)
  const volume = a * (t / 1000)
  const drySmesKg = a * num(s.consumption) * (t / 10)
  const bags = num(s.bagWeight) > 0 ? Math.ceil(drySmesKg / num(s.bagWeight)) : 0

  return (
    <CalcLayout
      title="Стяжка / смесь"
      description="Объём стяжки и количество мешков сухой смеси по площади и толщине слоя."
      reportText={[
        "СтройКалькулятор — Стяжка / смесь",
        "",
        `Площадь: ${fmt(a)} м²`,
        `Толщина слоя: ${fmt(t, 0)} мм`,
        `Расход на 10 мм: ${fmt(num(s.consumption), 0)} кг/м²`,
        `Вес мешка: ${fmt(num(s.bagWeight), 0)} кг`,
        "",
        `Объём: ${fmt(volume, 3)} м³`,
        `Сухая смесь: ${fmt(drySmesKg, 0)} кг`,
        `Мешков купить: ${bags} шт`,
      ].join("\n")}
      inputs={
        <>
          <Section title="Параметры пола">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Площадь"
                value={s.area}
                onChange={(area) => setS((p) => ({ ...p, area }))}
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
          <ResultRow label="Объём" value={fmt(volume, 3)} unit="м³" />
          <ResultRow label="Сухая смесь" value={fmt(drySmesKg, 0)} unit="кг" />
          <ResultRow label="Мешков купить" value={bags} unit="шт" emphasize />
        </div>
      }
    />
  )
}
