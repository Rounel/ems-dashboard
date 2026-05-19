'use client'

import { useState, useTransition } from 'react'
import type { InfraService, ServiceStatus } from '@/app/lib/mock-data'

const STATUS_CFG: Record<ServiceStatus, { dot: string; text: string; label: string }> = {
  operational: { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'Opérationnel' },
  degraded:    { dot: 'bg-amber-400',   text: 'text-amber-700',   label: 'Dégradé'      },
  down:        { dot: 'bg-red-500',     text: 'text-red-700',     label: 'Hors service' },
}

const TYPE_ICON: Record<InfraService['type'], React.ReactNode> = {
  VPN: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <circle cx="8" cy="8" r="5" /><path d="M5 8h6M8 5c-1 1-1.5 2-1.5 3s.5 2 1.5 3M8 5c1 1 1.5 2 1.5 3S9 11 8 11" />
    </svg>
  ),
  InfluxDB: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <ellipse cx="8" cy="5" rx="5" ry="2" /><path d="M3 5v2c0 1.1 2.24 2 5 2s5-.9 5-2V5M3 9v2c0 1.1 2.24 2 5 2s5-.9 5-2V9" />
    </svg>
  ),
  Cloud: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M4 11a3 3 0 110-6 3.5 3.5 0 017 .5A2.5 2.5 0 1112.5 11H4z" />
    </svg>
  ),
  API: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M4 6l-2 2 2 2M12 6l2 2-2 2M9 4l-2 8" />
    </svg>
  ),
}

function ServiceCard({ svc }: { svc: InfraService }) {
  const cfg = STATUS_CFG[svc.status]
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-black">{TYPE_ICON[svc.type]}</span>
          <div>
            <p className="text-base font-medium text-black">{svc.name}</p>
            <p className="text-base text-black">{svc.site}</p>
          </div>
        </div>
        <span className={`h-2 w-2 rounded-full mt-1 ${cfg.dot}`} />
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-base font-medium ${cfg.text}`}>{cfg.label}</span>
        {svc.latencyMs !== null && (
          <span className={`text-base font-mono ${svc.latencyMs > 100 ? 'text-amber-600' : 'text-black'}`}>
            {svc.latencyMs} ms
          </span>
        )}
      </div>
      <p className="mt-2 text-base text-black truncate">{svc.detail}</p>
      <p className="mt-1 text-base text-black">Vérifié {svc.lastChecked}</p>
    </div>
  )
}

function ServiceGroup({ title, svcs }: { title: string; svcs: InfraService[] }) {
  return (
    <div>
      <p className="mb-3 text-base font-semibold uppercase tracking-widest text-black">{title}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {svcs.map((s) => <ServiceCard key={s.id} svc={s} />)}
      </div>
    </div>
  )
}

export default function InfraStatusCards({ initialServices }: { initialServices: InfraService[] }) {
  const [services] = useState(initialServices)
  const [lastRefresh, setLastRefresh] = useState('09:15')
  const [, startTransition] = useTransition()

  const handleRefresh = () => {
    startTransition(() => {
      // In production: refetch from API
      setLastRefresh(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    })
  }

  const byType = {
    VPN:     services.filter((s) => s.type === 'VPN'),
    InfluxDB:services.filter((s) => s.type === 'InfluxDB'),
    Other:   services.filter((s) => s.type === 'Cloud' || s.type === 'API'),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-base text-black">
          {Object.entries(STATUS_CFG).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${v.dot}`} />
              {services.filter((s) => s.status === k).length} {v.label.toLowerCase()}
            </span>
          ))}
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-base text-black transition-colors hover:border-gray-400 hover:text-black"
        >
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="h-3 w-3">
            <path d="M1 7A6 6 0 1012 4M12 1v3H9" />
          </svg>
          Rafraîchir · {lastRefresh}
        </button>
      </div>
      <ServiceGroup title="VPN"      svcs={byType.VPN} />
      <ServiceGroup title="InfluxDB" svcs={byType.InfluxDB} />
      <ServiceGroup title="Cloud & API" svcs={byType.Other} />
    </div>
  )
}
