import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { UserProvider } from '@/lib/user-context' // Import this
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'EmailIQ Dashboard',
  description: 'AI-powered email prioritization',
}

export const viewport: Viewport = { themeColor: '#0F1115' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <UserProvider>
          {children}
          <Toaster position="bottom-right" />
          <Analytics />
        </UserProvider>
      </body>
    </html>
  )
}
