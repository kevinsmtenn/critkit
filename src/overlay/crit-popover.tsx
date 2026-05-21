import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { critStore } from "../store"
import type { CapturedRect, PendingCapture } from "../types"

const WIDTH = 300
const GAP = 10
const EST_HEIGHT = 128

interface Placement {
  left: number
  top?: number
  bottom?: number
  below: boolean
}

function place(rect: CapturedRect): Placement {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const left = Math.min(Math.max(8, rect.left), vw - WIDTH - 8)
  const roomBelow = vh - rect.bottom - GAP
  if (roomBelow >= EST_HEIGHT || roomBelow >= rect.top) {
    return { left, top: Math.min(rect.bottom + GAP, vh - EST_HEIGHT - 8), below: true }
  }
  return { left, bottom: vh - rect.top + GAP, below: false }
}

function rectOf(element: Element): CapturedRect {
  const r = element.getBoundingClientRect()
  return {
    top: r.top,
    left: r.left,
    right: r.right,
    bottom: r.bottom,
    width: r.width,
    height: r.height,
  }
}

/** The anchored capture popover — shown while a selection awaits a note. */
export function CritPopover({ pending }: { pending: PendingCapture | null }) {
  return (
    <>
      {/* Backdrop sits outside AnimatePresence so it clears instantly on
          commit — it must never linger over the page during the exit. */}
      {pending ? (
        <div className="ck-backdrop" onClick={() => critStore.cancelCapture()} />
      ) : null}
      <AnimatePresence>
        {pending ? <Popover key="ck-popover" pending={pending} /> : null}
      </AnimatePresence>
    </>
  )
}

function Popover({ pending }: { pending: PendingCapture }) {
  const reduce = useReducedMotion()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [note, setNote] = useState("")

  // Measured at render: react-grab has already unfrozen the page by the time
  // the popover mounts, so the element's live rect is current. Falls back to
  // the rect captured at selection time if the element has since detached.
  const placement = useMemo<Placement>(() => {
    const rect = pending.element.isConnected
      ? rectOf(pending.element)
      : pending.rect
    return place(rect)
  }, [pending])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // The picker resumes on its own once the capture clears (see syncPicker).
  const commit = (): void => critStore.commitCrit(note)
  const cancel = (): void => critStore.cancelCapture()

  const style: CSSProperties = {
    left: placement.left,
    ...(placement.top != null ? { top: placement.top } : { bottom: placement.bottom }),
  }

  return (
    <motion.div
      className="ck-pop"
      style={style}
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.95, y: placement.below ? -6 : 6 }
      }
      animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
      exit={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.97, y: placement.below ? -4 : 4 }
      }
      transition={
        reduce ? { duration: 0.12 } : { type: "spring", stiffness: 520, damping: 32 }
      }
    >
      <div className="ck-pop-body">
        <textarea
          ref={inputRef}
          className="ck-input"
          rows={3}
          placeholder="Consider…"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          onKeyDown={(event) => {
            event.stopPropagation()
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              commit()
            } else if (event.key === "Escape") {
              event.preventDefault()
              cancel()
            }
          }}
        />
      </div>

      <div className="ck-pop-foot">
        <button type="button" className="ck-foot-cancel" onClick={cancel}>
          <kbd className="ck-kbd">esc</kbd>
          cancel
        </button>
        <button type="button" className="ck-foot-add" onClick={commit}>
          add crit
          <kbd className="ck-kbd ck-kbd-invert">⏎</kbd>
        </button>
      </div>
    </motion.div>
  )
}
