"use client"

import { useState } from "react"
import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"

export function TileCalculator() {
  const [area, setArea] = useState<number | "">(20)
  const [tileWidth, setTileWidth] = useState<number | "">(60)
  const [tileHeight, setTileHeight] = useState<number | "">(60)
  const [perPack, setPerPack] = useState<number | "">(4)
  const [reserve, setReserve] = useState<number | "">(10)

  const a = num(area)
  const tileArea = (num(tileWidth) / 100) * (num(tileHeight) / 100) // cm -> m²
  const withReserve = a * (1 + num(reserve) / 100)
  const tilesNeeded = tileArea > 0 ? Math.ceil(withReserve / tileArea) : 0
  const packs = num(perPack) > 0 ? Math.ceil(tilesNeeded / num(perPack)) : 0
  const coveredArea = tilesNeeded * tileArea

  return (
    <CalcLayout
      title="Плитка / ламинат"
      description="Количество плиток и упаковок на пол или стену с запасом на подрезку."
      reportText={[
        "СтройКалькулятор — Плитка / ламинат",
        "",
        `Площадь: ${fmt(a)} м²`,
        `Запас на подрезку: ${fmt(num(reserve), 0)}%`,
        `Размер плитки / доски: ${fmt(num(tileWidth), 0)} x ${fmt(num(tileHeight), 0)} см`,
        `Штук в упаковке: ${fmt(num(perPack), 0)}`,
        "",
        `Площадь 1 шт: ${fmt(tileArea, 3)} м²`,
        `С запасом: ${fmt(withReserve)} м²`,
        `Штук нужно: ${tilesNeeded} шт`,
        `Упаковок купить: ${packs} уп`,
        `Покрытая площадь: ${fmt(coveredArea)} м²`,
      ].join("\n")}
      inputs={
        <>
          <Section title="Площадь укладки">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Площадь" value={area} onChange={setArea} unit="м²" />
              <NumberField label="Запас на подрезку" value={reserve} onChange={setReserve} unit="%" />
            </div>
          </Section>
          <Section title="Размер плитки / доски">
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField label="Ширина" value={tileWidth} onChange={setTileWidth} unit="см" />
              <NumberField label="Длина" value={tileHeight} onChange={setTileHeight} unit="см" />
              <NumberField label="Штук в упаковке" value={perPack} onChange={setPerPack} min={1} step={1} />
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
