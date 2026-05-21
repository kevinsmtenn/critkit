"use client"

import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  /**
   * When true, animation triggers when the element scrolls into view.
   * When false (default), animates on mount. Use for above-the-fold content
   * to avoid a hidden→visible flicker after hydration.
   */
  whileInView?: boolean
}

export function Reveal({
  children,
  className,
  delay = 0,
  whileInView = false,
}: RevealProps) {
  const reduce = useReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const shouldAnimate = whileInView ? inView : true

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
