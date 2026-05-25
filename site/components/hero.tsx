import { Reveal } from "@/components/reveal"
import { CopyButton } from "@/components/copy-button"
import { StartCritButton } from "@/components/start-crit-button"
import { CopyCritPromptButton } from "@/components/copy-crit-prompt"
import { LiveCritCount } from "@/components/live-crit-count"
import { Kbd } from "@/components/kbd"

const INSTALL = "npm i -D critkit"

const STEPS: React.ReactNode[] = [
  <>
    Press <Kbd>C</Kbd>. Crit mode arms across the whole page.
  </>,
  <>Hover the panel; elements highlight. Click one that&apos;s off.</>,
  <>
    Type a note, hit <Kbd>⏎</Kbd>. CritKit harvests the DOM context for you.
  </>,
  <>The crit list docks to your screen edge. Open it, copy the crit prompt.</>,
]

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* faint blueprint grid, faded toward the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />

      <div className="mx-auto w-full max-w-[1120px] px-6 pt-32 pb-20 md:px-8 md:pt-40 md:pb-28">
        <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                <span className="size-1.5 bg-destructive" />
                Open source · MIT licensed
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-6 font-mono text-4xl leading-[1.07] font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]">
                <span className="block text-foreground">Design crit</span>
                <span className="block text-muted-foreground">
                  with your coding agents
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl font-sans text-[15px] leading-relaxed text-muted-foreground">
                CritKit is{" "}
                <span className="text-foreground">
                  the design QA step in the agentic coding loop
                </span>
                . Walk your running app, crit every flaw, and hand your
                coding agent a source-anchored to-do list it works top to
                bottom.
              </p>
            </Reveal>

            {/* CTA — start a crit session; the C shortcut sits inside the button */}
            <Reveal delay={0.18}>
              <div className="mt-8">
                <StartCritButton />
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-4 flex w-fit items-center gap-2.5 border border-border bg-card px-3 py-2.5 font-mono text-xs">
                <span aria-hidden className="select-none text-muted-foreground">
                  $
                </span>
                <code className="text-foreground">{INSTALL}</code>
                <span aria-hidden className="h-3.5 w-px bg-border" />
                <CopyButton value={INSTALL} />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.16} className="w-full">
            <div className="flex h-full flex-col gap-7 border border-border bg-card p-6 md:p-7">
              <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                <span className="size-1.5 bg-foreground" />
                Try it on this page
              </div>

              <ol className="flex flex-col gap-4">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-px font-mono text-[11px] text-muted-foreground/45">
                      0{i + 1}
                    </span>
                    <span className="font-sans text-[13px] leading-relaxed text-muted-foreground">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-auto flex flex-col gap-3">
                <LiveCritCount />
                <CopyCritPromptButton size="default" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
