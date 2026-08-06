"use client"

import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"
import { RoomPicker } from "./room-picker"
import { usePersistedState } from "@/lib/use-persisted-state"
import { useT } from "@/lib/i18n/context"

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
  const t = useT()
  const [s, setS] = usePersistedState<DrywallState>("calc-drywall-v1", INITIAL)

  const wallArea = Math.max(0, num(s.area) - num(s.openings))
  const sheetArea = num(s.sheetWidth) * num(s.sheetHeight)
  const withWaste = wallArea * (1 + num(s.wastePercent) / 100)
  const sheets = sheetArea > 0 ? Math.ceil(withWaste / sheetArea) : 0
  const screws = sheets * num(s.screwsPerSheet)

  return (
    <CalcLayout
      title={t("drywall.title")}
      description={t("drywall.description")}
      reportText={[
        t("drywall.reportHeader"),
        "",
        t("drywall.report.area", { value: fmt(num(s.area)) }),
        t("drywall.report.openings", { value: fmt(num(s.openings)) }),
        t("drywall.report.sheet", {
          w: fmt(num(s.sheetWidth), 2),
          h: fmt(num(s.sheetHeight), 2),
        }),
        t("drywall.report.waste", { value: fmt(num(s.wastePercent), 0) }),
        "",
        t("drywall.report.wallArea", { value: fmt(wallArea) }),
        t("drywall.report.withWaste", { value: fmt(withWaste) }),
        t("drywall.report.sheets", { value: sheets }),
        t("drywall.report.screws", { value: fmt(screws, 0) }),
      ].join("\n")}
      inputs={
        <>
          <RoomPicker
            description={t("roomPicker.desc.wallsOpenings")}
            onApply={(m) =>
              setS((p) => ({
                ...p,
                area: round1(m.wallsGross),
                openings: round1(m.openingsArea),
              }))
            }
          />
          <Section title={t("drywall.sections.walls")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label={t("drywall.fields.area")}
                value={s.area}
                onChange={(area) => setS((p) => ({ ...p, area }))}
                unit={t("common.unit.m2")}
              />
              <NumberField
                label={t("drywall.fields.openings")}
                value={s.openings}
                onChange={(openings) => setS((p) => ({ ...p, openings }))}
                unit={t("common.unit.m2")}
              />
            </div>
          </Section>
          <Section title={t("drywall.sections.sheet")} description={t("drywall.sections.sheetDesc")}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <NumberField
                label={t("drywall.fields.sheetWidth")}
                value={s.sheetWidth}
                onChange={(sheetWidth) => setS((p) => ({ ...p, sheetWidth }))}
                unit={t("common.unit.m")}
              />
              <NumberField
                label={t("drywall.fields.sheetHeight")}
                value={s.sheetHeight}
                onChange={(sheetHeight) => setS((p) => ({ ...p, sheetHeight }))}
                unit={t("common.unit.m")}
              />
              <NumberField
                label={t("drywall.fields.waste")}
                value={s.wastePercent}
                onChange={(wastePercent) => setS((p) => ({ ...p, wastePercent }))}
                unit={t("common.unit.percent")}
                step={1}
              />
              <NumberField
                label={t("drywall.fields.screws")}
                value={s.screwsPerSheet}
                onChange={(screwsPerSheet) => setS((p) => ({ ...p, screwsPerSheet }))}
                unit={t("common.unit.pcs")}
                step={1}
              />
            </div>
          </Section>
        </>
      }
      results={
        <div>
          <ResultRow label={t("drywall.results.wallArea")} value={fmt(wallArea)} unit={t("common.unit.m2")} />
          <ResultRow label={t("drywall.results.withWaste")} value={fmt(withWaste)} unit={t("common.unit.m2")} />
          <ResultRow label={t("drywall.results.sheets")} value={sheets} unit={t("common.unit.pcs")} emphasize />
          <ResultRow label={t("drywall.results.screws")} value={fmt(screws, 0)} unit={t("common.unit.pcs")} />
        </div>
      }
    />
  )
}
