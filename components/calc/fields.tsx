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

function IconTelegram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.8 4.3c.3-.9-.5-1.6-1.3-1.3L2.9 9.6c-.9.3-.9 1.6.1 1.8l4.4 1.1 1.7 5.3c.3.9 1.5 1.1 2.1.4l2.4-2.5 4.5 3.3c.8.6 1.9.1 2.1-.9l2.6-13.8ZM8.8 12.8l8.6-5.4c.2-.1.4.2.2.3l-7.1 6.5-.5 3.1-1.2-4.5Z" />
    </svg>
  )
}

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.3-1.4A9.9 9.9 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-.9-.3-1.8-1.1-.7-.6-1.1-1.3-1.3-1.5-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.2.2-.4 0-.1 0-.3-.1-.4-.1-.1-.5-1.3-.7-1.7-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4.5.2 1 .4 1.3.5.6.2 1.1.1 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  )
}

function IconViber({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M11.4 2C7 2.2 3.4 5.3 3 9.6c-.3 3.3.8 6.1 3.2 8l.1 2.9c0 .5.5.8 1 .6l3.1-1.3c.4.1.8.1 1.2.1 4.6 0 8.4-3.5 8.6-8 .2-4.7-3.7-8.6-9-9Zm4.9 11.6c-.2.6-.9 1.1-1.5 1.3-.4.1-1 .2-2.9-.6-2.3-1-3.8-3.4-3.9-3.6-.2-.2-1.2-1.6-1.2-3 0-1.4.7-2.1.9-2.3.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.7 1.8.7 1.9.1.2.1.3 0 .5l-.3.4c-.1.1-.2.3-.1.5.1.2.5.8 1.1 1.3.7.7 1.4 1 1.6 1.1.2.1.4.1.5 0l.7-.8c.1-.2.3-.2.5-.1.2.1 1.4.7 1.6.8.3.1.4.2.5.3.1.2.1.9-.1 1.5Z" />
    </svg>
  )
}

type ShareItemProps = {
  title: string
  description: string
  onClick: () => void
  icon: React.ReactNode
  iconClassName: string
}

function ShareMenuItem({ title, description, onClick, icon, iconClassName }: ShareItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg text-white",
          iconClassName,
        )}
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-medium leading-tight">{title}</span>
        <span className="text-xs leading-tight text-muted-foreground">{description}</span>
      </span>
    </button>
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
          className={cn(
            "inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors",
            menuOpen
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-foreground hover:bg-accent",
          )}
        >
          <Share2 className="size-4" />
          Поделиться
        </button>

        {menuOpen ? (
          <div className="absolute bottom-full left-0 right-0 z-20 mb-2 rounded-xl border border-border bg-card p-2 shadow-lg">
            <p className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Поделиться
            </p>
            <ul className="flex flex-col gap-1">
              <li>
                <ShareMenuItem
                  title="Telegram"
                  description="Отправить в чат"
                  onClick={shareTelegram}
                  icon={<IconTelegram className="size-4" />}
                  iconClassName="bg-[#2AABEE]"
                />
              </li>
              <li>
                <ShareMenuItem
                  title="WhatsApp"
                  description="Отправить в чат"
                  onClick={shareWhatsApp}
                  icon={<IconWhatsApp className="size-4" />}
                  iconClassName="bg-[#25D366]"
                />
              </li>
              <li>
                <ShareMenuItem
                  title="Viber"
                  description="Отправить в чат"
                  onClick={shareViber}
                  icon={<IconViber className="size-4" />}
                  iconClassName="bg-[#7360F2]"
                />
              </li>
              <li>
                <ShareMenuItem
                  title={copied ? "Скопировано" : "Скопировать"}
                  description="Текст расчёта"
                  onClick={copyReport}
                  icon={copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  iconClassName="bg-primary text-primary-foreground"
                />
              </li>
              {canNativeShare ? (
                <li>
                  <ShareMenuItem
                    title="Ещё приложения"
                    description="Системное меню"
                    onClick={shareNative}
                    icon={<Share2 className="size-4" />}
                    iconClassName="bg-muted text-foreground"
                  />
                </li>
              ) : null}
            </ul>
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
