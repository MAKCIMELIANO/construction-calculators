"use client"

import { useState } from "react"
import type React from "react"
import { Check, Copy, Printer, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function NumberField({
  label,
  value,
  onChange,
  unit,
  min = 0,
  step = "any",
  placeholder,
  className,
}: {
  label: string
  value: number | ""
  onChange: (value: number | "") => void
  unit?: string
  min?: number
  step?: number | "any"
  placeholder?: string
  className?: string
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            const v = e.target.value
            onChange(v === "" ? "" : Number(v))
          }}
          className="h-11 w-full rounded-lg border border-input bg-card px-3 pr-12 text-base text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {unit ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </div>
    </label>
  )
}

export function Section({
  title,
  description,
  children,
  className,
}: {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card p-5", className)}>
      {title ? <h3 className="mb-1 text-base font-semibold text-foreground">{title}</h3> : null}
      {description ? <p className="mb-4 text-sm text-muted-foreground text-pretty">{description}</p> : null}
      {children}
    </section>
  )
}

export function ResultRow({
  label,
  value,
  unit,
  emphasize,
}: {
  label: string
  value: string | number
  unit?: string
  emphasize?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 py-2",
        emphasize ? "border-t border-border pt-3" : "",
      )}
    >
      <span className={cn("text-sm", emphasize ? "font-semibold text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
      <span className={cn(emphasize ? "text-xl font-bold text-primary" : "text-base font-medium text-foreground")}>
        {value}
        {unit ? <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span> : null}
      </span>
    </div>
  )
}

function ReportActions({ title, text }: { title: string; text: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared">("idle")

  function flash(next: "copied" | "shared") {
    setStatus(next)
    window.setTimeout(() => setStatus("idle"), 1800)
  }

  async function copyReport() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const area = document.createElement("textarea")
        area.value = text
        area.setAttribute("readonly", "")
        area.style.position = "fixed"
        area.style.left = "-9999px"
        document.body.appendChild(area)
        area.select()
        document.execCommand("copy")
        document.body.removeChild(area)
      }
      flash("copied")
    } catch {
      flash("copied")
    }
  }

  async function shareReport() {
    const payload = {
      title,
      text,
      url: window.location.href,
    }

    try {
      if (typeof navigator.share === "function") {
        const canShare =
          typeof navigator.canShare !== "function" || navigator.canShare(payload)
        if (canShare) {
          await navigator.share(payload)
          flash("shared")
          return
        }
      }
    } catch (err) {
      // Пользователь закрыл меню шаринга — ничего не делаем
      if (err instanceof DOMException && err.name === "AbortError") return
      // На десктопе share часто «есть», но падает — уходим в копирование
    }

    await copyReport()
  }

  return (
    <div className="no-print mt-5 grid gap-2 border-t border-border pt-4 sm:grid-cols-3 lg:grid-cols-1">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        <Printer className="size-4" />
        PDF
      </button>
      <button
        type="button"
        onClick={copyReport}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        {status === "copied" ? <Check className="size-4" /> : <Copy className="size-4" />}
        {status === "copied" ? "Скопировано" : "Копировать"}
      </button>
      <button
        type="button"
        onClick={shareReport}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        {status === "shared" || status === "copied" ? (
          <Check className="size-4" />
        ) : (
          <Share2 className="size-4" />
        )}
        {status === "shared"
          ? "Отправлено"
          : status === "copied"
            ? "Скопировано"
            : "Поделиться"}
      </button>
    </div>
  )
}

export function CalcLayout({
  title,
  description,
  inputs,
  results,
  reportText,
}: {
  title: string
  description: string
  inputs: React.ReactNode
  results: React.ReactNode
  reportText?: string
}) {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-foreground text-balance">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">{description}</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-5">{inputs}</div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Результат</h3>
            {results}
            {reportText ? <ReportActions title={title} text={reportText} /> : null}
          </div>
        </aside>
      </div>
    </div>
  )
}

export function num(v: number | ""): number {
  return typeof v === "number" && !Number.isNaN(v) ? v : 0
}

export function fmt(v: number, digits = 2): string {
  if (!Number.isFinite(v)) return "0"
  return v.toLocaleString("ru-RU", { maximumFractionDigits: digits })
}
