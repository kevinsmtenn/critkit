import { critStore } from "./store"

/** Whether an event target is a text field — where `C` should type, not toggle. */
function isEditable(node: EventTarget): boolean {
  if (!(node instanceof HTMLElement)) return false
  return (
    node.tagName === "INPUT" ||
    node.tagName === "TEXTAREA" ||
    node.isContentEditable
  )
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.key.toLowerCase() !== "c") return
  if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
  // composedPath pierces shadow roots — so this also catches CritKit's own
  // note field, where `C` must type a character rather than toggle.
  if (event.composedPath().some(isEditable)) return
  event.preventDefault()
  critStore.toggleCritMode()
}

/**
 * Install the global crit-mode shortcut: a plain `C` toggles crit mode,
 * unless focus is in a text field. Escape (handled by the picker) exits.
 */
export function installShortcut(): void {
  if (typeof document === "undefined") return
  document.addEventListener("keydown", onKeyDown)
}
