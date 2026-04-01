

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTABand() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-border/70 bg-card p-8 shadow-xl shadow-black/5 sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary))_0%,transparent_25%),radial-gradient(circle_at_bottom_right,hsl(var(--accent))_0%,transparent_20%)] opacity-10" />
          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              Demo-ready and portfolio-friendly
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to make email feel lighter?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Open the Quail demo and show how AI can turn messy communication into faster decisions and clearer workflow.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 rounded-full px-8 text-base">
                  Launch Quail
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="h-12 rounded-full px-8 text-base">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}