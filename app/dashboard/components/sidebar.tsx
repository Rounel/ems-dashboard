'use client'

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
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8M3.6 15h16.8M12 3c-2 2.5-3 5-3 9s1 6.5 3 9M12 3c2 2.5 3 5 3 9s-1 6.5-3 9" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M13 2L4 14h7l-1 8 9-13h-7l1-7z" />
    </svg>
  ),
  barChart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  award: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="9" r="6" />
      <path d="M9.09 14.5L8 22l4-2.5L16 22l-1.09-7.5" />
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
  server: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <path d="M6 6h.01M6 18h.01" />
    </svg>
  ),
}

const NAV: NavSection[] = [
  {
    label: 'Vue Groupe',
    items: [
      { href: '/dashboard',                       label: 'Accueil',             icon: I.home,     exact: true },
      { href: '/dashboard/groupe/carte',           label: 'Carte groupe',        icon: I.globe,    exact: true },
      { href: '/dashboard/groupe/mix-energetique', label: 'Mix énergétique',     icon: I.zap },
      { href: '/dashboard/groupe/kpis',            label: 'KPIs croisés',        icon: I.barChart },
      { href: '/dashboard/groupe/iso-50001',       label: 'Benchmark ISO 50001', icon: I.award },
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
      { href: '/dashboard/admin/acces',          label: 'Gestion des accès',     icon: I.users },
      { href: '/dashboard/admin/infrastructure', label: 'Statut infrastructure', icon: I.server },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  const active = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-white border-r border-gray-200 overflow-y-auto">

      {/* Brand */}
      <div className="h-14 shrink-0 flex items-center gap-2.5 px-4 border-b border-gray-200">
        <div className="w-7 h-7 shrink-0 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="min-w-0 leading-none">
          <p className="text-sm font-semibold text-gray-900">EMS Dashboard</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Direction Énergie</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-5">
        {NAV.map((section) => (
          <div key={section.label}>
            <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const on = active(item)
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-2.5 rounded-lg px-2 py-[7px] text-sm transition-colors duration-100 ${
                        on
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className={`shrink-0 transition-colors ${on ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                        {item.icon}
                      </span>

                      <span className="flex-1 truncate">{item.label}</span>

                      {item.badge !== undefined && (
                        <span className="shrink-0 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
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
        <p className="text-[10px] text-gray-400">v0.1.0 · EMS Backoffice</p>
      </div>
    </aside>
  )
}
