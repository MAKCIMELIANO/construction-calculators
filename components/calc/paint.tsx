"use client"

import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"
import { RoomPicker } from "./room-picker"
import { usePersistedState } from "@/lib/use-persisted-state"
import { useT } from "@/lib/i18n/context"

function round1(n: number) {
  return Math.round(n * 10) / 10
}

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
  const t = useT()
  const [s, setS] = usePersistedState<PaintState>("calc-paint-v1", INITIAL)

  const paintArea = Math.max(0, num(s.area) - num(s.openings))
  const litres = paintArea * num(s.consumption) * num(s.coats)
  const cans = num(s.canVolume) > 0 ? Math.ceil(litres / num(s.canVolume)) : 0

  return (
    <CalcLayout
      title={t("paint.title")}
      description={t("paint.description")}
      reportText={[
        t("paint.reportHeader"),
        "",
        t("paint.report.area", { value: fmt(num(s.area)) }),
        t("paint.report.openings", { value: fmt(num(s.openings)) }),
        t("paint.report.coats", { value: fmt(num(s.coats), 0) }),
        t("paint.report.consumption", { value: fmt(num(s.consumption), 3) }),
        t("paint.report.canVolume", { value: fmt(num(s.canVolume)) }),
        "",
        t("paint.report.paintArea", { value: fmt(paintArea) }),
        t("paint.report.litres", { value: fmt(litres) }),
        t("paint.report.cans", { value: cans }),
      ].join("\n")}
      inputs={
        <>
          <RoomPicker
            description={t("roomPicker.desc.wallsGrossOpenings")}
            onApply={(m) =>
              setS((p) => ({
                ...p,
                area: round1(m.wallsGross),
                openings: round1(m.openingsArea),
              }))
            }
          />
          <Section title={t("paint.sections.surface")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label={t("paint.fields.area")}
                value={s.area}
                onChange={(area) => setS((p) => ({ ...p, area }))}
                unit={t("common.unit.m2")}
              />
              <NumberField
                label={t("paint.fields.openings")}
                value={s.openings}
                onChange={(openings) => setS((p) => ({ ...p, openings }))}
                unit={t("common.unit.m2")}
              />
            </div>
          </Section>
          <Section title={t("paint.sections.params")}>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label={t("paint.fields.coats")}
                value={s.coats}
                onChange={(coats) => setS((p) => ({ ...p, coats }))}
                min={1}
                step={1}
              />
              <NumberField
                label={t("paint.fields.consumption")}
                value={s.consumption}
                onChange={(consumption) => setS((p) => ({ ...p, consumption }))}
                unit={t("common.unit.lPerM2")}
              />
              <NumberField
                label={t("paint.fields.canVolume")}
                value={s.canVolume}
                onChange={(canVolume) => setS((p) => ({ ...p, canVolume }))}
                unit={t("common.unit.l")}
              />
            </div>
          </Section>
        </>
      }
      results={
        <div>
          <ResultRow label={t("paint.results.area")} value={fmt(paintArea)} unit={t("common.unit.m2")} />
          <ResultRow label={t("paint.results.litres")} value={fmt(litres)} unit={t("common.unit.l")} emphasize />
          <ResultRow label={t("paint.results.cans")} value={cans} unit={t("common.unit.pcs")} emphasize />
        </div>
      }
    />
  )
}
