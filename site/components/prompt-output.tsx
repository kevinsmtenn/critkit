import { Section, SectionHeader } from "@/components/section"
import { Reveal } from "@/components/reveal"
import { PromptPaste } from "@/components/prompt-paste"

export function PromptOutput() {
  return (
    <Section id="output" className="py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
        <Reveal whileInView>
          <SectionHeader
            index="03"
            label="The output"
            title="What you paste."
            description="Paste a copied crit prompt into the field to see exactly what your agent receives: every item source-anchored, with values harvested live from the DOM."
          />
        </Reveal>

        <Reveal whileInView delay={0.1}>
          <PromptPaste />
        </Reveal>
      </div>
    </Section>
  )
}
