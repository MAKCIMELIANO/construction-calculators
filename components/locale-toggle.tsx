"use client"

import { Languages } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocale } from "@/lib/i18n/context"
import type { Locale } from "@/lib/i18n"

const OPTIONS: { id: Locale; labelKey: "locale.uk" | "locale.ru" }[] = [
  { id: "uk", labelKey: "locale.uk" },
  { id: "ru", labelKey: "locale.ru" },
]

export function LocaleToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale()

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="text-sidebar-foreground flex items-center gap-3 px-3 py-1">
        <Languages className="size-5 shrink-0" />
        <span className="text-sm font-medium">{t("locale.label")}</span>
      </div>
      <div className="grid grid-cols-2 gap-1 px-1">
        {OPTIONS.map((opt) => {
          const active = locale === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setLocale(opt.id)}
              className={cn(
                "rounded-lg px-2 py-2 text-center text-xs font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              {t(opt.labelKey)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
