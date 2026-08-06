"use client"

import { useState } from "react"
import {
  DoorOpen,
  Layers,
  LayoutGrid,
  Menu,
  PaintBucket,
  Ruler,
  Square,
  Wallpaper,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo, LogoMark } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { LocaleToggle } from "@/components/locale-toggle"
import { RoomAreaCalculator } from "@/components/calc/room-area"
import { WallpaperCalculator } from "@/components/calc/wallpaper"
import { PaintCalculator } from "@/components/calc/paint"
import { TileCalculator } from "@/components/calc/tile"
import { ScreedCalculator } from "@/components/calc/screed"
import { PlasterCalculator } from "@/components/calc/plaster"
import { DrywallCalculator } from "@/components/calc/drywall"
import { useT } from "@/lib/i18n/context"

const CALCULATORS = [
  {
    id: "room",
    nameKey: "nav.room",
    descKey: "nav.roomDesc",
    icon: Ruler,
    Component: RoomAreaCalculator,
  },
  {
    id: "wallpaper",
    nameKey: "nav.wallpaper",
    descKey: "nav.wallpaperDesc",
    icon: Wallpaper,
    Component: WallpaperCalculator,
  },
  {
    id: "paint",
    nameKey: "nav.paint",
    descKey: "nav.paintDesc",
    icon: PaintBucket,
    Component: PaintCalculator,
  },
  {
    id: "tile",
    nameKey: "nav.tile",
    descKey: "nav.tileDesc",
    icon: Square,
    Component: TileCalculator,
  },
  {
    id: "screed",
    nameKey: "nav.screed",
    descKey: "nav.screedDesc",
    icon: Layers,
    Component: ScreedCalculator,
  },
  {
    id: "plaster",
    nameKey: "nav.plaster",
    descKey: "nav.plasterDesc",
    icon: DoorOpen,
    Component: PlasterCalculator,
  },
  {
    id: "drywall",
    nameKey: "nav.drywall",
    descKey: "nav.drywallDesc",
    icon: LayoutGrid,
    Component: DrywallCalculator,
  },
] as const

export default function Page() {
  const t = useT()
  const [activeId, setActiveId] = useState<(typeof CALCULATORS)[number]["id"]>("room")
  const [mobileOpen, setMobileOpen] = useState(false)

  const active = CALCULATORS.find((c) => c.id === activeId) ?? CALCULATORS[0]

  return (
    <div className="bg-background flex min-h-screen">
      <aside
        className={cn(
          "no-print border-sidebar-border bg-sidebar fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="border-sidebar-border flex items-center gap-2.5 border-b px-5 py-5">
          <Logo className="min-w-0 flex-1" />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label={t("nav.closeMenu")}
            className="text-muted-foreground shrink-0 lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <p className="text-muted-foreground px-2 pt-1 pb-2 text-xs font-semibold tracking-wide uppercase">
            {t("nav.calculators")}
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
                      <span className="text-sm leading-tight font-medium">{t(c.nameKey)}</span>
                      <span
                        className={cn(
                          "text-xs leading-tight",
                          isActive ? "text-sidebar-primary-foreground/80" : "text-muted-foreground",
                        )}
                      >
                        {t(c.descKey)}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="border-sidebar-border border-t p-3">
          <LocaleToggle />
          <ThemeToggle className="mt-1" />
          <p className="text-muted-foreground mt-2 px-2 text-xs">{t("nav.disclaimer")}</p>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          aria-label={t("nav.closeMenu")}
          onClick={() => setMobileOpen(false)}
          className="no-print bg-foreground/40 fixed inset-0 z-30 lg:hidden"
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print border-border flex items-center gap-3 border-b px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label={t("nav.openMenu")}
            className="border-border text-foreground flex size-9 items-center justify-center rounded-lg border"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
              <LogoMark className="size-4" />
            </div>
            <span className="text-foreground truncate text-sm font-semibold">{t(active.nameKey)}</span>
          </div>
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
