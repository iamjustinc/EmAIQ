import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTABand() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#C9B6E4]/28 bg-gradient-to-br from-[#F9FBFD] via-white to-[#F8F5FF] p-8 shadow-sm sm:p-12">
          <div className="absolute left-[-6rem] top-[-4rem] h-56 w-56 rounded-full bg-[#7FC6DA]/30 blur-3xl" />
          <div className="absolute right-[12%] top-[18%] h-40 w-40 rounded-full bg-[#F7C7D4]/25 blur-3xl" />
          <div className="absolute bottom-[-5rem] right-[-5rem] h-64 w-64 rounded-full bg-[#C9B6E4]/28 blur-3xl" />

          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7FC6DA]/30 bg-white/70 px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-[#5AAFC7]" />
              Demo-ready and portfolio-friendly
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to make email feel lighter?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Open the Quail demo and show how AI can turn messy communication into faster decisions and clearer workflow.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-[#7FC6DA] px-8 text-base text-white hover:opacity-90"
                >
                  Launch Quail
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-[#C9B6E4]/35 bg-white/75 px-8 text-base hover:bg-[#F8F5FF]"
                >
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