import {
  Sparkles,
  ShieldAlert,
  Archive,
  BarChart3,
  ChevronRightSquare,
  Users,
} from 'lucide-react'

const features = [
  {
    icon: ShieldAlert,
    title: 'Urgency scoring',
    description:
      'Quail analyzes every message and surfaces what needs attention now, today, or later this week.',
    className: 'md:col-span-2 lg:row-span-2',
    tint: 'from-[#7FC6DA]/18 to-[#C9B6E4]/18 border-[#7FC6DA]/30',
    iconTint: 'bg-[#7FC6DA]/18 text-[#5AAFC7]',
  },
  {
    icon: Sparkles,
    title: '3-bullet summaries',
    description:
      'Open an email and instantly understand the ask, the context, and the next move.',
    className: '',
    tint: 'from-[#F7C7D4]/18 to-white border-[#F7C7D4]/30',
    iconTint: 'bg-[#F7C7D4]/18 text-[#E68AA7]',
  },
  {
    icon: ChevronRightSquare,
    title: 'Suggested next steps',
    description:
      'Reply, schedule, delegate, snooze, or archive without having to think from scratch.',
    className: '',
    tint: 'from-[#C9B6E4]/18 to-white border-[#C9B6E4]/30',
    iconTint: 'bg-[#C9B6E4]/18 text-[#8C75D6]',
  },
  {
    icon: Archive,
    title: 'Batch noise cleanup',
    description:
      'Clear low-value updates in one sweep and keep your attention for actual work.',
    className: '',
    tint: 'from-[#7FC6DA]/14 to-white border-[#7FC6DA]/28',
    iconTint: 'bg-[#7FC6DA]/16 text-[#5AAFC7]',
  },
  {
    icon: BarChart3,
    title: 'Inbox analytics',
    description:
      'See where your communication time goes and which topics keep eating your week.',
    className: '',
    tint: 'from-[#F7C7D4]/14 to-[#C9B6E4]/12 border-[#F7C7D4]/28',
    iconTint: 'bg-[#F7C7D4]/16 text-[#E68AA7]',
  },
  {
    icon: Users,
    title: 'Team-ready workflows',
    description:
      'Designed for PMs, operators, founders, recruiters, and anyone triaging lots of conversations.',
    className: '',
    tint: 'from-[#C9B6E4]/16 to-[#7FC6DA]/10 border-[#C9B6E4]/28',
    iconTint: 'bg-[#C9B6E4]/16 text-[#8C75D6]',
  },
]

export function FeaturesBento() {
  return (
    <section id="product" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F7C7D4]/30 bg-[#F7C7D4]/10 px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <Sparkles className="h-4 w-4 text-[#E68AA7]" />
            Product features
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to triage with less friction
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Quail helps you move from overwhelmed to decisive by turning raw email into structured action.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={`rounded-3xl border bg-gradient-to-br p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${feature.className} ${feature.tint}`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconTint}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>

                {feature.title === 'Urgency scoring' && (
                  <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur-sm">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Immediate</span>
                        <span className="font-medium">9 emails</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Today</span>
                        <span className="font-medium">14 emails</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">This week</span>
                        <span className="font-medium">23 emails</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}