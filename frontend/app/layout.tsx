import type { Metadata } from 'next'
import { DM_Sans, Instrument_Serif, Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { UploadProvider } from '@/lib/upload-context'
import { InviteProvider } from '@/lib/invite-context'
import { MobileSidebarProvider } from '@/lib/mobile-sidebar-context'
import { UserProvider } from '@/context/UserContext'
import InviteModal from '@/components/signsafe/InviteModal'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'SignSafe — AI Contract Analysis',
  description: 'AI-powered legal contract risk analysis. Know before you sign.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${dmSans.variable} ${instrumentSerif.variable} ${inter.variable} font-sans antialiased`}>
        <UploadProvider>
          <InviteProvider>
            <MobileSidebarProvider>
              <UserProvider>
                {children}
              </UserProvider>
            </MobileSidebarProvider>
            <InviteModal />
            <Toaster position="top-center" expand={false} richColors />
          </InviteProvider>
        </UploadProvider>
      </body>
    </html>
  )
}
