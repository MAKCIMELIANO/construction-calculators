"use client"

import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"
import { RoomPicker } from "./room-picker"
import { usePersistedState } from "@/lib/use-persisted-state"

function round1(n: number) {
  return Math.round(n * 10) / 10
}

type TileState = {
  area: number | ""
  tileWidth: number | ""
  tileHeight: number | ""
  perPack: number | ""
  reserve: number | ""
}

const INITIAL: TileState = {
  area: 20,
  tileWidth: 60,
  tileHeight: 60,
  perPack: 4,
  reserve: 10,
}

export function TileCalculator() {
  const [s, setS] = usePersistedState<TileState>("calc-tile-v1", INITIAL)

  const a = num(s.area)
  const tileArea = (num(s.tileWidth) / 100) * (num(s.tileHeight) / 100)
  const withReserve = a * (1 + num(s.reserve) / 100)
  const tilesNeeded = tileArea > 0 ? Math.ceil(withReserve / tileArea) : 0
  const packs = num(s.perPack) > 0 ? Math.ceil(tilesNeeded / num(s.perPack)) : 0
  const coveredArea = tilesNeeded * tileArea

  return (
    <CalcLayout
      title="Плитка / ламинат"
      description="Количество плиток и упаковок на пол или стену с запасом на подрезку."
      reportText={[
        "СтройКалькулятор — Плитка / ламинат",
        "",
        `Площадь: ${fmt(a)} м²`,
        `Запас на подрезку: ${fmt(num(s.reserve), 0)}%`,
        `Размер плитки / доски: ${fmt(num(s.tileWidth), 0)} x ${fmt(num(s.tileHeight), 0)} см`,
        `Штук в упаковке: ${fmt(num(s.perPack), 0)}`,
        "",
        `Площадь 1 шт: ${fmt(tileArea, 3)} м²`,
        `С запасом: ${fmt(withReserve)} м²`,
        `Штук нужно: ${tilesNeeded} шт`,
        `Упаковок купить: ${packs} уп`,
        `Покрытая площадь: ${fmt(coveredArea)} м²`,
      ].join("\n")}
      inputs={
        <>
          <RoomPicker
            description="Подставит площадь пола комнаты."
            onApply={(m) => setS((p) => ({ ...p, area: round1(m.floor) }))}
          />
          <Section title="Площадь укладки">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Площадь"
                value={s.area}
                onChange={(area) => setS((p) => ({ ...p, area }))}
                unit="м²"
              />
              <NumberField
                label="Запас на подрезку"
                value={s.reserve}
                onChange={(reserve) => setS((p) => ({ ...p, reserve }))}
                unit="%"
              />
            </div>
          </Section>
          <Section title="Размер плитки / доски">
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label="Ширина"
                value={s.tileWidth}
                onChange={(tileWidth) => setS((p) => ({ ...p, tileWidth }))}
                unit="см"
              />
              <NumberField
                label="Длина"
                value={s.tileHeight}
                onChange={(tileHeight) => setS((p) => ({ ...p, tileHeight }))}
                unit="см"
              />
              <NumberField
                label="Штук в упаковке"
                value={s.perPack}
                onChange={(perPack) => setS((p) => ({ ...p, perPack }))}
                min={1}
                step={1}
              />
            </div>
          </Section>
        </>
      }
      results={
        <div>
          <ResultRow label="Площадь 1 шт" value={fmt(tileArea, 3)} unit="м²" />
          <ResultRow label="С запасом" value={fmt(withReserve)} unit="м²" />
          <ResultRow label="Штук нужно" value={tilesNeeded} unit="шт" emphasize />
          <ResultRow label="Упаковок купить" value={packs} unit="уп" emphasize />
          <ResultRow label="Покрытая площадь" value={fmt(coveredArea)} unit="м²" />
        </div>
      }
    />
  )
}
