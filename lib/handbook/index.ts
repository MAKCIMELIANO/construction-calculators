import type { MessageKey } from "@/lib/i18n"

export type HandbookCategoryId = "bulk" | "mix" | "concrete" | "finish"

export type BulkMaterialId =
  | "sandDry"
  | "sandWet"
  | "crushed5_20"
  | "crushed20_40"
  | "keramzit"

export type ConcreteGradeId = "m100" | "m150" | "m200" | "m250" | "m300"

export type HandbookEntry = {
  id: string
  category: HandbookCategoryId
  materialKey: MessageKey
  paramKey: MessageKey
  value: number
  valueTo?: number
  unitKey: MessageKey
  noteKey?: MessageKey
}

/** Насипна щільність, т/м³ (орієнтовно). */
export const BULK_MATERIALS: Record<
  BulkMaterialId,
  { nameKey: MessageKey; densityTPerM3: number }
> = {
  sandDry: { nameKey: "handbook.material.sandDry", densityTPerM3: 1.5 },
  sandWet: { nameKey: "handbook.material.sandWet", densityTPerM3: 1.8 },
  crushed5_20: { nameKey: "handbook.material.crushed5_20", densityTPerM3: 1.4 },
  crushed20_40: { nameKey: "handbook.material.crushed20_40", densityTPerM3: 1.45 },
  keramzit: { nameKey: "handbook.material.keramzit", densityTPerM3: 0.45 },
}

export const BULK_MATERIAL_IDS = Object.keys(BULK_MATERIALS) as BulkMaterialId[]

/** Орієнтовна витрата матеріалів на 1 м³ бетону (цемент М400). */
export const CONCRETE_GRADES: Record<
  ConcreteGradeId,
  {
    nameKey: MessageKey
    cementKg: number
    sandM3: number
    crushedM3: number
    waterL: number
  }
> = {
  m100: {
    nameKey: "handbook.grade.m100",
    cementKg: 175,
    sandM3: 0.6,
    crushedM3: 0.8,
    waterL: 140,
  },
  m150: {
    nameKey: "handbook.grade.m150",
    cementKg: 215,
    sandM3: 0.55,
    crushedM3: 0.85,
    waterL: 150,
  },
  m200: {
    nameKey: "handbook.grade.m200",
    cementKg: 265,
    sandM3: 0.5,
    crushedM3: 0.85,
    waterL: 160,
  },
  m250: {
    nameKey: "handbook.grade.m250",
    cementKg: 310,
    sandM3: 0.45,
    crushedM3: 0.85,
    waterL: 165,
  },
  m300: {
    nameKey: "handbook.grade.m300",
    cementKg: 350,
    sandM3: 0.4,
    crushedM3: 0.85,
    waterL: 175,
  },
}

export const CONCRETE_GRADE_IDS = Object.keys(CONCRETE_GRADES) as ConcreteGradeId[]

/** Щільності для переводу м³ → т у розрахунку бетону. */
export const CONCRETE_SAND_DENSITY = BULK_MATERIALS.sandDry.densityTPerM3
export const CONCRETE_CRUSHED_DENSITY = BULK_MATERIALS.crushed5_20.densityTPerM3

export const HANDBOOK_CATEGORIES: HandbookCategoryId[] = [
  "bulk",
  "mix",
  "concrete",
  "finish",
]

