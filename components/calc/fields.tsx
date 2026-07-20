"use client"

import { useEffect, useRef, useState } from "react"
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

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
}

function ReportActions({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === "function" && isMobileDevice())
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [menuOpen])

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
    setMenuOpen(false)
    window.setTimeout(() => setCopied(false), 1800)
  }

  function openShare(url: string) {
    window.open(url, "_blank", "noopener,noreferrer")
    setMenuOpen(false)
  }

  function shareTelegram() {
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`
    openShare(url)
  }

  function shareWhatsApp() {
    openShare(`https://wa.me/?text=${encodeURIComponent(text)}`)
  }

  function shareViber() {
    // Deep-link Viber: на телефоне откроет приложение, на ПК — если установлен клиент
    openShare(`viber://forward?text=${encodeURIComponent(text)}`)
  }

  async function shareNative() {
    setMenuOpen(false)
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, text, url: window.location.href })
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      await copyReport()
    }
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
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Скопировано" : "Копировать"}
      </button>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <Share2 className="size-4" />
          Поделиться
        </button>

        {menuOpen ? (
          <div className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
            <button
              type="button"
              onClick={shareTelegram}
              className="flex w-full items-center px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
            >
              Telegram
            </button>
            <button
              type="button"
              onClick={shareWhatsApp}
              className="flex w-full items-center px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
            >
              WhatsApp
            </button>
            <button
              type="button"
              onClick={shareViber}
              className="flex w-full items-center px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
            >
              Viber
            </button>
            <button
              type="button"
              onClick={copyReport}
              className="flex w-full items-center px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
            >
              Скопировать текст
            </button>
            {canNativeShare ? (
              <button
                type="button"
                onClick={shareNative}
                className="flex w-full items-center border-t border-border px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
              >
                Ещё приложения…
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
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
