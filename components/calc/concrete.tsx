"use client"

import {
  CalcLayout,
  NumberField,
  ResultRow,
  Section,
  SelectField,
  fmt,
  num,
} from "./fields"
import { RoomPicker } from "./room-picker"
import {
  CONCRETE_CRUSHED_DENSITY,
  CONCRETE_GRADES,
  CONCRETE_GRADE_IDS,
  CONCRETE_SAND_DENSITY,
  isConcreteGradeId,
} from "@/lib/handbook"
import { usePersistedState } from "@/lib/use-persisted-state"
import { useT } from "@/lib/i18n/context"

function round3(n: number) {
  return Math.round(n * 1000) / 1000
}

function round1(n: number) {
  return Math.round(n * 10) / 10
}

type ConcreteState = {
  volume: number | ""
  area: number | ""
  thickness: number | ""
  grade: string
  bagWeight: number | ""
  wastePercent: number | ""
}

const INITIAL: ConcreteState = {
  volume: 3,
  area: 20,
  thickness: 150,
  grade: "m200",
  bagWeight: 50,
  wastePercent: 10,
}

export function ConcreteCalculator() {
  const t = useT()
  const [s, setS] = usePersistedState<ConcreteState>("calc-concrete-v1", INITIAL)

  const gradeId = isConcreteGradeId(s.grade) ? s.grade : "m200"
  const grade = CONCRETE_GRADES[gradeId]
  const baseVolume = num(s.volume)
  const volume = baseVolume * (1 + num(s.wastePercent) / 100)

  const cementKg = volume * grade.cementKg
  const sandM3 = volume * grade.sandM3
  const crushedM3 = volume * grade.crushedM3
  const waterL = volume * grade.waterL
  const sandT = sandM3 * CONCRETE_SAND_DENSITY
  const crushedT = crushedM3 * CONCRETE_CRUSHED_DENSITY
  const bags =
    num(s.bagWeight) > 0 ? Math.ceil(cementKg / num(s.bagWeight)) : 0

  const slabVolume =
    num(s.area) > 0 && num(s.thickness) > 0
      ? num(s.area) * (num(s.thickness) / 1000)
      : 0

  return (
    <CalcLayout
      title={t("concrete.title")}
      description={t("concrete.description")}
      reportText={[
        t("concrete.reportHeader"),
        "",
        t("concrete.report.volume", { value: fmt(baseVolume, 3) }),
        t("concrete.report.waste", { value: fmt(num(s.wastePercent), 0) }),
        t("concrete.report.grade", { value: t(grade.nameKey) }),
        t("concrete.report.bagWeight", { value: fmt(num(s.bagWeight), 0) }),
        "",
        t("concrete.report.volumeWithWaste", { value: fmt(volume, 3) }),
        t("concrete.report.cement", { value: fmt(cementKg, 0) }),
        t("concrete.report.bags", { value: bags }),
        t("concrete.report.sand", {
          m3: fmt(sandM3, 2),
          t: fmt(sandT, 2),
        }),
        t("concrete.report.crushed", {
          m3: fmt(crushedM3, 2),
          t: fmt(crushedT, 2),
        }),
        t("concrete.report.water", { value: fmt(waterL, 0) }),
      ].join("\n")}
      inputs={
        <>
          <RoomPicker
            description={t("roomPicker.desc.floor")}
            onApply={(m) => setS((p) => ({ ...p, area: round1(m.floor) }))}
          />
          <Section
            title={t("concrete.sections.slab")}
            description={t("concrete.sections.slabDesc")}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label={t("concrete.fields.area")}
                value={s.area}
                onChange={(area) => setS((p) => ({ ...p, area }))}
                unit={t("common.unit.m2")}
              />
              <NumberField
                label={t("concrete.fields.thickness")}
                value={s.thickness}
                onChange={(thickness) => setS((p) => ({ ...p, thickness }))}
                unit={t("common.unit.mm")}
                step={1}
              />
            </div>
            <button
              type="button"
              disabled={slabVolume <= 0}
              onClick={() => setS((p) => ({ ...p, volume: round3(slabVolume) }))}
              className="border-border text-foreground hover:bg-accent mt-4 inline-flex h-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
            >
              {t("concrete.actions.applySlab", { value: fmt(slabVolume, 3) })}
            </button>
          </Section>
          <Section title={t("concrete.sections.mix")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label={t("concrete.fields.volume")}
                value={s.volume}
                onChange={(volume) => setS((p) => ({ ...p, volume }))}
                unit={t("common.unit.m3")}
                step={0.1}
              />
              <SelectField
                label={t("concrete.fields.grade")}
                value={gradeId}
                onChange={(grade) => setS((p) => ({ ...p, grade }))}
                options={CONCRETE_GRADE_IDS.map((id) => ({
                  value: id,
                  label: t(CONCRETE_GRADES[id].nameKey),
                }))}
              />
              <NumberField
                label={t("concrete.fields.waste")}
                value={s.wastePercent}
                onChange={(wastePercent) => setS((p) => ({ ...p, wastePercent }))}
                unit={t("common.unit.percent")}
                step={1}
              />
              <NumberField
                label={t("concrete.fields.bagWeight")}
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
          <ResultRow
            label={t("concrete.results.volumeWithWaste")}
            value={fmt(volume, 3)}
            unit={t("common.unit.m3")}
            emphasize
          />
          <ResultRow
            label={t("concrete.results.cement")}
            value={fmt(cementKg, 0)}
            unit={t("common.unit.kg")}
          />
          <ResultRow
            label={t("concrete.results.bags")}
            value={bags}
            unit={t("common.unit.pcs")}
          />
          <ResultRow
            label={t("concrete.results.sandM3")}
            value={fmt(sandM3, 2)}
            unit={t("common.unit.m3")}
          />
          <ResultRow
            label={t("concrete.results.sandT")}
            value={fmt(sandT, 2)}
            unit={t("common.unit.t")}
          />
          <ResultRow
            label={t("concrete.results.crushedM3")}
            value={fmt(crushedM3, 2)}
            unit={t("common.unit.m3")}
          />
          <ResultRow
            label={t("concrete.results.crushedT")}
            value={fmt(crushedT, 2)}
            unit={t("common.unit.t")}
          />
          <ResultRow
            label={t("concrete.results.water")}
            value={fmt(waterL, 0)}
            unit={t("common.unit.l")}
          />
        </div>
      }
    />
  )
}
