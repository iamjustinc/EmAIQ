
import Link from 'next/link'
import { Mail } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Mail className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Quail</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">
              An intelligent email decision layer for people who need clarity, not just another inbox.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="#product">Features</Link></li>
              <li><Link href="#how-it-works">How it works</Link></li>
              <li><Link href="/dashboard">Demo</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="/dashboard">Sign in</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="#teams">Teams</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="#">Privacy</Link></li>
              <li><Link href="#">Terms</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Quail. All rights reserved.
        </div>
      </div>
    </footer>
  )
}