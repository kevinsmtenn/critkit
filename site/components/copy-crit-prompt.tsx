"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { buildPrompt } from "@/lib/critkit"
import { copyText } from "@/lib/clipboard"
import { useCritKit } from "@/hooks/use-critkit"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Copies the live crit prompt straight from the demo — the same text the
 * docked list panel's footer button emits (`buildPrompt`). Disabled until the
 * visitor has logged a crit, so the crit → copy → paste loop has its copy step
 * right here in section 02 rather than only on the floating dock.
 */
export function CopyCritPromptButton({
  size = "default",
  className,
}: {
  size?: "default" | "sm" | "lg"
  className?: string
}) {
  const snapshot = useCritKit()
  const crits = snapshot?.crits ?? []
  const count = crits.length
  const [copied, setCopied] = useState(false)

  if (count === 0) return null

  return (
    <Button
      type="button"
      size={size}
      variant="outline"
      onClick={async () => {
        const ok = await copyText(buildPrompt(crits))
        if (!ok) return
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }}
      className={cn("font-mono", className)}
    >
      {copied ? (
        <Check className="text-[oklch(0.7_0.16_150)]" />
      ) : (
        <Copy />
      )}
      {copied ? "Copied crit prompt" : "Copy crit prompt"}
    </Button>
  )
}
