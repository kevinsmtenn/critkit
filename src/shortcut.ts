import { critStore } from "./store"

/** Whether an event target is a text field — where a key should type a
 * character rather than fire a shortcut. */
export function isEditable(node: EventTarget): boolean {
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
  // While a capture popover is open the user is composing a crit note — `C`
  // must never toggle crit mode out from under it, even when focus has slipped
  // off the note field onto a popover button or the page behind it.
  if (critStore.getSnapshot().pending) return
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
