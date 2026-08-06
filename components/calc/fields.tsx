"use client"

import { useState } from "react"
import type React from "react"
import { Check, Copy, Printer } from "lucide-react"
import { cn } from "@/lib/utils"

export function NumberField({
  label,
  value,
  onChange,
  unit,
  min = 0,
  step = 0.1,
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
      <span className="text-foreground text-sm font-medium">{label}</span>
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
          className="border-input bg-card text-foreground focus:border-primary focus:ring-primary/20 h-11 w-full rounded-lg border px-3 pr-12 text-base transition-colors outline-none focus:ring-2"
        />
        {unit ? (
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm">
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
    <section className={cn("border-border bg-card rounded-xl border p-5", className)}>
      {title ? <h3 className="text-foreground mb-1 text-base font-semibold">{title}</h3> : null}
      {description ? (
        <p className="text-muted-foreground mb-4 text-sm text-pretty">{description}</p>
      ) : null}
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
        emphasize ? "border-border border-t pt-3" : "",
      )}
    >
      <span
        className={cn(
          "text-sm",
          emphasize ? "text-foreground font-semibold" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-right",
          emphasize ? "text-primary text-xl font-bold" : "text-foreground text-base font-medium",
        )}
      >
        {value}
        {unit ? (
          <span className="text-muted-foreground ml-1 text-sm font-normal">{unit}</span>
        ) : null}
      </span>
    </div>
  )
}

function ReportActions({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

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
    } catch {
      // ignore
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="no-print border-border mt-5 grid gap-2 border-t pt-4 sm:grid-cols-2 lg:grid-cols-1">
      <button
        type="button"
        onClick={() => window.print()}
        className="border-border text-foreground hover:bg-accent inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors"
      >
        <Printer className="size-4" />
        PDF
      </button>
      <button
        type="button"
        onClick={copyReport}
        className="border-border text-foreground hover:bg-accent inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Скопировано" : "Копировать"}
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
        <h2 className="text-foreground text-2xl font-bold text-balance">{title}</h2>
        <p className="text-muted-foreground mt-1 text-sm text-pretty">{description}</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-5">{inputs}</div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="border-border bg-card rounded-xl border p-5">
            <h3 className="text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase">
              Результат
            </h3>
            {results}
            {reportText ? <ReportActions text={reportText} /> : null}
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
