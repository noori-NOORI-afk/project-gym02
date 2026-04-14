import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Body Fit Training - Transform with Certainty',
  description: 'Premium fitness coaching and membership portal by Vikram Valecha',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-tactical-black text-gray-100">
        {children}
      </body>
    </html>
  )
}
