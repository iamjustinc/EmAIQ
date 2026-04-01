
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
    },
    {
      icon: Sparkles,
      title: '3-bullet summaries',
      description:
        'Open an email and instantly understand the ask, the context, and the next move.',
      className: '',
    },
    {
      icon: ChevronRightSquare,
      title: 'Suggested next steps',
      description:
        'Reply, schedule, delegate, snooze, or archive without having to think from scratch.',
      className: '',
    },
    {
      icon: Archive,
      title: 'Batch noise cleanup',
      description:
        'Clear low-value updates in one sweep and keep your attention for actual work.',
      className: '',
    },
    {
      icon: BarChart3,
      title: 'Inbox analytics',
      description:
        'See where your communication time goes and which topics keep eating your week.',
      className: '',
    },
    {
      icon: Users,
      title: 'Team-ready workflows',
      description:
        'Designed for PMs, operators, founders, recruiters, and anyone triaging lots of conversations.',
      className: '',
    },
  ]
  
  export function FeaturesBento() {
    return (
      <section id="product" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
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
                  className={`rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${feature.className}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
                  {feature.title === 'Urgency scoring' && (
                    <div className="mt-6 rounded-2xl border border-border/60 bg-background/80 p-4">
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