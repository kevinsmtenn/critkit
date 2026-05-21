import type { CritCategory } from "./types"

const INTERACTIVE_TAGS = new Set([
  "BUTTON",
  "A",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "SUMMARY",
  "LABEL",
])
const MEDIA_TAGS = new Set(["IMG", "VIDEO", "PICTURE", "SVG", "CANVAS", "IMAGE"])
const INTERACTIVE_ROLES = new Set(["button", "link", "menuitem", "tab", "switch"])

/**
 * Infer a lightweight category from the selected element — used only to pick
 * which fields {@link harvest} collects. A guess, so it never reaches the UI
 * or `CRIT.md`.
 */
export function inferCategory(element: Element): CritCategory {
  const tag = element.tagName.toUpperCase()
  const role = element.getAttribute("role")?.toLowerCase() ?? ""

  if (INTERACTIVE_TAGS.has(tag) || INTERACTIVE_ROLES.has(role)) return "interaction"
  if (MEDIA_TAGS.has(tag)) return "media"
  if (
    element.childElementCount === 0 &&
    (element.textContent ?? "").trim().length > 0
  ) {
    return "copy"
  }
  return "layout"
}

function truncate(value: string, max: number): string {
  const clean = value.replace(/\s+/g, " ").trim()
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean
}

/**
 * Collect conservative computed context from the live DOM. Reports observed
 * values only — never asserts a judgement ("inconsistent", "too small") so a
 * harvest can't put a false claim into the crit list.
 */
export function harvest(
  element: Element,
  category: CritCategory,
): Record<string, string> {
  const observed: Record<string, string> = {}
  const style = getComputedStyle(element)
  const rect = element.getBoundingClientRect()

  observed.size = `${Math.round(rect.width)}×${Math.round(rect.height)}px`

  if (category === "copy") {
    const text = (element.textContent ?? "").trim()
    if (text) observed.text = `"${truncate(text, 120)}"`
    observed.type = `${style.fontSize} · ${style.fontWeight} · ${style.lineHeight}`
  }

  if (category === "interaction" || category === "layout") {
    observed.padding = style.padding
    const parent = element.parentElement
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (child) => child !== element,
      )
      if (siblings.length > 0) {
        const siblingPadding = [
          ...new Set(siblings.map((s) => getComputedStyle(s).padding)),
        ]
        observed["sibling padding"] = siblingPadding.join(" | ")
      }
      const parentStyle = getComputedStyle(parent)
      if (/flex|grid/.test(parentStyle.display)) {
        observed["parent layout"] =
          `${parentStyle.display} ${parentStyle.flexDirection}`.trim()
        if (parentStyle.gap && parentStyle.gap !== "normal") {
          observed["parent gap"] = parentStyle.gap
        }
      }
    }
  }

  if (category === "media" && element instanceof HTMLImageElement) {
    observed.alt = element.alt ? `"${truncate(element.alt, 80)}"` : "(missing)"
    if (element.naturalWidth) {
      observed.intrinsic = `${element.naturalWidth}×${element.naturalHeight}px`
    }
    observed.loading = element.loading || "(default)"
  }

  observed.color = style.color
  if (style.backgroundColor && style.backgroundColor !== "rgba(0, 0, 0, 0)") {
    observed.background = style.backgroundColor
  }

  return observed
}
