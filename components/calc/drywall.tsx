"use client"

import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"
import { RoomPicker } from "./room-picker"
import { usePersistedState } from "@/lib/use-persisted-state"

function round1(n: number) {
  return Math.round(n * 10) / 10
}

type DrywallState = {
  area: number | ""
  openings: number | ""
  sheetWidth: number | ""
  sheetHeight: number | ""
  wastePercent: number | ""
  screwsPerSheet: number | ""
}

const INITIAL: DrywallState = {
  area: 40,
  openings: 4,
  sheetWidth: 1.2,
  sheetHeight: 2.5,
  wastePercent: 10,
  screwsPerSheet: 50,
}

export function DrywallCalculator() {
  const [s, setS] = usePersistedState<DrywallState>("calc-drywall-v1", INITIAL)

  const wallArea = Math.max(0, num(s.area) - num(s.openings))
  const sheetArea = num(s.sheetWidth) * num(s.sheetHeight)
  const withWaste = wallArea * (1 + num(s.wastePercent) / 100)
  const sheets = sheetArea > 0 ? Math.ceil(withWaste / sheetArea) : 0
  const screws = sheets * num(s.screwsPerSheet)

  return (
    <CalcLayout
      title="Гипсокартон"
      description="Количество листов ГКЛ и саморезов по площади стен с запасом на раскрой."
      reportText={[
        "СтройКалькулятор — Гипсокартон",
        "",
        `Площадь стен: ${fmt(num(s.area))} м²`,
        `Вычесть проёмы: ${fmt(num(s.openings))} м²`,
        `Лист: ${fmt(num(s.sheetWidth), 2)} × ${fmt(num(s.sheetHeight), 2)} м`,
        `Запас: ${fmt(num(s.wastePercent), 0)} %`,
        "",
        `Площадь стен: ${fmt(wallArea)} м²`,
        `С запасом: ${fmt(withWaste)} м²`,
        `Листов купить: ${sheets} шт`,
        `Саморезы: ${fmt(screws, 0)} шт`,
      ].join("\n")}
      inputs={
        <>
          <RoomPicker
            description="Подставит площадь стен и проёмов."
            onApply={(m) =>
              setS((p) => ({
                ...p,
                area: round1(m.wallsGross),
                openings: round1(m.openingsArea),
              }))
            }
          />
          <Section title="Стены">
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
          </Section>
          <Section
            title="Лист"
            description="Стандартный лист чаще 1,2 × 2,5 м. Запас — на подрезку и брак."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <NumberField
                label="Ширина листа"
                value={s.sheetWidth}
                onChange={(sheetWidth) => setS((p) => ({ ...p, sheetWidth }))}
                unit="м"
              />
              <NumberField
                label="Высота листа"
                value={s.sheetHeight}
                onChange={(sheetHeight) => setS((p) => ({ ...p, sheetHeight }))}
                unit="м"
              />
              <NumberField
                label="Запас"
                value={s.wastePercent}
                onChange={(wastePercent) => setS((p) => ({ ...p, wastePercent }))}
                unit="%"
                step={1}
              />
              <NumberField
                label="Саморезы на лист"
                value={s.screwsPerSheet}
                onChange={(screwsPerSheet) => setS((p) => ({ ...p, screwsPerSheet }))}
                unit="шт"
                step={1}
              />
            </div>
          </Section>
        </>
      }
      results={
        <div>
          <ResultRow label="Площадь стен" value={fmt(wallArea)} unit="м²" />
          <ResultRow label="С запасом" value={fmt(withWaste)} unit="м²" />
          <ResultRow label="Листов купить" value={sheets} unit="шт" emphasize />
          <ResultRow label="Саморезы" value={fmt(screws, 0)} unit="шт" />
        </div>
      }
    />
  )
}
