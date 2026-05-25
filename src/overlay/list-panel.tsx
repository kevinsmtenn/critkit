import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react"
import {
  AnimatePresence,
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
} from "motion/react"
import { anchorOrigin, DOCK_ANCHORS, nearestAnchor, type DockSize } from "../dock"
import { shortLocation } from "../format"
import { isEditable } from "../shortcut"
import { critStore } from "../store"
import type { Crit, DockAnchor } from "../types"
import { buildPrompt } from "../writer"
import { copyText } from "../clipboard"

type StartDrag = (event: ReactPointerEvent) => void

/** "Copy 3 crits as a prompt" — the footer button label, count-aware and
 * pluralized. `verb` swaps "Copy" → "Copied" for the post-copy ✓ state. */
function copyLabel(count: number, verb: "Copy" | "Copied"): string {
  return `${verb} ${count} ${count === 1 ? "crit" : "crits"} as a prompt`
}

// Magnet field: inside OUTER the dock is pulled toward the nearest anchor;
// inside INNER it locks fully onto it.
const MAGNET_OUTER = 150
const MAGNET_INNER = 60

// Keys shown on the Copy button — ⌘⌥C on macOS, Ctrl+Alt+C elsewhere.
const COPY_KEYS =
  typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent)
    ? ["⌘", "⌥", "C"]
    : ["Ctrl", "Alt", "C"]

/** The List's noun — singular for an empty or single-crit session. */
function critsLabel(count: number): string {
  return count <= 1 ? "Crit" : "Crits"
}

function TrashIcon() {
  return (
    <svg
      className="ck-trash"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg
      className="ck-copy"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d="M8 8h12v12H8zM16 8V4H4v12h4" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      className="ck-check"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d="M5 13l4 4 10-11" />
    </svg>
  )
}

/**
 * The running List — a draggable dock holding the collapsed badge or the
 * expanded panel. While dragging it is magnetically pulled toward the nearest
 * of 7 snap points (see {@link DOCK_ANCHORS}).
 */
