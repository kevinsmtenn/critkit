/**
 * Copy text to the clipboard with a graceful fallback.
 *
 * The async `navigator.clipboard.writeText` rejects when the document isn't
 * focused (iframes, devtools overlays, preview windows), and an `await` on it
 * also burns the click's user-activation token — so a naive try/await/catch
 * loses execCommand as a fallback. We run the synchronous `execCommand("copy")`
 * path FIRST (still inside the click's gesture) and fall back to the async
 * Clipboard API if it fails.
 */
export function copyText(value: string): Promise<boolean> {
  if (execCopy(value)) return Promise.resolve(true)
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard
      .writeText(value)
      .then(() => true)
      .catch(() => false)
  }
  return Promise.resolve(false)
}

function execCopy(value: string): boolean {
  if (typeof document === "undefined") return false
  const ta = document.createElement("textarea")
  ta.value = value
  ta.setAttribute("readonly", "")
  ta.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;pointer-events:none;"
  document.body.appendChild(ta)
  const prevActive = document.activeElement as HTMLElement | null
  ta.select()
  ta.setSelectionRange(0, value.length)
  let ok = false
  try {
    ok = document.execCommand("copy")
  } catch {
    ok = false
  }
  ta.remove()
  prevActive?.focus?.()
  return ok
}
