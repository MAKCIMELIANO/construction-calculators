import { DEFAULT_LOCALE, numberLocale as toNumberLocale, type Locale } from "./index"

let currentNumberLocale = toNumberLocale(DEFAULT_LOCALE)

export function setFmtLocale(locale: Locale) {
  currentNumberLocale = toNumberLocale(locale)
}

export function fmtNumber(v: number, digits = 2): string {
  if (!Number.isFinite(v)) return "0"
  return v.toLocaleString(currentNumberLocale, { maximumFractionDigits: digits })
}
