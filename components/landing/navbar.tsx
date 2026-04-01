'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Mail } from 'lucide-react'

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <Mail className="h-4 w-4" />
          </div>
          <span className="text-lg font-black tracking-tight text-foreground">Quail</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="#product" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Product
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            How it works
          </Link>
          <Link href="#teams" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Teams
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/dashboard">
            <Button variant="ghost" className="rounded-full text-foreground hover:bg-muted/40">
              Sign in
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="rounded-full px-6">Get Started!</Button>
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-foreground md:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/80 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6">
            <Link href="#product" className="text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Product
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              How it works
            </Link>
            <Link href="#teams" className="text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Teams
            </Link>
            <div className="flex gap-3 pt-2">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full rounded-full border-border/80 bg-card/40">
                  Sign in
                </Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full rounded-full">Launch Quail</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}