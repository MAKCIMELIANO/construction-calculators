"use client"

import { CalcLayout, NumberField, ResultRow, Section, fmt, num } from "./fields"
import { RoomPicker } from "./room-picker"
import { usePersistedState } from "@/lib/use-persisted-state"
import { useT } from "@/lib/i18n/context"

function round1(n: number) {
  return Math.round(n * 10) / 10
}

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
  const t = useT()
  const [s, setS] = usePersistedState<ScreedState>("calc-screed-v1", INITIAL)

  const a = num(s.area)
  const tmm = num(s.thickness)
  const volume = a * (tmm / 1000)
  const drySmesKg = a * num(s.consumption) * (tmm / 10)
  const bags = num(s.bagWeight) > 0 ? Math.ceil(drySmesKg / num(s.bagWeight)) : 0

  return (
    <CalcLayout
      title={t("screed.title")}
      description={t("screed.description")}
      reportText={[
        t("screed.reportHeader"),
        "",
        t("screed.report.area", { value: fmt(a) }),
        t("screed.report.thickness", { value: fmt(tmm, 0) }),
        t("screed.report.consumption", { value: fmt(num(s.consumption), 0) }),
        t("screed.report.bagWeight", { value: fmt(num(s.bagWeight), 0) }),
        "",
        t("screed.report.volume", { value: fmt(volume, 3) }),
        t("screed.report.dry", { value: fmt(drySmesKg, 0) }),
        t("screed.report.bags", { value: bags }),
      ].join("\n")}
      inputs={
        <>
          <RoomPicker
            description={t("roomPicker.desc.floor")}
            onApply={(m) => setS((p) => ({ ...p, area: round1(m.floor) }))}
          />
          <Section title={t("screed.sections.floor")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label={t("screed.fields.area")}
                value={s.area}
                onChange={(area) => setS((p) => ({ ...p, area }))}
                unit={t("common.unit.m2")}
              />
              <NumberField
                label={t("screed.fields.thickness")}
                value={s.thickness}
                onChange={(thickness) => setS((p) => ({ ...p, thickness }))}
                unit={t("common.unit.mm")}
                step={1}
              />
            </div>
          </Section>
          <Section title={t("screed.sections.mix")} description={t("screed.sections.mixDesc")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label={t("screed.fields.consumption")}
                value={s.consumption}
                onChange={(consumption) => setS((p) => ({ ...p, consumption }))}
                unit={t("common.unit.kgPerM2")}
              />
              <NumberField
                label={t("screed.fields.bagWeight")}
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
          <ResultRow label={t("screed.results.volume")} value={fmt(volume, 3)} unit={t("common.unit.m3")} />
          <ResultRow label={t("screed.results.dry")} value={fmt(drySmesKg, 0)} unit={t("common.unit.kg")} />
          <ResultRow label={t("screed.results.bags")} value={bags} unit={t("common.unit.pcs")} emphasize />
        </div>
      }
    />
  )
}
