"use client"

import { Crosshair } from "lucide-react"

import { getCritKit } from "@/lib/critkit"
import { useCritKit } from "@/hooks/use-critkit"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Drives CritKit's real crit mode from the page — the demo's primary CTA. */
export function StartCritButton({
  size = "lg",
  className,
}: {
  size?: "default" | "sm" | "lg"
  className?: string
}) {
  const snapshot = useCritKit()
  const on = snapshot?.critMode ?? false

  return (
    <Button
      size={size}
      variant={on ? "destructive" : "default"}
      onClick={() => getCritKit()?.store.setCritMode(true)}
      className={cn("font-mono", className)}
    >
      <Crosshair />
      {on ? "Crit mode on — press Esc to exit" : "Start a crit pass"}
    </Button>
  )
}
