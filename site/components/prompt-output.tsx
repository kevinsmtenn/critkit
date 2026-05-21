import { Section, SectionHeader } from "@/components/section"
import { Reveal } from "@/components/reveal"
import { PromptPaste } from "@/components/prompt-paste"

export function PromptOutput() {
  return (
    <Section id="output" className="py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
        <Reveal whileInView>
          <div>
            <SectionHeader
              index="03"
              label="The output"
              title="What you paste."
              description="Run the live demo above — press C, crit a few elements, Copy Crit Prompt. Paste it into the field to see exactly what your agent receives: every item source-anchored, with values harvested live from the DOM."
            />
            <p className="mt-8 border-l-2 border-border pl-4 font-sans text-[13px] leading-relaxed text-muted-foreground">
              Dogfooded against a real coding agent: it executed each crit from
              the source location, the harvested context, and a one-line note —
              nothing else.
            </p>
          </div>
        </Reveal>

        <Reveal whileInView delay={0.1}>
          <PromptPaste />
        </Reveal>
      </div>
    </Section>
  )
}
