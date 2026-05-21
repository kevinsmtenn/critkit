import { cn } from "@/lib/utils"

/** A single keycap — sharp, mono, mirroring CritKit's in-overlay `.ck-kbd`. */
export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center border border-border bg-muted px-1.5 font-mono text-[11px] leading-none font-medium text-foreground",
        className,
      )}
    >
      {children}
    </kbd>
  )
}
