import { cn } from "@/lib/utils"

/** CritKit's mark — the red square, matching the app icon. */
export function CritMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-3.5 shrink-0 bg-[#ef4444]", className)}
    />
  )
}
