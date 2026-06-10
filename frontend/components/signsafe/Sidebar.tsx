'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  Settings,
  Users,
  MessageCircle,
  LogOut,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/context/UserContext'
import { useMobileSidebar } from '@/lib/mobile-sidebar-context'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Contracts', href: '/contracts' },
  { icon: BarChart2, label: 'Analytics', href: '/analytics' },
]

const bottomNavItems = [
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: Users, label: 'Team', href: '/team' },
  { icon: MessageCircle, label: 'Support', href: '/support' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const { isOpen, close } = useMobileSidebar()

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    close()
  }, [pathname, close])

  const handleLogout = async () => {
    // Clear guest session data on logout (also cleans up for authenticated users)
    sessionStorage.removeItem("signsafe_analysis");
    sessionStorage.removeItem("signsafe_filename");
    sessionStorage.removeItem("signsafe_guest_count");
    sessionStorage.removeItem("signsafe_history");

    if (supabase) {
      await supabase.auth.signOut();
    }
    close()
    router.push('/')
  }

  const sidebarContent = (
    <aside
      className="h-screen w-60 flex flex-col z-50"
      style={{ background: '#0D0D1A' }}
    >
      {/* Mobile close button */}
      <button
        onClick={close}
        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors z-50"
      >
        <X size={20} className="text-white/60" />
      </button>

      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-5 py-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}
        >
          AI
        </div>
        <span className="text-foreground font-semibold text-[15px] tracking-[-0.01em]">SignSafe</span>
      </Link>

      {/* User */}
      <div className="mx-4 mb-6 p-3 rounded-xl flex items-center gap-3" style={{ background: '#1E1E35' }}>
        <div
          className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            padding: '2px',
          }}
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}
          >
            {user?.user_metadata?.full_name
            ? user.user_metadata.full_name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
            : '??'}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground text-sm font-medium truncate">
            {user?.user_metadata?.full_name || 'Guest User'}
          </p>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(124,58,237,0.25)', color: '#A78BFA' }}
          >
            ADMIN
          </span>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all duration-150 relative',
                active
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
              style={
                active
                  ? {
                      background: 'rgba(124,58,237,0.15)',
                      borderLeft: '3px solid #7C3AED',
                    }
                  : {}
              }
            >
              <Icon size={18} className={active ? 'text-primary' : 'text-muted-foreground'} />
              {label}
            </Link>
          )
        })}

        <div className="my-3 border-t" style={{ borderColor: '#1E1E35' }} />

        {bottomNavItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all duration-150',
                active
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
              style={
                active
                  ? {
                      background: 'rgba(124,58,237,0.15)',
                      borderLeft: '3px solid #7C3AED',
                    }
                  : {}
              }
            >
              <Icon size={18} className={active ? 'text-primary' : 'text-muted-foreground'} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop: always visible, fixed left */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-20" style={{ borderRight: '1px solid #1E1E35' }}>
        {sidebarContent}
      </div>

      {/* Mobile: slide-in overlay */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={close}
        />

        {/* Sidebar panel — slides from left */}
        <div
          className={cn(
            'absolute left-0 top-0 h-full transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          style={{ borderRight: '1px solid #1E1E35' }}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  )
}
