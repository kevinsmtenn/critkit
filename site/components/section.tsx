import { cn } from "@/lib/utils"

/** A full-bleed section with a hairline top rule and the shared content column. */
export function Section({
  id,
  className,
  innerClassName,
  children,
}: {
  id?: string
  className?: string
  innerClassName?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-14 border-t border-border", className)}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1120px] px-6 md:px-8",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}

/** Indexed eyebrow + heading, the technical header used atop each section. */
export function SectionHeader({
  index,
  label,
  title,
  description,
  className,
}: {
  index: string
  label: string
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
        <span className="border border-border px-1.5 py-0.5 text-foreground">
          {index}
        </span>
        <span>{label}</span>
        <span aria-hidden className="h-px flex-1 bg-border" />
      </div>
      <h2 className="mt-6 font-heading text-2xl leading-tight font-medium tracking-tight text-balance md:text-[2rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}
