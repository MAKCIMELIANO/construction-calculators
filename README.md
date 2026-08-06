# БудКалькулятор / СтройКалькулятор

Калькуляторы строительных материалов для бригад и частных работ.  
UI: **украинский** по умолчанию, переключатель на **русский**.

**Demo:** [construction-calculators-fawn.vercel.app](https://construction-calculators-fawn.vercel.app/)

## Что внутри

| Калькулятор | Что считает |
|---|---|
| Площадь комнаты | пол, стены, проёмы; несколько комнат |
| Обои / краска / плитка | рулоны, литры, упаковки |
| Стяжка / штукатурка / ГКЛ | объём и мешки / листы |
| Бетон | м³ + цемент, песок, щебень, вода |
| Куча | объём конуса → тонны (песок / щебень) |
| Справочник | типовые плотности, расходы, марки бетона |

Дополнительно: тёмная тема, сохранение вводов в `localStorage`, подстановка метрик комнаты в другие калькуляторы, PDF / копирование отчёта, футер с контактами.

## Стек

- Next.js (App Router) + React 19 + TypeScript  
- Tailwind CSS 4  
- i18n (uk / ru) без внешних библиотек  
- Deploy: Vercel (pnpm)

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
npm start
```

Форматирование: `npm run format`

> На Vercel используется **pnpm** и `pnpm-lock.yaml`. Если меняешь зависимости в `package.json` — синхронизируй lockfile (`CI=true npx pnpm@9 install --lockfile-only`) и коммить оба файла.

## Структура

```
app/                  # layout + главная с сайдбаром
components/calc/      # калькуляторы и общие поля
lib/i18n/             # словари uk/ru
lib/handbook/         # константы справочника / бетона / кучи
lib/rooms.ts          # комнаты в localStorage
lib/site.ts           # контакты автора
```

## Автор

**MAKCIMELIANO** · Frontend (Next.js)  
Email: [makcimeliano@email.com](mailto:makcimeliano@email.com)  
GitHub: [github.com/MAKCIMELIANO](https://github.com/MAKCIMELIANO)
