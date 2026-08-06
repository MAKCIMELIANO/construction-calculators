"use client"

import { useMemo, useState } from "react"
import { Section, fmt } from "./fields"
import {
  HANDBOOK_CATEGORIES,
  HANDBOOK_ENTRIES,
  categoryTitleKey,
  type HandbookCategoryId,
  type HandbookEntry,
} from "@/lib/handbook"
import { useT } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

function formatEntryValue(entry: HandbookEntry): string {
  if (entry.valueTo != null) {
    return `${fmt(entry.value, 2)}–${fmt(entry.valueTo, 2)}`
  }
  return fmt(entry.value, entry.value >= 10 ? 0 : 2)
}

export function Handbook() {
  const t = useT()
  const [category, setCategory] = useState<HandbookCategoryId | "all">("all")

  const grouped = useMemo(() => {
    const entries =
      category === "all"
        ? HANDBOOK_ENTRIES
        : HANDBOOK_ENTRIES.filter((e) => e.category === category)

    const map = new Map<HandbookCategoryId, HandbookEntry[]>()
    for (const entry of entries) {
      const list = map.get(entry.category) ?? []
      list.push(entry)
      map.set(entry.category, list)
    }
    return HANDBOOK_CATEGORIES.filter((id) => map.has(id)).map((id) => ({
      id,
      entries: map.get(id)!,
    }))
  }, [category])

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h2 className="text-foreground text-2xl font-bold text-balance">{t("handbook.title")}</h2>
        <p className="text-muted-foreground mt-1 text-sm text-pretty">{t("handbook.description")}</p>
      </header>

      <div className="mb-5 flex flex-wrap gap-2">
        <CategoryChip
          active={category === "all"}
          onClick={() => setCategory("all")}
          label={t("handbook.category.all")}
        />
        {HANDBOOK_CATEGORIES.map((id) => (
          <CategoryChip
            key={id}
            active={category === id}
            onClick={() => setCategory(id)}
            label={t(categoryTitleKey(id))}
          />
        ))}
      </div>

      <div className="flex flex-col gap-5">
        {grouped.map((group) => (
          <Section key={group.id} title={t(categoryTitleKey(group.id))}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead>
                  <tr className="border-border text-muted-foreground border-b">
                    <th className="py-2 pr-3 font-medium">{t("handbook.columns.material")}</th>
                    <th className="py-2 pr-3 font-medium">{t("handbook.columns.param")}</th>
                    <th className="py-2 pr-3 font-medium">{t("handbook.columns.value")}</th>
                    <th className="py-2 pr-3 font-medium">{t("handbook.columns.unit")}</th>
                    <th className="py-2 font-medium">{t("handbook.columns.note")}</th>
                  </tr>
                </thead>
                <tbody>
                  {group.entries.map((entry) => (
                    <tr key={entry.id} className="border-border border-b last:border-0">
                      <td className="text-foreground py-2.5 pr-3 font-medium">
                        {t(entry.materialKey)}
                      </td>
                      <td className="text-muted-foreground py-2.5 pr-3">{t(entry.paramKey)}</td>
                      <td className="text-foreground py-2.5 pr-3 tabular-nums">
                        {formatEntryValue(entry)}
                      </td>
                      <td className="text-muted-foreground py-2.5 pr-3">{t(entry.unitKey)}</td>
                      <td className="text-muted-foreground py-2.5">
                        {entry.noteKey ? t(entry.noteKey) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        ))}
      </div>
    </div>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-accent",
      )}
    >
      {label}
    </button>
  )
}
