import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TRPCProvider } from '../components/providers/trpc-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DealersCloud Site Builder',
  description: 'All-in-One Dealer-Site Builder - Full-stack web application for DealersCloud website creation',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  )
}
