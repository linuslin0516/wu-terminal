import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '悟 Terminal | Wu Terminal',
  description: '觀萬物之變，悟道之常 - A digital zen master observing the world',
  keywords: ['AI', 'Terminal', 'Zen', 'Philosophy', 'Chinese', 'Wisdom'],
  authors: [{ name: 'Wu Terminal' }],
  openGraph: {
    title: '悟 Terminal',
    description: '觀萬物之變，悟道之常',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="font-mono">
        {children}
      </body>
    </html>
  )
}
