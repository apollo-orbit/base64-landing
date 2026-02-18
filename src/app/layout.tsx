import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const baseUrl = 'https://base64.tools'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Base64 Encoder & Decoder - Free Online Tool',
    template: '%s | Base64.tools',
  },
  description: 'Convert text and images to Base64 instantly. Free online Base64 encoder and decoder with API access for developers. No signup required.',
  keywords: ['base64', 'encoder', 'decoder', 'image to base64', 'text to base64', 'base64 converter', 'free tool', 'developer tools', 'API'],
  authors: [{ name: 'Orbit Labs', url: 'https://orbitlabsai.com' }],
  creator: 'Orbit Labs',
  publisher: 'Orbit Labs',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Base64.tools',
    title: 'Base64 Encoder & Decoder - Free Online Tool',
    description: 'Convert text and images to Base64 instantly. Free, fast, and developer-friendly.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Base64.tools - Free Base64 Encoder & Decoder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 Encoder & Decoder - Free Online Tool',
    description: 'Convert text and images to Base64 instantly. Free, fast, and developer-friendly.',
    images: ['/og-image.png'],
    creator: '@OrbitLabsAI',
  },
  alternates: {
    canonical: baseUrl,
  },
  category: 'Developer Tools',
}

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Base64.tools',
  description: 'Free online Base64 encoder and decoder for text and images',
  url: baseUrl,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'Orbit Labs',
    url: 'https://orbitlabsai.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
