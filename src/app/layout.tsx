import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Khadevrax | Jasa Pembuatan Website & Aplikasi Terbaik Indonesia',
  description: 'Khadevrax: jasa pembuatan website dan aplikasi berkualitas tinggi dengan tracking publik, monitoring real-time, manajemen proyek transparan. Garansi 6 bulan, harga terjangkau, gratis konsultasi. Hubungi sekarang!',
  keywords: 'jasa pembuatan website, jasa aplikasi, web development, app development, Khadevrax, tracking publik, monitoring real-time, manajemen proyek transparan',
  authors: [{ name: 'Khadevrax Team' }],
  openGraph: {
    title: 'Khadevrax | Jasa Pembuatan Website & Aplikasi Terbaik Indonesia',
    description: 'Khadevrax: jasa pembuatan website dan aplikasi berkualitas tinggi dengan tracking publik, monitoring real-time, manajemen proyek transparan. Garansi 6 bulan, harga terjangkau, gratis konsultasi.',
    url: 'https://khadevrax.com',
    siteName: 'Khadevrax',
    images: [
      {
        url: 'https://khadevrax.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Khadevrax - Jasa Pembuatan Website & Aplikasi',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khadevrax | Jasa Pembuatan Website & Aplikasi Terbaik Indonesia',
    description: 'Khadevrax: jasa pembuatan website dan aplikasi berkualitas tinggi dengan tracking publik, monitoring real-time, manajemen proyek transparan. Garansi 6 bulan, harga terjangkau, gratis konsultasi.',
    images: ['https://khadevrax.com/twitter-image.jpg'],
  },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                },
              }}
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}