import type { Crit } from "./types"

function formatSource(crit: Crit): string {
  const location = crit.filePath
    ? crit.lineNumber != null
      ? `${crit.filePath}:${crit.lineNumber}`
      : crit.filePath
    : null
  if (location && crit.componentName) return `${location} — <${crit.componentName}>`
  if (location) return location
  if (crit.componentName) return `<${crit.componentName}> (file unresolved)`
  return "(source unresolved)"
}

/**
 * Assemble crits into a ready-to-paste agent prompt: a short template wrapper
 * plus one source-anchored item per crit — numbered into a work-through list
 * when there's more than one, a single plain item when there's just one (the
 * shape produced by a per-capture auto-copy). Copy it whole into your agent.
 */
export function buildPrompt(crits: Crit[]): string {
  if (crits.length === 0) return ""

  const single = crits.length === 1

  const header = single
    ? [
        "Here's a piece of design feedback from a crit session.",
        "It carries a source location and values harvested from the live DOM.",
        "",
      ]
    : [
        "Here's a list of feedback from a crit session. Please work through it top to bottom.",
        "First, turn every item below into a to-do for yourself so you don't skip any.",
        "Each item carries a source location and values harvested from the live DOM.",
        "",
      ]

  const items = crits.map((crit, index) => {
    const lines = [
      `${single ? "" : `${index + 1}. `}${
        crit.note.trim() || "(needs attention — see observed values)"
      }`,
      `   source: ${formatSource(crit)}`,
    ]
    if (crit.tagName) lines.push(`   element: <${crit.tagName}>`)
    for (const [key, value] of Object.entries(crit.observed)) {
      lines.push(`   ${key}: ${value}`)
    }
    return lines.join("\n")
  })

  return [...header, items.join("\n\n")].join("\n")
}
