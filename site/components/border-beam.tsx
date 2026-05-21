type BorderBeamProps = {
  durationSeconds?: number
  /** CSS color for the comet head + tail. Defaults to the foreground token. */
  color?: string
  /** Length of the streak in pixels. Tune down on small elements. */
  lengthPx?: number
  /** Thickness of the streak in pixels. Bump up on small elements for visibility. */
  thicknessPx?: number
  /** Glow radius in pixels around the head. */
  glowPx?: number
  className?: string
}

export function BorderBeam({
  durationSeconds = 12,
  color,
  lengthPx,
  thicknessPx,
  glowPx,
  className,
}: BorderBeamProps) {
  const style: React.CSSProperties = {
    "--beam-duration": `${durationSeconds}s`,
  } as React.CSSProperties
  if (color) (style as Record<string, string>)["--beam-color"] = color
  if (lengthPx)
    (style as Record<string, string>)["--beam-length"] = `${lengthPx}px`
  if (thicknessPx)
    (style as Record<string, string>)["--beam-thickness"] = `${thicknessPx}px`
  if (glowPx) (style as Record<string, string>)["--beam-glow"] = `${glowPx}px`

  return (
    <div
      aria-hidden="true"
      className={`border-beam pointer-events-none absolute inset-0 ${className ?? ""}`}
      style={style}
    />
  )
}
