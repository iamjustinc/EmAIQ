
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Inbox, Clock3, BarChart3 } from 'lucide-react'

const inboxRows = [
  {
    sender: 'Salesforce Recruiting',
    subject: 'Interview availability for next week',
    priority: 'Immediate',
    action: 'Reply today',
  },
  {
    sender: 'Design Team',
    subject: 'Homepage copy review',
    priority: 'Today',
    action: 'Approve edits',
  },
  {
    sender: 'Calendar',
    subject: 'Weekly internal sync notes',
    priority: 'Low',
    action: 'Archive as noise',
  },
]

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary))_0%,transparent_30%),radial-gradient(circle_at_bottom_right,hsl(var(--accent))_0%,transparent_25%)] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            AI email triage for high-volume inboxes
          </div>

          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Turn inbox overload into{' '}
            <span className="text-primary">clear next actions</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Quail sits on top of your inbox and helps you decide what matters, what can wait, and what can disappear.
            Prioritize faster, reduce noise, and move through email like an operator.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 rounded-full px-8 text-base">
                Open Quail demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#product">
              <Button size="lg" variant="outline" className="h-12 rounded-full px-8 text-base">
                See how it works
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
              <Inbox className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-semibold">127</p>
              <p className="text-sm text-muted-foreground">emails processed</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
              <Clock3 className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-semibold">40%</p>
              <p className="text-sm text-muted-foreground">noise reduced</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
              <BarChart3 className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-semibold">3.8h</p>
              <p className="text-sm text-muted-foreground">time surfaced</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[28px] border border-border/70 bg-card/80 p-5 shadow-2xl shadow-black/5 backdrop-blur">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <p className="text-sm font-medium">Inbox Health</p>
                <p className="text-sm text-muted-foreground">Tuesday morning snapshot</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                7 high priority
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {inboxRows.map((row) => (
                <div key={row.subject} className="rounded-2xl border border-border/60 bg-background/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{row.sender}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{row.subject}</p>
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground">
                      {row.priority}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">AI suggestion</p>
                    <p className="text-sm font-medium text-primary">{row.action}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-border/60 bg-muted/40 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Insight engine</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                You spent the most time on internal status emails this week. Quail recommends bundling them into one scheduled review block.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
