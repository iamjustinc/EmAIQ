import { CheckCircle2, Users2 } from 'lucide-react'

const useCases = [
  'Client-facing teams can spot true urgencies faster',
  'Product and ops leads can reduce low-value inbox churn',
  'Recruiters can separate time-sensitive follow-ups from noise',
  'Founders can keep visibility without drowning in updates',
  'Teams can understand where communication time is actually going',
]

export function TeamSection() {
  return (
    <section id="teams" className="py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9B6E4]/30 bg-[#C9B6E4]/12 px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <Users2 className="h-4 w-4 text-[#8C75D6]" />
            For modern teams
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for people who cannot afford to miss what matters
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Quail makes email operationally legible. Instead of asking people to manually process chaos, it gives them structure, visibility, and stronger next-step judgment.
          </p>

          <ul className="mt-8 space-y-4">
            {useCases.map((item, index) => {
              const iconColors = [
                'text-[#5AAFC7]',
                'text-[#E68AA7]',
                'text-[#8C75D6]',
                'text-[#5AAFC7]',
                'text-[#E68AA7]',
              ]
              return (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors[index]}`} />
                  <span className="text-sm leading-7 text-muted-foreground">{item}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="rounded-[28px] border border-[#C9B6E4]/28 bg-gradient-to-br from-white via-[#F9FBFD] to-[#F8F5FF] p-6 shadow-xl shadow-[#C9B6E4]/10">
          <div className="rounded-3xl border border-border/60 bg-background/85 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Communication load</p>
                <p className="text-sm text-muted-foreground">This week</p>
              </div>
              <span className="rounded-full bg-[#7FC6DA]/15 px-3 py-1 text-xs font-medium text-[#4E9CB3]">
                18% reduced noise
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Client communication</span>
                  <span className="font-medium">42%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#7FC6DA]/12">
                  <div className="h-full w-[42%] rounded-full bg-[#7FC6DA]" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Internal status</span>
                  <span className="font-medium">31%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#F7C7D4]/12">
                  <div className="h-full w-[31%] rounded-full bg-[#F49BB6]" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Scheduling and logistics</span>
                  <span className="font-medium">19%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#C9B6E4]/12">
                  <div className="h-full w-[19%] rounded-full bg-[#9C8AE6]" />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#F7C7D4]/25 bg-gradient-to-r from-[#F7C7D4]/12 to-[#C9B6E4]/12 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recommendation</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                Internal status emails are driving repeat context switching. Quail recommends bundling those into one digest or recurring sync.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}