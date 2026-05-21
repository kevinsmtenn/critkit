import {
  ClipboardCheck,
  Crosshair,
  MousePointerClick,
  PenLine,
} from "lucide-react"

import { Section, SectionHeader } from "@/components/section"
import { Reveal } from "@/components/reveal"

const STEPS = [
  {
    n: "01",
    icon: Crosshair,
    title: "Press C",
    body: "Hit C and crit mode arms — the page takes a crosshair, every element lights up on hover. Esc exits. C is plain; react-grab keeps ⌘C for itself.",
  },
  {
    n: "02",
    icon: MousePointerClick,
    title: "Click a flaw",
    body: "Click the element that's off. CritKit resolves it back to its source — file, line, component — through react-grab, used purely headlessly.",
  },
  {
    n: "03",
    icon: PenLine,
    title: "Drop a note",
    body: "Type what's wrong, hit ⏎. CritKit harvests the computed context — padding, color, text, box — straight from the live DOM, so you barely type.",
  },
  {
    n: "04",
    icon: ClipboardCheck,
    title: "Copy the prompt",
    body: "Open the list, hit Copy Crit Prompt. Paste the source-anchored checklist to your agent — it works the pass top to bottom, no clarifying.",
  },
]

export function CritPass() {
  return (
    <Section id="crit-pass" className="py-20 md:py-28">
      <Reveal whileInView>
        <SectionHeader
          index="01"
          label="The crit pass"
          title="Four keystrokes from flaw to fix."
          description="No mode you get trapped in, no prose to write from scratch. A single crit takes two to four seconds — a full-page pass, a couple of minutes."
        />
      </Reveal>

      <Reveal whileInView delay={0.1}>
        <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="flex min-h-[208px] flex-col gap-5 bg-background p-6"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-2xl font-semibold text-muted-foreground/35">
                  {step.n}
                </span>
                <step.icon
                  className="size-4 text-muted-foreground"
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <h3 className="font-heading text-sm font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2.5 font-sans text-[13px] leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
