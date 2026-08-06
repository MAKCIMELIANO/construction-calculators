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
import {
  BULK_MATERIALS,
  BULK_MATERIAL_IDS,
  isBulkMaterialId,
} from "@/lib/handbook"
import { usePersistedState } from "@/lib/use-persisted-state"
import { useT } from "@/lib/i18n/context"

type PileState = {
  material: string
  diameter: number | ""
  height: number | ""
  density: number | ""
  compaction: number | ""
}

const INITIAL: PileState = {
  material: "sandDry",
  diameter: 3,
  height: 1.5,
  density: BULK_MATERIALS.sandDry.densityTPerM3,
  compaction: 1.15,
}

export function PileCalculator() {
  const t = useT()
  const [s, setS] = usePersistedState<PileState>("calc-pile-v1", INITIAL)

  const materialId = isBulkMaterialId(s.material) ? s.material : "sandDry"
  const radius = num(s.diameter) / 2
  const volume = (1 / 3) * Math.PI * radius * radius * num(s.height)
  const density = num(s.density)
  const mass = volume * density
  const massCompacted = mass * num(s.compaction)

  return (
    <CalcLayout
      title={t("pile.title")}
      description={t("pile.description")}
      reportText={[
        t("pile.reportHeader"),
        "",
        t("pile.report.material", { value: t(BULK_MATERIALS[materialId].nameKey) }),
        t("pile.report.diameter", { value: fmt(num(s.diameter)) }),
        t("pile.report.height", { value: fmt(num(s.height)) }),
        t("pile.report.density", { value: fmt(density, 2) }),
        t("pile.report.compaction", { value: fmt(num(s.compaction), 2) }),
        "",
        t("pile.report.volume", { value: fmt(volume, 2) }),
        t("pile.report.mass", { value: fmt(mass, 2) }),
        t("pile.report.massCompacted", { value: fmt(massCompacted, 2) }),
      ].join("\n")}
      inputs={
        <>
          <Section title={t("pile.sections.shape")} description={t("pile.sections.shapeDesc")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label={t("pile.fields.diameter")}
                value={s.diameter}
                onChange={(diameter) => setS((p) => ({ ...p, diameter }))}
                unit={t("common.unit.m")}
              />
              <NumberField
                label={t("pile.fields.height")}
                value={s.height}
                onChange={(height) => setS((p) => ({ ...p, height }))}
                unit={t("common.unit.m")}
              />
            </div>
          </Section>
          <Section title={t("pile.sections.material")} description={t("pile.sections.materialDesc")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label={t("pile.fields.material")}
                value={materialId}
                onChange={(material) => {
                  if (!isBulkMaterialId(material)) return
                  setS((p) => ({
                    ...p,
                    material,
                    density: BULK_MATERIALS[material].densityTPerM3,
                  }))
                }}
                options={BULK_MATERIAL_IDS.map((id) => ({
                  value: id,
                  label: t(BULK_MATERIALS[id].nameKey),
                }))}
              />
              <NumberField
                label={t("pile.fields.density")}
                value={s.density}
                onChange={(density) => setS((p) => ({ ...p, density }))}
                unit={t("common.unit.tPerM3")}
                step={0.05}
              />
              <NumberField
                label={t("pile.fields.compaction")}
                value={s.compaction}
                onChange={(compaction) => setS((p) => ({ ...p, compaction }))}
                unit={t("common.unit.factor")}
                step={0.05}
                min={1}
              />
            </div>
          </Section>
        </>
      }
      results={
        <div>
          <ResultRow
            label={t("pile.results.volume")}
            value={fmt(volume, 2)}
            unit={t("common.unit.m3")}
            emphasize
          />
          <ResultRow
            label={t("pile.results.mass")}
            value={fmt(mass, 2)}
            unit={t("common.unit.t")}
          />
          <ResultRow
            label={t("pile.results.massCompacted")}
            value={fmt(massCompacted, 2)}
            unit={t("common.unit.t")}
          />
        </div>
      }
    />
  )
}
