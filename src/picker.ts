import { motionValue } from "motion/react"
import { captureElement } from "./capture"
import { critStore } from "./store"

const OVERLAY_ID = "critkit-overlay-root"

/**
 * Live highlight rect for the hovered element. Driven outside React via motion
 * values so cursor tracking never re-renders the overlay. {@link Highlight}
 * reads these directly.
 */
export const highlight = {
  x: motionValue(0),
  y: motionValue(0),
  width: motionValue(0),
  height: motionValue(0),
  opacity: motionValue(0),
}

let listening = false
let frame = 0
let pointerX = 0
let pointerY = 0
let cursorStyle: HTMLStyleElement | null = null

/** The element under the cursor, skipping CritKit's own overlay. */
function elementUnder(x: number, y: number): Element | null {
  const element = document.elementFromPoint(x, y)
  if (!element || element.id === OVERLAY_ID) return null
  return element
}

function paintHighlight(): void {
  frame = 0
  const element = elementUnder(pointerX, pointerY)
  if (!element) {
    highlight.opacity.set(0)
    return
  }
  const rect = element.getBoundingClientRect()
  highlight.x.set(rect.left)
  highlight.y.set(rect.top)
  highlight.width.set(rect.width)
  highlight.height.set(rect.height)
  highlight.opacity.set(1)
}

function onPointerMove(event: PointerEvent): void {
  pointerX = event.clientX
  pointerY = event.clientY
  if (!frame) frame = requestAnimationFrame(paintHighlight)
}

function onPointerDown(event: PointerEvent): void {
  // Neutralise the page's own interaction (focus, drag) while picking.
  if (elementUnder(event.clientX, event.clientY)) {
    event.preventDefault()
    event.stopPropagation()
  }
}

function onClick(event: MouseEvent): void {
  const element = elementUnder(event.clientX, event.clientY)
  if (!element) return // a click on CritKit's own UI — let it through
  event.preventDefault()
  event.stopPropagation()
  captureElement(element)
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.key === "Escape") critStore.setCritMode(false)
}

function setCrosshair(on: boolean): void {
  if (on && !cursorStyle) {
    cursorStyle = document.createElement("style")
    cursorStyle.textContent = "*{cursor:crosshair !important}"
    document.head.appendChild(cursorStyle)
  } else if (!on && cursorStyle) {
    cursorStyle.remove()
    cursorStyle = null
  }
}

function start(): void {
  if (listening || typeof document === "undefined") return
  listening = true
  document.addEventListener("pointermove", onPointerMove, true)
  document.addEventListener("pointerdown", onPointerDown, true)
  document.addEventListener("click", onClick, true)
  document.addEventListener("keydown", onKeyDown, true)
  setCrosshair(true)
}

function stop(): void {
  if (!listening) return
  listening = false
  document.removeEventListener("pointermove", onPointerMove, true)
  document.removeEventListener("pointerdown", onPointerDown, true)
  document.removeEventListener("click", onClick, true)
  document.removeEventListener("keydown", onKeyDown, true)
  setCrosshair(false)
  if (frame) {
    cancelAnimationFrame(frame)
    frame = 0
  }
  highlight.opacity.set(0)
}

/**
 * Sync the picker to the store — pick while crit mode is on and no capture
 * popover is open. Subscribe this to {@link critStore}.
 */
export function syncPicker(): void {
  const { critMode, pending } = critStore.getSnapshot()
  if (critMode && !pending) start()
  else stop()
}
