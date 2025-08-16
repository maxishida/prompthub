import type { Metadata } from 'next'
import { Inter, Orbitron, Rajdhani } from 'next/font/google'
import './globals.css'
import './performance-optimizations.css'
import './performance-monitor.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })
const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap'
})
const rajdhani = Rajdhani({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap'
})

const enablePerfScripts = process.env.NEXT_PUBLIC_ENABLE_PERF_SCRIPTS === '1'

export const metadata: Metadata = {
  title: 'PromptHub - Engenharia de Prompts',
  description: 'Plataforma para gerenciamento e criação de prompts de IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${inter.className} ${orbitron.variable} ${rajdhani.variable}`} suppressHydrationWarning={true}>
        {children}
        {enablePerfScripts && (
          <>
            <Script src="/scroll-optimization.js" strategy="beforeInteractive" />
            <Script src="/performance-monitor.js" strategy="beforeInteractive" />
            <Script src="/cyberpunk-particles.js" strategy="lazyOnload" />
          </>
        )}
      </body>
    </html>
  )
}