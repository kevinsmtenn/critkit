"use client"

import { useCritKit } from "@/hooks/use-critkit"
import { cn } from "@/lib/utils"

/** Nav status pill — reflects CritKit's live crit mode on this very page. */
export function LiveStatus({ className }: { className?: string }) {
  const snapshot = useCritKit()
  const on = snapshot?.critMode ?? false

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.16em] uppercase",
        on ? "text-destructive" : "text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5",
          on
            ? "bg-destructive shadow-[0_0_8px_var(--destructive)]"
            : "animate-pulse bg-[oklch(0.7_0.16_150)]",
        )}
      />
      {on ? "crit mode" : "live"}
    </span>
  )
}
