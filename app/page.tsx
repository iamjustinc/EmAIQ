import { LandingNavbar } from '@/components/landing/navbar'
import { LandingHero } from '@/components/landing/hero'
import { TrustStrip } from '@/components/landing/trust-strip'
import { FeaturesBento } from '@/components/landing/features-bento'
import { HowItWorks } from '@/components/landing/how-it-works'
import { TeamSection } from '@/components/landing/team-section'
import { CTABand } from '@/components/landing/cta-band'
import { LandingFooter } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <LandingHero />
      <TrustStrip />
      <FeaturesBento />
      <HowItWorks />
      <TeamSection />
      <CTABand />
      <LandingFooter />
    </main>
  )
}