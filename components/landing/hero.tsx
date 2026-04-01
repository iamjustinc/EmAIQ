import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Inbox, Clock3, BarChart3 } from 'lucide-react'
import { QuailEgg } from '@/components/landing/quail-egg'

const inboxRows = [
  {
    sender: 'Salesforce Recruiting',
    subject: 'Interview availability for next week',
    priority: 'Immediate',
    action: 'Reply today',
    tint: 'bg-[#7FC6DA]/18 border-[#7FC6DA]/35',
  },
  {
    sender: 'Design Team',
    subject: 'Homepage copy review',
    priority: 'Today',
    action: 'Approve edits',
    tint: 'bg-[#F7C7D4]/18 border-[#F7C7D4]/35',
  },
  {
    sender: 'Calendar',
    subject: 'Weekly internal sync notes',
    priority: 'Low',
    action: 'Archive as noise',
    tint: 'bg-[#C9B6E4]/18 border-[#C9B6E4]/35',
  },
]

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F9FBFD] via-background to-[#F8F5FF]" />
      <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-[#7FC6DA]/30 blur-3xl" />
      <div className="absolute right-[8%] top-[18%] h-64 w-64 rounded-full bg-[#F7C7D4]/30 blur-3xl" />
      <div className="absolute bottom-[-8rem] right-[-6rem] h-80 w-80 rounded-full bg-[#C9B6E4]/28 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7FC6DA]/30 bg-white/70 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-[#7FC6DA]" />
            AI email triage for high-volume inboxes
          </div>

          <div className="mt-6 flex items-start gap-4">
  <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
    Turn inbox overload into{' '}
    <span className="bg-gradient-to-r from-[#7FC6DA] via-[#9C8AE6] to-[#F49BB6] bg-clip-text text-transparent">
      clear next actions
    </span>
  </h1>

  <div className="mt-2 hidden shrink-0 lg:block">
    <QuailEgg />
  </div>
</div>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Quail sits on top of your inbox and helps you decide what matters, what can wait, and what can disappear.
            Prioritize faster, reduce noise, and move through email with less friction.
          </p>

          <div className="cta-hover mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-12 rounded-full bg-[#7FC6DA] px-8 text-base text-white hover:opacity-90"
              >
                Get started!
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#product">
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-[#C9B6E4]/40 bg-white/70 px-8 text-base hover:bg-[#F8F5FF]"
              >
                See how it works
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-[#7FC6DA]/35 bg-[#7FC6DA]/12 p-4 shadow-sm backdrop-blur-sm">
              <Inbox className="h-5 w-5 text-[#5AAFC7]" />
              <p className="mt-3 text-2xl font-black">127</p>
              <p className="text-sm text-muted-foreground">emails processed</p>
            </div>
            <div className="rounded-3xl border border-[#F7C7D4]/35 bg-[#F7C7D4]/14 p-4 shadow-sm backdrop-blur-sm">
              <Clock3 className="h-5 w-5 text-[#E68AA7]" />
              <p className="mt-3 text-2xl font-black">40%</p>
              <p className="text-sm text-muted-foreground">noise reduced</p>
            </div>
            <div className="rounded-3xl border border-[#C9B6E4]/35 bg-[#C9B6E4]/14 p-4 shadow-sm backdrop-blur-sm">
              <BarChart3 className="h-5 w-5 text-[#8C75D6]" />
              <p className="mt-3 text-2xl font-black">3.8h</p>
              <p className="text-sm text-muted-foreground">time surfaced</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-[#C9B6E4]/30 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <div className="rounded-[1.75rem] border border-border/80 bg-background/90 p-5">
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Inbox Health</p>
                  <p className="text-sm text-muted-foreground">Tuesday morning snapshot</p>
                </div>
                <span className="rounded-full bg-[#7FC6DA]/15 px-3 py-1 text-xs font-bold text-[#4E9CB3]">
                  7 high priority
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {inboxRows.map((row) => (
                  <div key={row.subject} className={`rounded-2xl border p-4 ${row.tint}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{row.sender}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{row.subject}</p>
                      </div>
                      <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-foreground">
                        {row.priority}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">AI suggestion</p>
                      <p className="text-sm font-semibold text-[#5AAFC7]">{row.action}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-[#C9B6E4]/30 bg-gradient-to-r from-[#F7C7D4]/14 to-[#C9B6E4]/14 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Insight engine</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  You spent the most time on internal status emails this week. Quail recommends bundling them into one scheduled review block.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}