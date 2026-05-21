"use client"

import { Crosshair } from "lucide-react"

import { getCritKit } from "@/lib/critkit"
import { useCritKit } from "@/hooks/use-critkit"
import { useCoarsePointer } from "@/hooks/use-coarse-pointer"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Drives CritKit's real crit mode from the page — the demo's primary CTA.
 * Disabled on touch devices: crit mode is hover-to-pick and has no mobile UX,
 * so the button states the constraint instead of dropping users into it.
 */
export function StartCritButton({
  size = "lg",
  className,
}: {
  size?: "default" | "sm" | "lg"
  className?: string
}) {
  const snapshot = useCritKit()
  const on = snapshot?.critMode ?? false
  const touchOnly = useCoarsePointer()

  return (
    <Button
      size={size}
      variant={on ? "destructive" : "default"}
      disabled={touchOnly}
      onClick={() => getCritKit()?.store.setCritMode(true)}
      className={cn("font-mono", className)}
      title={
        touchOnly
          ? "Crit mode needs a mouse to hover and pick elements. Open this on desktop."
          : undefined
      }
    >
      <Crosshair />
      {touchOnly ? "Crit on desktop" : on ? "Crit mode on" : "Start a crit"}
      {!touchOnly && (
        <kbd className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center border border-current/40 px-1 text-[10px] leading-none">
          {on ? "Esc" : "C"}
        </kbd>
      )}
    </Button>
  )
}
