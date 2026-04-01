
import { Inbox, BrainCircuit, MousePointerClick } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Inbox,
    title: 'Bring in the inbox',
    description:
      'Start with a live or demo inbox view so Quail can read message content, metadata, and communication patterns.',
  },
  {
    number: '02',
    icon: BrainCircuit,
    title: 'Let Quail structure the chaos',
    description:
      'The system classifies urgency, summarizes context, groups categories, and proposes next actions in plain language.',
  },
  {
    number: '03',
    icon: MousePointerClick,
    title: 'Act with confidence',
    description:
      'Move through your day faster with clearer priorities, lower noise, and better communication visibility.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/20 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">From crowded inbox to clear workflow</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Quail is not another inbox. It is a decision-support layer built to help you move faster.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">
                {index < steps.length - 1 && (
                  <div className="absolute top-14 left-full hidden h-px w-8 bg-border lg:block" />
                )}
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{step.number}</span>
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}