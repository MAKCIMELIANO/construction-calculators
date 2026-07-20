"use client"

import { useState } from "react"
import {
  Calculator,
  DoorOpen,
  Layers,
  Menu,
  PaintBucket,
  Ruler,
  Square,
  Wallpaper,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { RoomAreaCalculator } from "@/components/calc/room-area"
import { WallpaperCalculator } from "@/components/calc/wallpaper"
import { PaintCalculator } from "@/components/calc/paint"
import { TileCalculator } from "@/components/calc/tile"
import { ScreedCalculator } from "@/components/calc/screed"
import { PlasterCalculator } from "@/components/calc/plaster"

const CALCULATORS = [
  { id: "room", name: "Площадь комнаты", desc: "Стены, пол, потолок", icon: Ruler, Component: RoomAreaCalculator },
  { id: "wallpaper", name: "Обои", desc: "Рулоны", icon: Wallpaper, Component: WallpaperCalculator },
  { id: "paint", name: "Краска", desc: "Литры и банки", icon: PaintBucket, Component: PaintCalculator },
  { id: "tile", name: "Плитка / ламинат", desc: "Штуки и упаковки", icon: Square, Component: TileCalculator },
  { id: "screed", name: "Стяжка / смесь", desc: "Объём и мешки", icon: Layers, Component: ScreedCalculator },
  { id: "plaster", name: "Штукатурка", desc: "Мешки смеси", icon: DoorOpen, Component: PlasterCalculator },
] as const

export default function Page() {
  const [activeId, setActiveId] = useState<(typeof CALCULATORS)[number]["id"]>("room")
  const [mobileOpen, setMobileOpen] = useState(false)

  const active = CALCULATORS.find((c) => c.id === activeId) ?? CALCULATORS[0]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "no-print fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calculator className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-sidebar-foreground">СтройКалькулятор</p>
            <p className="text-xs text-muted-foreground">Расчёт материалов</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Закрыть меню"
            className="ml-auto text-muted-foreground lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <p className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Калькуляторы
          </p>
          <ul className="flex flex-col gap-1">
            {CALCULATORS.map((c) => {
              const Icon = c.icon
              const isActive = c.id === activeId
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(c.id)
                      setMobileOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="size-5 shrink-0" />
                    <span className="flex flex-col">
                      <span className="text-sm font-medium leading-tight">{c.name}</span>
                      <span
                        className={cn(
                          "text-xs leading-tight",
                          isActive ? "text-sidebar-primary-foreground/80" : "text-muted-foreground",
                        )}
                      >
                        {c.desc}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <ThemeToggle />
          <p className="mt-2 px-2 text-xs text-muted-foreground">
            Значения по умолчанию — примерные, уточняйте по факту.
          </p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Закрыть меню"
          onClick={() => setMobileOpen(false)}
          className="no-print fixed inset-0 z-30 bg-foreground/40 lg:hidden"
        />
      ) : null}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print flex items-center gap-3 border-b border-border px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть меню"
            className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground"
          >
            <Menu className="size-5" />
          </button>
          <span className="text-sm font-semibold text-foreground">{active.name}</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {CALCULATORS.map((c) => {
            const Component = c.Component
            const isActive = c.id === activeId

            return (
              <div key={c.id} className={isActive ? "block" : "hidden"} aria-hidden={!isActive}>
                <Component />
              </div>
            )
          })}
        </main>
      </div>
    </div>
  )
}
