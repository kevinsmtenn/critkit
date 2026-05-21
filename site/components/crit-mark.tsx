import { cn } from "@/lib/utils"

/** CritKit's mark — a sharp frame around a single crit dot, echoing the
 * launcher pill whose dot goes red the moment crit mode is armed. */
export function CritMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-5 shrink-0 place-items-center border border-foreground/35",
        className,
      )}
      aria-hidden
    >
      <span className="size-1.5 bg-destructive" />
    </span>
  )
}