export function ListPanel({
  crits,
  open,
  anchor,
  critMode,
}: {
  crits: Crit[]
  open: boolean
  anchor: DockAnchor
  critMode: boolean
}) {
  const reduce = !!useReducedMotion()
  // The List stays up for the whole session. Once crit mode is on it is always
  // visible — through every pick → capture → commit, with no flicker — since
  // crit mode never drops mid-session (the picker only pauses for the popover).
  // Afterwards it lingers while the session still has crits to copy; only turning
  // crit mode off can dismiss it.
  const visible = critMode || crits.length > 0
  // Expanded to the full panel for the whole live session (and once the user has
  // opened it). The collapsed badge is only ever for an idle, crit-mode-off
  // session the user has folded away.
  const expanded = open || critMode

  const dockRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [size, setSize] = useState<DockSize | null>(null)
  const [dragging, setDragging] = useState(false)
  const [hintAnchor, setHintAnchor] = useState<DockAnchor>(anchor)
  // The number of crits in the last copy (1 for a per-capture auto-copy, all of
  // them for the footer button), or null while the button shows its idle label.
  const [copiedCount, setCopiedCount] = useState<number | null>(null)
  const placed = useRef(false)
  const draggingRef = useRef(false)
  const draggedRef = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const prevAnchor = useRef(anchor)
  const settleAnimations = useRef<Array<{ stop: () => void }>>([])
  const copyTimer = useRef(0)

  const stopSettling = (): void => {
    settleAnimations.current.forEach((animation) => animation.stop())
    settleAnimations.current = []
  }

  // Measure the dock; track size through content swaps and viewport resizes.
  useLayoutEffect(() => {
    const element = dockRef.current
    if (!element) return
    const measure = (): void => {
      setSize({ w: element.offsetWidth, h: element.offsetHeight })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [visible])

  // Pin the dock to its anchor. A size change (badge ⇄ panel) snaps instantly;
  // only an anchor change (a drag) springs.
  useLayoutEffect(() => {
    if (!size || draggingRef.current || size.w < 40 || size.h < 24) return
    const origin = anchorOrigin(anchor, size)
    const anchorChanged = prevAnchor.current !== anchor
    prevAnchor.current = anchor
    if (!placed.current || !anchorChanged) {
      x.set(origin.x)
      y.set(origin.y)
      placed.current = true
      return
    }
    stopSettling()
    const transition = reduce
      ? { duration: 0.12 }
      : ({ type: "spring", stiffness: 480, damping: 38 } as const)
    settleAnimations.current = [
      animate(x, origin.x, transition),
      animate(y, origin.y, transition),
    ]
  }, [anchor, size, x, y, reduce])

  useEffect(() => {
    if (!visible) placed.current = false
  }, [visible])

  // Flash the footer button's ✓ confirmation with how many crits were copied —
  // shared by the manual Copy button, the ⌘⌥C shortcut, and the auto-copy.
  const flashCopied = useCallback((count: number): void => {
    setCopiedCount(count)
    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopiedCount(null), 1800)
  }, [])

  // Copy the agent prompt — shared by the panel's Copy button and the ⌘⌥C
  // shortcut. An explicit copy ends the session.
  const copyPrompt = useCallback((): void => {
    if (crits.length === 0) return
    void copyText(buildPrompt(crits)).then((ok) => {
      if (!ok) return
      // Copying the prompt ends the session — drop crit mode so the
      // picker's crosshair clears and the page is interactive again.
      critStore.setCritMode(false)
      // Surface the panel so the ✓ confirmation is visible even when the
      // shortcut fires while the List is collapsed to its badge.
      critStore.setPanelOpen(true)
      flashCopied(crits.length)
    })
  }, [crits, flashCopied])

  // Each capture auto-copies just the crit that was added — a single-crit
  // prompt, ready to paste — without ending the session. The footer button is
  // what copies every crit at once. prevCount starts at the mounted length so
  // crits restored from sessionStorage don't auto-copy.
  const prevCount = useRef(crits.length)
  useEffect(() => {
    if (crits.length > prevCount.current) {
      const fresh = crits.slice(prevCount.current)
      void copyText(buildPrompt(fresh)).then((ok) => {
        if (ok) flashCopied(fresh.length)
      })
    }
    prevCount.current = crits.length
  }, [crits, flashCopied])

  // ⌘⌥C (⌃⌥C on Windows/Linux) copies the prompt from anywhere in the session.
  useEffect(() => {
    const onCopyKey = (event: KeyboardEvent): void => {
      if (event.repeat || event.code !== "KeyC" || event.shiftKey) return
      if (!((event.metaKey || event.ctrlKey) && event.altKey)) return
      // Self-guard against text fields — same as the `C` toggle — so the combo
      // never fires while typing (Ctrl+Alt+C overlaps AltGr+C on some layouts).
      if (event.composedPath().some(isEditable)) return
      event.preventDefault()
      copyPrompt()
    }
    document.addEventListener("keydown", onCopyKey)
    return () => document.removeEventListener("keydown", onCopyKey)
  }, [copyPrompt])

  if (!visible) return null

  const startDrag: StartDrag = (event) => {
    draggedRef.current = false
    dragControls.start(event)
  }

  // Tap-to-open, guarded: a drag past threshold sets draggedRef, so the click
  // that ends a drag doesn't also expand the panel.
  const openPanel = (): void => {
    if (draggedRef.current) {
      draggedRef.current = false
      return
    }
    critStore.setPanelOpen(true)
  }

  // Tap the panel header to minimize it back to the badge — same drag-guard as
  // openPanel. No-op while crit mode pins the panel open.
  const minimize = (): void => {
    if (draggedRef.current) {
      draggedRef.current = false
      return
    }
    if (critMode) return
    critStore.setPanelOpen(false)
  }

  return (
    <>
      <AnimatePresence>
        {dragging && size ? (
          <SnapHints key="ck-hints" size={size} active={hintAnchor} />
        ) : null}
      </AnimatePresence>

      <motion.div
        ref={dockRef}
        className="ck-dock"
        style={{ x, y }}
        drag
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        onDragStart={() => {
          stopSettling()
          draggingRef.current = true
          draggedRef.current = true
          dragStart.current = { x: x.get(), y: y.get() }
          setDragging(true)
        }}
        onDrag={(_event, info) => {
          if (!size) return
          const free = {
            x: dragStart.current.x + info.offset.x,
            y: dragStart.current.y + info.offset.y,
          }
          const nearest = nearestAnchor(free, size)
          const target = anchorOrigin(nearest, size)
          const distance = Math.hypot(free.x - target.x, free.y - target.y)
          setHintAnchor(nearest)
          if (distance <= MAGNET_INNER) {
            x.set(target.x)
            y.set(target.y)
          } else if (distance < MAGNET_OUTER) {
            const t = 1 - (distance - MAGNET_INNER) / (MAGNET_OUTER - MAGNET_INNER)
            const pull = t * t * (3 - 2 * t) // smoothstep — eases the suck-in
            x.set(free.x + (target.x - free.x) * pull)
            y.set(free.y + (target.y - free.y) * pull)
          } else {
            x.set(free.x)
            y.set(free.y)
          }
        }}
        onDragEnd={() => {
          draggingRef.current = false
          setDragging(false)
          if (size) critStore.setAnchor(nearestAnchor({ x: x.get(), y: y.get() }, size))
        }}
      >
        <AnimatePresence mode="wait">
          {expanded ? (
            <Panel
              key="ck-panel"
              crits={crits}
              reduce={reduce}
              collapsible={!critMode}
              copiedCount={copiedCount}
              onCopy={copyPrompt}
              onGrab={startDrag}
              onMinimize={minimize}
            />
          ) : (
            <Badge
              key="ck-badge"
              count={crits.length}
              reduce={reduce}
              onGrab={startDrag}
              onOpen={openPanel}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

/** Ghost footprints — a dotted square the size of the dock at each anchor. */
function SnapHints({ size, active }: { size: DockSize; active: DockAnchor }) {
  return (
    <>
      {DOCK_ANCHORS.map((dockAnchor) => {
        const origin = anchorOrigin(dockAnchor, size)
        const on = dockAnchor.h === active.h && dockAnchor.v === active.v
        return (
          <motion.div
            key={`${dockAnchor.h}-${dockAnchor.v}`}
            className={`ck-snap${on ? " ck-snap-on" : ""}`}
            style={{ left: origin.x, top: origin.y, width: size.w, height: size.h }}
            initial={{ opacity: 0 }}
            animate={{ opacity: on ? 1 : 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        )
      })}
    </>
  )
}

function Badge({
  count,
  reduce,
  onGrab,
  onOpen,
}: {
  count: number
  reduce: boolean
  onGrab: StartDrag
  onOpen: () => void
}) {
  return (
    <motion.button
      className="ck-badge"
      onPointerDown={onGrab}
      onClick={onOpen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.12 }}
    >
      {count > 0 ? (
        <motion.span
          key={count}
          className="ck-count ck-mono"
          initial={reduce ? false : { scale: 1.18 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 30 }}
        >
          {count}
        </motion.span>
      ) : null}
      <span>{critsLabel(count)}</span>
    </motion.button>
  )
}

function Panel({
  crits,
  reduce,
  collapsible,
  copiedCount,
  onCopy,
  onGrab,
  onMinimize,
}: {
  crits: Crit[]
  reduce: boolean
  collapsible: boolean
  copiedCount: number | null
  onCopy: () => void
  onGrab: StartDrag
  onMinimize: () => void
}) {
  return (
    <motion.div
      className="ck-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.12 }}
    >
      <div className="ck-panel-head" onPointerDown={onGrab} onClick={onMinimize}>
        <span className="ck-panel-heading">
          {crits.length > 0 ? (
            <motion.span
              key={crits.length}
              className="ck-count ck-mono"
              initial={reduce ? false : { scale: 1.18 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 30 }}
            >
              {crits.length}
            </motion.span>
          ) : null}
          <span className="ck-panel-title">{critsLabel(crits.length)}</span>
        </span>
        <span className="ck-panel-actions">
          {crits.length > 0 ? (
            <button
              className="ck-clear"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation()
                critStore.clearCrits()
              }}
            >
              Clear All
            </button>
          ) : null}
          {collapsible ? (
            <button
              className="ck-icon-btn"
              aria-label="Collapse"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation()
                critStore.setPanelOpen(false)
              }}
            >
              ✕
            </button>
          ) : null}
        </span>
      </div>

      <div className="ck-panel-list">
        {crits.length === 0 ? (
          <div className="ck-empty">
            No crits yet — click any element on the page to crit it.
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {crits.map((crit, index) => (
              <Row key={crit.id} crit={crit} index={index} reduce={reduce} />
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="ck-panel-foot">
        <button
          className={`ck-btn${copiedCount !== null ? " ck-btn-copied" : ""}`}
          disabled={crits.length === 0}
          onClick={onCopy}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copiedCount !== null ? `copied-${crits.length}` : "idle"}
              className="ck-btn-face"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.14 }}
            >
              {copiedCount !== null ? (
                `✓ ${copyLabel(copiedCount, "Copied")}`
              ) : (
                <>
                  {copyLabel(crits.length, "Copy")}
                  <span className="ck-kbd-group">
                    {COPY_KEYS.map((key) => (
                      <kbd key={key} className="ck-kbd">
                        {key}
                      </kbd>
                    ))}
                  </span>
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  )
}

function Row({
  crit,
  index,
  reduce,
}: {
  crit: Crit
  index: number
  reduce: boolean
}) {
  // Per-row copy flashes the icon to a ✓ briefly, then reverts. Unlike the
  // footer button, copying a single crit doesn't end the session.
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef(0)
  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const copyCrit = (): void => {
    void copyText(buildPrompt([crit])).then((ok) => {
      if (!ok) return
      setCopied(true)
      window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <motion.div
      className="ck-row"
      layout={!reduce}
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, x: 12, height: 0 }}
      transition={
        reduce
          ? { duration: 0.12 }
          : {
              type: "spring",
              stiffness: 480,
              damping: 34,
              delay: Math.min(index * 0.04, 0.16),
            }
      }
    >
      {/* Context leads — the source location is the crit's anchor — and the
          editable comment sits under it. */}
      <div className="ck-row-top">
        <span className="ck-row-src ck-mono">{shortLocation(crit)}</span>
        <button
          className={`ck-icon-btn ck-copy-btn${copied ? " ck-copied" : ""}`}
          aria-label={copied ? "Copied" : "Copy crit as a prompt"}
          onClick={copyCrit}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
        <button
          className="ck-icon-btn ck-del"
          aria-label="Delete crit"
          onClick={() => critStore.removeCrit(crit.id)}
        >
          <TrashIcon />
        </button>
      </div>

      <input
        className="ck-row-note"
        placeholder="add a note…"
        value={crit.note}
        onChange={(event) => critStore.updateNote(crit.id, event.target.value)}
        onKeyDown={(event) => event.stopPropagation()}
      />
    </motion.div>
  )
}
