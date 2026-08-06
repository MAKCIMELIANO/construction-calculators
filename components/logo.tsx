"use client"

import { Calculator } from "lucide-react"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/context"

export function LogoMark({ className }: { className?: string }) {
  return <Calculator className={cn("size-5", className)} aria-hidden />
}

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  const t = useT()

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
        <LogoMark className="size-5" />
      </div>
      {showText ? (
        <div className="min-w-0">
          <p className="text-sidebar-foreground text-sm leading-tight font-bold">{t("brand.name")}</p>
          <p className="text-muted-foreground text-xs">{t("brand.tagline")}</p>
        </div>
      ) : null}
    </div>
  )
}
