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
 * Assemble the crit list into a ready-to-paste agent prompt: a short template
 * wrapper plus one numbered, source-anchored item per crit. This is the thing
 * you copy whole into your coding agent.
 */
export function buildPrompt(crits: Crit[]): string {
  if (crits.length === 0) return ""

  const header = [
    "Here's a crit pass on the running app — please work through each item top to bottom.",
    "Each item carries a source location and values harvested from the live DOM.",
    "",
  ]

  const items = crits.map((crit, index) => {
    const lines = [
      `${index + 1}. ${
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

/**
 * The `CRIT.md` markdown variant — a checkbox list with stable `crit:<id>`
 * comments so a future version can reconcile a living file. Used by the
 * dev-plugin write (M6); the Copy path uses {@link buildPrompt}.
 */
export function buildCritMd(crits: Crit[]): string {
  const stamp = new Date().toLocaleString()
  const lines = [`## Crit pass — ${stamp}`, ""]

  for (const crit of crits) {
    lines.push(
      `- [ ] ${
        crit.note.trim() || "(needs attention)"
      }  <!-- crit:${crit.id} -->`,
    )
    lines.push(`  - ${formatSource(crit)}`)
    if (crit.tagName) lines.push(`  - element: \`<${crit.tagName}>\``)
    for (const [key, value] of Object.entries(crit.observed)) {
      lines.push(`  - ${key}: ${value}`)
    }
  }

  return lines.join("\n")
}
