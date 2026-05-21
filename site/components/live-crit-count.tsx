"use client"

import { useCritKit } from "@/hooks/use-critkit"
import { cn } from "@/lib/utils"

/** Reads the live crit store so the demo proves itself — the count ticks up
 * as a visitor actually crits the page. */
export function LiveCritCount() {
  const snapshot = useCritKit()
  const count = snapshot?.crits.length ?? 0
  const on = snapshot?.critMode ?? false

  const hint =
    count > 0
      ? "Open the crit list, docked to your screen edge, and copy the crit prompt."
      : on
        ? "Crit mode is on. Hover the panel and click anything."
        : "Press C, then click an element in the panel."

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border border-border bg-card px-3.5 py-2.5 font-mono text-xs">
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className={cn(
            "size-1.5",
            count > 0 ? "bg-destructive" : "bg-muted-foreground/60",
          )}
        />
        <span className="text-foreground tabular-nums">{count}</span>
        <span className="text-muted-foreground">
          {count === 1 ? "crit" : "crits"} logged
        </span>
      </span>
      <span aria-hidden className="h-3 w-px bg-border" />
      <span className="text-muted-foreground">{hint}</span>
    </div>
  )
}
