import './globals.css'
import { Inter } from 'next/font/google'
import { HotToaster } from '../components/hot-toaster'

export const metadata = {
  metadataBase: new URL('https://postgres-pgvector.vercel.app'),
  title: 'Game generation voting app',
  description:
    'Like or dislike game ideas. Top ideas will be regenerated and added to the carousel every week.',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {children}
        <HotToaster />
      </body>
    </html>
  )
}
