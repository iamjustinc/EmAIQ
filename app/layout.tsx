import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/app/providers'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'EmailIQ Dashboard',
  description: 'AI-powered email prioritization',
}

export const viewport: Viewport = { themeColor: '#070b14' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="light"
      data-theme="midnight-intelligence"
      data-density="comfortable"
      data-font-scale="medium"
    >
      <body className={`${inter.variable} font-sans antialiased`}>
        <Script
          id="emaiq-appearance-hydrate"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='emaiq-appearance';var r=localStorage.getItem(k);if(!r)return;var s=JSON.parse(r);var d=document.documentElement;if(s.themePreset)d.setAttribute('data-theme',s.themePreset);if(s.density)d.setAttribute('data-density',s.density);if(s.fontScale)d.setAttribute('data-font-scale',s.fontScale);var L=['creator-editorial','sunlit-creator'];if(s.themePreset&&L.indexOf(s.themePreset)>=0){d.classList.remove('dark');d.classList.add('light');}else{d.classList.add('dark');d.classList.remove('light');}}catch(e){}})();`,
          }}
        />
        <Providers>
          {children}
          <Toaster position="bottom-right" />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
