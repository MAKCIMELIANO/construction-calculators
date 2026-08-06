import { uk, type MessageKey } from "./uk"
import { ru } from "./ru"

export type Locale = "uk" | "ru"
export type { MessageKey }

export const DEFAULT_LOCALE: Locale = "uk"
export const LOCALE_STORAGE_KEY = "locale"

const dictionaries: Record<Locale, Record<MessageKey, string>> = {
  uk: uk as Record<MessageKey, string>,
  ru,
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "uk" || value === "ru"
}

export function numberLocale(locale: Locale): string {
  return locale === "ru" ? "ru-RU" : "uk-UA"
}

export type TranslateParams = Record<string, string | number>

export function translate(
  locale: Locale,
  key: MessageKey,
  params?: TranslateParams,
): string {
  let text = dictionaries[locale][key] ?? dictionaries.uk[key] ?? key
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replaceAll(`{${name}}`, String(value))
    }
  }
  return text
}
