import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder - Free Online Tool',
  description: 'Convert text and images to Base64 instantly. Free online Base64 encoder and decoder with API access for developers.',
  keywords: 'base64, encoder, decoder, image to base64, text to base64, base64 converter, free tool',
  openGraph: {
    title: 'Base64 Encoder & Decoder - Free Online Tool',
    description: 'Convert text and images to Base64 instantly. Free online tool with API.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
