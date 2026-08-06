"use client"

import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"
import { RoomPicker } from "./room-picker"
import { usePersistedState } from "@/lib/use-persisted-state"
import { useT } from "@/lib/i18n/context"

function round1(n: number) {
  return Math.round(n * 10) / 10
}

type WallpaperState = {
  perimeter: number | ""
  height: number | ""
  openings: number | ""
  rollWidth: number | ""
  rollLength: number | ""
  rapport: number | ""
}

const INITIAL: WallpaperState = {
  perimeter: 14,
  height: 2.7,
  openings: 3.5,
  rollWidth: 1.06,
  rollLength: 10,
  rapport: 0,
}

export function WallpaperCalculator() {
  const t = useT()
  const [s, setS] = usePersistedState<WallpaperState>("calc-wallpaper-v1", INITIAL)

  const p = num(s.perimeter)
  const h = num(s.height)
  const wallArea = Math.max(0, p * h - num(s.openings))

  const rw = num(s.rollWidth)
  const rl = num(s.rollLength)
  const rap = num(s.rapport)

  const stripHeight = h + rap
  const stripsPerRoll = stripHeight > 0 ? Math.floor(rl / stripHeight) : 0
  const stripsNeeded = rw > 0 ? Math.ceil(p / rw) : 0
  const rollsByStrips = stripsPerRoll > 0 ? Math.ceil(stripsNeeded / stripsPerRoll) : 0

  const rollArea = rw * rl
  const rollsByArea = rollArea > 0 ? Math.ceil((wallArea * 1.1) / rollArea) : 0

  const rolls = Math.max(rollsByStrips, rollsByArea)

  return (
    <CalcLayout
      title={t("wallpaper.title")}
      description={t("wallpaper.description")}
      reportText={[
        t("wallpaper.reportHeader"),
        "",
        t("wallpaper.report.perimeter", { value: fmt(p) }),
        t("wallpaper.report.height", { value: fmt(h) }),
        t("wallpaper.report.openings", { value: fmt(num(s.openings)) }),
        t("wallpaper.report.rollSize", { w: fmt(rw), l: fmt(rl) }),
        t("wallpaper.report.rapport", { value: fmt(rap) }),
        "",
        t("wallpaper.report.wallArea", { value: fmt(wallArea) }),
        t("wallpaper.report.stripsPerRoll", { value: stripsPerRoll }),
        t("wallpaper.report.stripsNeeded", { value: stripsNeeded }),
        t("wallpaper.report.rollsByStrips", { value: rollsByStrips }),
        t("wallpaper.report.rollsByArea", { value: rollsByArea }),
        t("wallpaper.report.buy", { value: rolls }),
      ].join("\n")}
      inputs={
        <>
          <RoomPicker
            description={t("roomPicker.desc.wallpaper")}
            onApply={(m) =>
              setS((prev) => ({
                ...prev,
                perimeter: round1(m.perimeter),
                height: round1(m.height),
                openings: round1(m.openingsArea),
              }))
            }
          />
          <Section title={t("wallpaper.sections.walls")}>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label={t("wallpaper.fields.perimeter")}
                value={s.perimeter}
                onChange={(perimeter) => setS((prev) => ({ ...prev, perimeter }))}
                unit={t("common.unit.m")}
              />
              <NumberField
                label={t("wallpaper.fields.height")}
                value={s.height}
                onChange={(height) => setS((prev) => ({ ...prev, height }))}
                unit={t("common.unit.m")}
              />
              <NumberField
                label={t("wallpaper.fields.openings")}
                value={s.openings}
                onChange={(openings) => setS((prev) => ({ ...prev, openings }))}
                unit={t("common.unit.m2")}
              />
            </div>
          </Section>
          <Section title={t("wallpaper.sections.roll")}>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label={t("wallpaper.fields.rollWidth")}
                value={s.rollWidth}
                onChange={(rollWidth) => setS((prev) => ({ ...prev, rollWidth }))}
                unit={t("common.unit.m")}
              />
              <NumberField
                label={t("wallpaper.fields.rollLength")}
                value={s.rollLength}
                onChange={(rollLength) => setS((prev) => ({ ...prev, rollLength }))}
                unit={t("common.unit.m")}
              />
              <NumberField
                label={t("wallpaper.fields.rapport")}
                value={s.rapport}
                onChange={(rapport) => setS((prev) => ({ ...prev, rapport }))}
                unit={t("common.unit.m")}
              />
            </div>
          </Section>
        </>
      }
      results={
        <div>
          <ResultRow label={t("wallpaper.results.wallArea")} value={fmt(wallArea)} unit={t("common.unit.m2")} />
          <ResultRow label={t("wallpaper.results.stripsPerRoll")} value={stripsPerRoll} unit={t("common.unit.pcs")} />
          <ResultRow label={t("wallpaper.results.stripsNeeded")} value={stripsNeeded} unit={t("common.unit.pcs")} />
          <ResultRow label={t("wallpaper.results.rollsByStrips")} value={rollsByStrips} unit={t("common.unit.pcs")} />
          <ResultRow label={t("wallpaper.results.rollsByArea")} value={rollsByArea} unit={t("common.unit.pcs")} />
          <ResultRow label={t("wallpaper.results.buy")} value={rolls} unit={t("common.unit.pcs")} emphasize />
        </div>
      }
    />
  )
}
