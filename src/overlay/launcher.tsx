import { motion, useReducedMotion } from "motion/react"
import { critStore } from "../store"

/**
 * CritKit's always-present launcher — toggles crit mode (the hover-to-pick
 * state). It's the one bit of CritKit chrome that's always on screen, and the
 * entry point into a crit session.
 *
 * Docked at 6 o'clock (bottom-centre). The slot wrapper handles the centring
 * so the button is free to animate its own transform.
 */
export function Launcher({ critMode }: { critMode: boolean }) {
  const reduce = !!useReducedMotion()
  return (
    <div className="ck-launcher-slot">
      <motion.button
        type="button"
        className={`ck-launcher${critMode ? " ck-launcher-on" : ""}`}
        onClick={() => critStore.toggleCritMode()}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <span className="ck-launcher-dot" />
        {critMode ? (
          <span>Critting · esc</span>
        ) : (
          <>
            <span>Crit</span>
            <kbd className="ck-kbd">C</kbd>
          </>
        )}
      </motion.button>
    </div>
  )
}
