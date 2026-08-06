"use client"

import { Code2, Mail } from "lucide-react"
import { SITE } from "@/lib/site"
import { useT } from "@/lib/i18n/context"

export function SiteFooter() {
  const t = useT()

  return (
    <footer className="no-print border-border mt-auto border-t px-4 py-4 sm:px-6 lg:px-8">
      <div className="text-muted-foreground mx-auto flex max-w-5xl flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-foreground font-medium">
            {t("footer.madeBy", { name: SITE.authorName })}
          </p>
          <p className="mt-0.5 text-xs">{t("footer.note")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <a
            href={`mailto:${SITE.email}`}
            className="hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            <Mail className="size-3.5 shrink-0" aria-hidden />
            <span>{SITE.email}</span>
          </a>
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            <Code2 className="size-3.5 shrink-0" aria-hidden />
            <span>{SITE.githubLabel}</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
