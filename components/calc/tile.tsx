"use client"

import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"
import { RoomPicker } from "./room-picker"
import { usePersistedState } from "@/lib/use-persisted-state"
import { useT } from "@/lib/i18n/context"

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
  const t = useT()
  const [s, setS] = usePersistedState<TileState>("calc-tile-v1", INITIAL)

  const a = num(s.area)
  const tileArea = (num(s.tileWidth) / 100) * (num(s.tileHeight) / 100)
  const withReserve = a * (1 + num(s.reserve) / 100)
  const tilesNeeded = tileArea > 0 ? Math.ceil(withReserve / tileArea) : 0
  const packs = num(s.perPack) > 0 ? Math.ceil(tilesNeeded / num(s.perPack)) : 0
  const coveredArea = tilesNeeded * tileArea

  return (
    <CalcLayout
      title={t("tile.title")}
      description={t("tile.description")}
      reportText={[
        t("tile.reportHeader"),
        "",
        t("tile.report.area", { value: fmt(a) }),
        t("tile.report.reserve", { value: fmt(num(s.reserve), 0) }),
        t("tile.report.size", {
          w: fmt(num(s.tileWidth), 0),
          h: fmt(num(s.tileHeight), 0),
        }),
        t("tile.report.perPack", { value: fmt(num(s.perPack), 0) }),
        "",
        t("tile.report.tileArea", { value: fmt(tileArea, 3) }),
        t("tile.report.withReserve", { value: fmt(withReserve) }),
        t("tile.report.tiles", { value: tilesNeeded }),
        t("tile.report.packs", { value: packs }),
        t("tile.report.covered", { value: fmt(coveredArea) }),
      ].join("\n")}
      inputs={
        <>
          <RoomPicker
            description={t("roomPicker.desc.floor")}
            onApply={(m) => setS((p) => ({ ...p, area: round1(m.floor) }))}
          />
          <Section title={t("tile.sections.area")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label={t("tile.fields.area")}
                value={s.area}
                onChange={(area) => setS((p) => ({ ...p, area }))}
                unit={t("common.unit.m2")}
              />
              <NumberField
                label={t("tile.fields.reserve")}
                value={s.reserve}
                onChange={(reserve) => setS((p) => ({ ...p, reserve }))}
                unit={t("common.unit.percent")}
              />
            </div>
          </Section>
          <Section title={t("tile.sections.size")}>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label={t("tile.fields.width")}
                value={s.tileWidth}
                onChange={(tileWidth) => setS((p) => ({ ...p, tileWidth }))}
                unit={t("common.unit.cm")}
              />
              <NumberField
                label={t("tile.fields.length")}
                value={s.tileHeight}
                onChange={(tileHeight) => setS((p) => ({ ...p, tileHeight }))}
                unit={t("common.unit.cm")}
              />
              <NumberField
                label={t("tile.fields.perPack")}
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
          <ResultRow label={t("tile.results.tileArea")} value={fmt(tileArea, 3)} unit={t("common.unit.m2")} />
          <ResultRow label={t("tile.results.withReserve")} value={fmt(withReserve)} unit={t("common.unit.m2")} />
          <ResultRow label={t("tile.results.tiles")} value={tilesNeeded} unit={t("common.unit.pcs")} emphasize />
          <ResultRow label={t("tile.results.packs")} value={packs} unit={t("common.unit.pack")} emphasize />
          <ResultRow label={t("tile.results.covered")} value={fmt(coveredArea)} unit={t("common.unit.m2")} />
        </div>
      }
    />
  )
}
