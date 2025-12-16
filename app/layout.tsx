import type { Metadata } from 'next'
import { Inter, Lato } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Chatbot } from '@/components/chatbot/chatbot'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const lato = Lato({ weight: ['300', '400', '700'], subsets: ['latin'], variable: '--font-lato', display: 'swap' })

export const metadata: Metadata = {
  title: 'SpendSmart',
  description: 'Financial Freedom Tracker',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lato.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Analytics />
          <Toaster />
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  )
}
