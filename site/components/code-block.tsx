import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/copy-button"

/** A window-chromed code panel. Comment lines are dimmed; no heavyweight
 * highlighter — plain mono on a dark surface reads as the terminal it is. */
export function CodeBlock({
  file,
  code,
  className,
}: {
  file: string
  code: string
  className?: string
}) {
  const lines = code.replace(/\n$/, "").split("\n")

  return (
    <div className={cn("bg-card ring-1 ring-foreground/10", className)}>
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="font-mono text-[11px] text-muted-foreground">
          {file}
        </span>
        <CopyButton value={code} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed">
        <code>
          {lines.map((line, i) => {
            const comment = line.trimStart().startsWith("//")
            return (
              <span
                key={i}
                className={cn(
                  "block",
                  comment ? "text-muted-foreground/60" : "text-foreground",
                )}
              >
                {line || " "}
              </span>
            )
          })}
        </code>
      </pre>
    </div>
  )
}
