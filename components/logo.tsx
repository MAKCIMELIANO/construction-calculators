import { Calculator } from "lucide-react"
import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return <Calculator className={cn("size-5", className)} aria-hidden />
}

export function Logo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <LogoMark className="size-5" />
      </div>
      {showText ? (
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight text-sidebar-foreground">СтройКалькулятор</p>
          <p className="text-xs text-muted-foreground">Расчёт материалов</p>
        </div>
      ) : null}
    </div>
  )
}
