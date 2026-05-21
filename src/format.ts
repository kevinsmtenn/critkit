import type { CritSource } from "./types"

/** Compact source label — component first, then last two path segments + line. */
export function shortLocation(source: CritSource): string {
  const parts: string[] = []
  if (source.componentName) parts.push(`<${source.componentName}>`)
  if (source.filePath) {
    const tail = source.filePath.split("/").slice(-2).join("/")
    parts.push(source.lineNumber != null ? `${tail}:${source.lineNumber}` : tail)
  }
  if (parts.length === 0 && source.tagName) parts.push(`<${source.tagName}>`)
  return parts.join(" ") || "source unresolved"
}
