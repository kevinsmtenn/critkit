import { Reveal } from "@/components/reveal"
import { Kbd } from "@/components/kbd"
import { CopyButton } from "@/components/copy-button"
import { StartCritButton } from "@/components/start-crit-button"
import { CritPanelMock } from "@/components/crit-panel-mock"

const INSTALL = "npm i -D critkit react-grab"

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
          {/* — copy — */}
          <div>
            <Reveal>
              <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                <span className="size-1.5 bg-destructive" />
                Open source · a react-grab plugin
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-6 font-mono text-4xl leading-[1.07] font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]">
                <span className="block text-muted-foreground">
                  Walk your build.
                </span>
                <span className="block text-foreground">
                  Crit what&apos;s wrong.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl font-sans text-[15px] leading-relaxed text-muted-foreground">
                CritKit is{" "}
                <span className="font-serif text-base text-foreground italic">
                  the human QA step in the agent loop
                </span>
                . Open your running app, walk it, and crit every flaw — spacing,
                a color, a label, an alignment. CritKit hands your coding agent a
                source-anchored to-do list it works top to bottom.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-7 inline-flex items-center gap-2.5 border border-border bg-card px-3 py-2 font-mono text-xs">
                <span className="flex items-center gap-1.5 text-[oklch(0.72_0.16_150)]">
                  <span className="size-1.5 animate-pulse bg-current" />
                  live
                </span>
                <span aria-hidden className="h-3 w-px bg-border" />
                <span className="text-muted-foreground">
                  Running on this page — press <Kbd>C</Kbd> to crit anything.
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <StartCritButton />
                <div className="flex items-center gap-2.5 border border-border bg-card px-3 py-2.5 font-mono text-xs">
                  <span className="select-none text-muted-foreground">$</span>
                  <code className="text-foreground">{INSTALL}</code>
                  <span aria-hidden className="h-3.5 w-px bg-border" />
                  <CopyButton value={INSTALL} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="mt-8 font-mono text-xs tracking-wide text-muted-foreground">
                Agent builds{" "}
                <span className="text-foreground">&rarr;</span> you crit{" "}
                <span className="text-foreground">&rarr;</span> agent fixes.
              </p>
            </Reveal>
          </div>

          {/* — the artifact — */}
          <Reveal delay={0.16} className="flex justify-center lg:justify-end">
            <CritPanelMock />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
