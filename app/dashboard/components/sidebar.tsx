'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Status = 'online' | 'warning' | 'offline'

type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
  exact?: boolean
  badge?: number
  status?: Status
}

type NavSection = {
  label: string
  items: NavItem[]
}

const STATUS_DOT: Record<Status, string> = {
  online:  'bg-emerald-500',
  warning: 'bg-amber-400',
  offline: 'bg-red-500',
}

const I = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
    </svg>
  ),
  barChart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  factory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M2 20h20M4 20V10l5 5V10l5 5V8l5-4v16" />
      <rect x="14" y="14" width="3" height="6" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  sliders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
      <path d="M1 14h6M9 8h6M17 16h6" />
    </svg>
  ),
}

const NAV: NavSection[] = [
  {
    label: 'Vue Groupe',
    items: [
      { href: '/dashboard',                       label: 'Accueil',             icon: I.home,     exact: true },
      { href: '/dashboard/groupe/kpis',            label: 'KPIs',        icon: I.barChart },
    ],
  },
  {
    label: 'Sites',
    items: [
      { href: '/dashboard/sites/scci-1', label: 'SCCI 1', icon: I.factory, status: 'online' },
      { href: '/dashboard/sites/scci-2', label: 'SCCI 2', icon: I.factory, status: 'online' },
      { href: '/dashboard/sites/acc',    label: 'ACC',    icon: I.factory, status: 'online' },
    ],
  },
  {
    label: 'Alertes & Rapports',
    items: [
      { href: '/dashboard/alertes',  label: 'Alertes groupe',    icon: I.bell, badge: 3 },
      { href: '/dashboard/rapports', label: 'Rapport consolidé', icon: I.file },
      { href: '/dashboard/rapports', label: 'Envoi automatique', icon: I.send },
    ],
  },
  {
    label: 'Administration',
    items: [
      { href: '/dashboard/profil-supervision', label: 'Profil de Supervision', icon: I.sliders },
      { href: '/dashboard/admin/acces',          label: 'Gestion des accès',     icon: I.users },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  const active = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <aside className="w-68 shrink-0 flex flex-col bg-linear-to-br from-[#156097] via-[#174263] to-[#0f2a42] border-r border-gray-200 overflow-y-auto">

      {/* Brand */}
      <div className="h-14 shrink-0 flex items-center gap-2.5 px-4 border-b border-gray-200">
        <div className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center">
          <Image src="/logo_ag.jpg" alt="Atlantic Group" width={28} height={28} style={{ width: 28, height: 'auto' }} />
        </div>
        <div className="min-w-0 leading-none">
          <p className="text-base font-semibold text-white">Atlantic Group</p>
          <p className="text-base text-white mt-0.5">Supervisor</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-5">
        {NAV.map((section) => (
          <div key={section.label}>
            <p className="px-2 mb-1 text-sm font-semibold uppercase tracking-widest text-white">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const on = active(item)
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-2.5 rounded-lg px-2 py-[7px] text-base transition-colors duration-100 ${
                        on
                          ? 'bg-blue-50 text-primary'
                          : 'text-gray-300 hover:bg-gray-50/10 hover:text-white'
                      }`}
                    >
                      <span className={`shrink-0 transition-colors ${on ? 'text-primary' : 'text-gray-300 group-hover:text-white'}`}>
                        {item.icon}
                      </span>

                      <span className="flex-1 truncate">{item.label}</span>

                      {item.badge !== undefined && (
                        <span className="shrink-0 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-base font-bold text-white">
                          {item.badge}
                        </span>
                      )}
                      {item.status && (
                        <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${STATUS_DOT[item.status]}`} />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-gray-200 px-4 py-3">
        <p className="text-xs text-white">v0.1.0 · Atlantic Group Supervisor</p>
      </div>
    </aside>
  )
}