export const HANDBOOK_ENTRIES: HandbookEntry[] = [
  {
    id: "sand-dry-density",
    category: "bulk",
    materialKey: "handbook.material.sandDry",
    paramKey: "handbook.param.bulkDensity",
    value: 1.5,
    unitKey: "common.unit.tPerM3",
    noteKey: "handbook.note.approximate",
  },
  {
    id: "sand-wet-density",
    category: "bulk",
    materialKey: "handbook.material.sandWet",
    paramKey: "handbook.param.bulkDensity",
    value: 1.8,
    unitKey: "common.unit.tPerM3",
    noteKey: "handbook.note.wetHeavier",
  },
  {
    id: "crushed-5-20-density",
    category: "bulk",
    materialKey: "handbook.material.crushed5_20",
    paramKey: "handbook.param.bulkDensity",
    value: 1.4,
    unitKey: "common.unit.tPerM3",
    noteKey: "handbook.note.approximate",
  },
  {
    id: "crushed-20-40-density",
    category: "bulk",
    materialKey: "handbook.material.crushed20_40",
    paramKey: "handbook.param.bulkDensity",
    value: 1.45,
    unitKey: "common.unit.tPerM3",
    noteKey: "handbook.note.approximate",
  },
  {
    id: "keramzit-density",
    category: "bulk",
    materialKey: "handbook.material.keramzit",
    paramKey: "handbook.param.bulkDensity",
    value: 0.4,
    valueTo: 0.6,
    unitKey: "common.unit.tPerM3",
    noteKey: "handbook.note.dependsOnFraction",
  },
  {
    id: "compaction",
    category: "bulk",
    materialKey: "handbook.material.bulkCommon",
    paramKey: "handbook.param.compaction",
    value: 1.1,
    valueTo: 1.3,
    unitKey: "common.unit.factor",
    noteKey: "handbook.note.compaction",
  },
  {
    id: "screed-consumption",
    category: "mix",
    materialKey: "handbook.material.screedMix",
    paramKey: "handbook.param.consumption10mm",
    value: 18,
    valueTo: 22,
    unitKey: "common.unit.kgPerM2",
    noteKey: "handbook.note.packLabel",
  },
  {
    id: "plaster-gypsum",
    category: "mix",
    materialKey: "handbook.material.plasterGypsum",
    paramKey: "handbook.param.consumption10mm",
    value: 8,
    valueTo: 10,
    unitKey: "common.unit.kgPerM2",
    noteKey: "handbook.note.packLabel",
  },
  {
    id: "plaster-cement",
    category: "mix",
    materialKey: "handbook.material.plasterCement",
    paramKey: "handbook.param.consumption10mm",
    value: 14,
    valueTo: 18,
    unitKey: "common.unit.kgPerM2",
    noteKey: "handbook.note.packLabel",
  },
  {
    id: "cement-bag",
    category: "mix",
    materialKey: "handbook.material.cement",
    paramKey: "handbook.param.bagWeight",
    value: 25,
    valueTo: 50,
    unitKey: "common.unit.kg",
    noteKey: "handbook.note.bagCommon",
  },
  ...CONCRETE_GRADE_IDS.map(
    (id): HandbookEntry => ({
      id: `concrete-${id}`,
      category: "concrete",
      materialKey: CONCRETE_GRADES[id].nameKey,
      paramKey: "handbook.param.cementPerM3",
      value: CONCRETE_GRADES[id].cementKg,
      unitKey: "common.unit.kgPerM3",
      noteKey: "handbook.note.cementM400",
    }),
  ),
  {
    id: "paint-walls",
    category: "finish",
    materialKey: "handbook.material.paintWalls",
    paramKey: "handbook.param.consumptionCoat",
    value: 0.1,
    valueTo: 0.15,
    unitKey: "common.unit.lPerM2",
    noteKey: "handbook.note.packLabel",
  },
  {
    id: "wallpaper-waste",
    category: "finish",
    materialKey: "handbook.material.wallpaper",
    paramKey: "handbook.param.waste",
    value: 5,
    valueTo: 15,
    unitKey: "common.unit.percent",
    noteKey: "handbook.note.patternMatch",
  },
  {
    id: "gkl-12.5",
    category: "finish",
    materialKey: "handbook.material.gkl125",
    paramKey: "handbook.param.sheetWeight",
    value: 25,
    valueTo: 30,
    unitKey: "common.unit.kg",
    noteKey: "handbook.note.sheetSize",
  },
]

export function isBulkMaterialId(value: string): value is BulkMaterialId {
  return value in BULK_MATERIALS
}

export function isConcreteGradeId(value: string): value is ConcreteGradeId {
  return value in CONCRETE_GRADES
}

const CATEGORY_TITLE_KEYS: Record<HandbookCategoryId, MessageKey> = {
  bulk: "handbook.category.bulk",
  mix: "handbook.category.mix",
  concrete: "handbook.category.concrete",
  finish: "handbook.category.finish",
}

export function categoryTitleKey(category: HandbookCategoryId): MessageKey {
  return CATEGORY_TITLE_KEYS[category]
}
