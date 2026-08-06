"use client"

import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"
import { RoomPicker } from "./room-picker"
import { usePersistedState } from "@/lib/use-persisted-state"
import { useT } from "@/lib/i18n/context"

function round1(n: number) {
  return Math.round(n * 10) / 10
}

type PlasterState = {
  area: number | ""
  openings: number | ""
  thickness: number | ""
  consumption: number | ""
  bagWeight: number | ""
}

const INITIAL: PlasterState = {
  area: 30,
  openings: 4,
  thickness: 15,
  consumption: 8.5,
  bagWeight: 30,
}

export function PlasterCalculator() {
  const t = useT()
  const [s, setS] = usePersistedState<PlasterState>("calc-plaster-v1", INITIAL)

  const wallArea = Math.max(0, num(s.area) - num(s.openings))
  const thickness = num(s.thickness)
  const dryKg = wallArea * num(s.consumption) * (thickness / 10)
  const bags = num(s.bagWeight) > 0 ? Math.ceil(dryKg / num(s.bagWeight)) : 0

  return (
    <CalcLayout
      title={t("plaster.title")}
      description={t("plaster.description")}
      reportText={[
        t("plaster.reportHeader"),
        "",
        t("plaster.report.area", { value: fmt(num(s.area)) }),
        t("plaster.report.openings", { value: fmt(num(s.openings)) }),
        t("plaster.report.thickness", { value: fmt(thickness, 0) }),
        t("plaster.report.consumption", { value: fmt(num(s.consumption), 1) }),
        t("plaster.report.bagWeight", { value: fmt(num(s.bagWeight), 0) }),
        "",
        t("plaster.report.wallArea", { value: fmt(wallArea) }),
        t("plaster.report.dry", { value: fmt(dryKg, 0) }),
        t("plaster.report.bags", { value: bags }),
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
          <Section title={t("plaster.sections.walls")}>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label={t("plaster.fields.area")}
                value={s.area}
                onChange={(area) => setS((p) => ({ ...p, area }))}
                unit={t("common.unit.m2")}
              />
              <NumberField
                label={t("plaster.fields.openings")}
                value={s.openings}
                onChange={(openings) => setS((p) => ({ ...p, openings }))}
                unit={t("common.unit.m2")}
              />
              <NumberField
                label={t("plaster.fields.thickness")}
                value={s.thickness}
                onChange={(next) => setS((p) => ({ ...p, thickness: next }))}
                unit={t("common.unit.mm")}
                step={1}
              />
            </div>
          </Section>
          <Section title={t("plaster.sections.mix")} description={t("plaster.sections.mixDesc")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label={t("plaster.fields.consumption")}
                value={s.consumption}
                onChange={(consumption) => setS((p) => ({ ...p, consumption }))}
                unit={t("common.unit.kgPerM2")}
              />
              <NumberField
                label={t("plaster.fields.bagWeight")}
                value={s.bagWeight}
                onChange={(bagWeight) => setS((p) => ({ ...p, bagWeight }))}
                unit={t("common.unit.kg")}
                step={1}
              />
            </div>
          </Section>
        </>
      }
      results={
        <div>
          <ResultRow label={t("plaster.results.wallArea")} value={fmt(wallArea)} unit={t("common.unit.m2")} />
          <ResultRow label={t("plaster.results.dry")} value={fmt(dryKg, 0)} unit={t("common.unit.kg")} />
          <ResultRow label={t("plaster.results.bags")} value={bags} unit={t("common.unit.pcs")} emphasize />
        </div>
      }
    />
  )
}
