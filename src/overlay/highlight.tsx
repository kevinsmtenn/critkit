import { motion } from "motion/react"
import { highlight } from "../picker"

/**
 * The crit-mode selection highlight — a sharp box that tracks the element
 * under the cursor. Driven entirely by motion values (see {@link highlight}),
 * so cursor tracking never triggers a React render.
 */
export function Highlight() {
  return (
    <motion.div
      className="ck-highlight"
      style={{
        x: highlight.x,
        y: highlight.y,
        width: highlight.width,
        height: highlight.height,
        opacity: highlight.opacity,
      }}
    />
  )
}
