'use client'

import { useState, useOptimistic, useTransition } from 'react'
import type { Alert, AlertLevel, AlertStatus } from '@/app/lib/mock-data'
import { acknowledgeAlert } from '@/app/actions/alertes'

const ALERT_TABS = [
  { id: 'admin', label: 'Alertes administrateur' },
  { id: 'operationnel', label: 'Alertes opérationnelles' },
] as const

type AlertTab = (typeof ALERT_TABS)[number]['id']

// ── Level config ──────────────────────────────────────────────────────────────

const LEVEL_CFG: Record<AlertLevel, { dot: string; badge: string; label: string }> = {
  critique: { dot: 'bg-red-500',   badge: 'bg-red-50 text-red-700 border border-red-200',     label: 'Critique' },
  warning:  { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border border-amber-200', label: 'Warning' },
  info:     { dot: 'bg-blue-500',  badge: 'bg-blue-50 text-primary border border-blue-200',   label: 'Info' },
}

// ── Section table ─────────────────────────────────────────────────────────────

function AlertSection({
  title, alerts, onAck,
}: {
  title: string
  alerts: Alert[]
  onAck: (id: string) => void
}) {
  if (alerts.length === 0) return null
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
        <h3 className="text-base font-semibold text-black">{title}</h3>
        <span className="text-base text-black">{alerts.filter(a => a.status === 'active').length} actives</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {['Niveau', 'Message', 'Site', 'Horodatage', ''].map((h) => (
                <th key={h} className="px-5 py-2.5 text-left text-base font-semibold uppercase tracking-wider text-black">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="px-5">
            {alerts.map((a) => (
              <tr key={a.id} className={`border-b border-gray-100 transition-colors ${a.status === 'acknowledged' ? 'opacity-50' : ''}`}>
                <td className="px-5 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-base font-semibold ${LEVEL_CFG[a.level].badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${LEVEL_CFG[a.level].dot}`} />
                    {LEVEL_CFG[a.level].label}
                  </span>
                </td>
                <td className="px-5 py-3 text-base text-black max-w-xs">{a.message}</td>
                <td className="px-5 py-3 text-base text-black whitespace-nowrap">{a.site}</td>
                <td className="px-5 py-3 text-base text-black whitespace-nowrap">
                  {new Date(a.timestamp).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-5 py-3 text-right">
                  {a.status === 'acknowledged' ? (
                    <span className="text-base text-black">Acquitté</span>
                  ) : (
                    <button
                      onClick={() => onAck(a.id)}
                      className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-base font-medium text-black transition-colors hover:border-gray-400 hover:text-black"
                    >
                      Acquitter
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

type Filters = {
  level: AlertLevel | 'all'
  status: AlertStatus | 'all'
}

export default function AlertList({ initialAlerts }: { initialAlerts: Alert[] }) {
  const [filters, setFilters] = useState<Filters>({ level: 'all', status: 'all' })
  const [activeTab, setActiveTab] = useState<AlertTab>('admin')
  const [, startTransition] = useTransition()

  const [optimisticAlerts, addOptimisticAck] = useOptimistic(
    initialAlerts,
    (state: Alert[], id: string) =>
      state.map((a) => (a.id === id ? { ...a, status: 'acknowledged' as AlertStatus } : a))
  )

  const handleAck = (id: string) => {
    startTransition(async () => {
      addOptimisticAck(id)
      await acknowledgeAlert(id)
    })
  }

  const filtered = optimisticAlerts.filter((a) => {
    if (filters.level !== 'all' && a.level !== filters.level) return false
    if (filters.status !== 'all' && a.status !== filters.status) return false
    return true
  })

  const adminAlerts = filtered.filter((a) => a.type === 'admin')
  const opAlerts    = filtered.filter((a) => a.type === 'operationnel')
  const visibleAlerts =
    activeTab === 'admin' ? adminAlerts :
    activeTab === 'operationnel' ? opAlerts :
    filtered

  const tabCounts: Record<AlertTab, number> = {
    admin: adminAlerts.length,
    operationnel: opAlerts.length,
  }

  const LEVEL_OPTS: { value: AlertLevel | 'all'; label: string }[] = [
    { value: 'all',      label: 'Tous niveaux' },
    { value: 'critique', label: 'Critique' },
    { value: 'warning',  label: 'Warning' },
    { value: 'info',     label: 'Info' },
  ]
  const STATUS_OPTS: { value: AlertStatus | 'all'; label: string }[] = [
    { value: 'all',          label: 'Tous statuts' },
    { value: 'active',       label: 'Actives' },
    { value: 'acknowledged', label: 'Acquittées' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex w-fit flex-wrap rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
        {ALERT_TABS.map((tab) => {
          const selected = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-base font-semibold transition-colors ${
                selected
                  ? 'bg-[#156097] text-white shadow-sm'
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              {tab.label}
              <span className={`ml-2 rounded-full px-2 py-0.5 text-base ${
                selected ? 'bg-white/20 text-white' : 'bg-gray-100 text-black'
              }`}>
                {tabCounts[tab.id]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filters.level}
          onChange={(e) => setFilters((f) => ({ ...f, level: e.target.value as AlertLevel | 'all' }))}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-base text-black focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {LEVEL_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as AlertStatus | 'all' }))}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-base text-black focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="text-base text-black">
          {visibleAlerts.length} alerte{visibleAlerts.length !== 1 ? 's' : ''} - Journal 30 jours
        </span>
      </div>

      {activeTab === 'admin' && (
        <AlertSection title="Alertes Administrateur" alerts={adminAlerts} onAck={handleAck} />
      )}

      {activeTab === 'operationnel' && (
        <AlertSection title="Alertes opérationnelles" alerts={opAlerts} onAck={handleAck} />
      )}

      {visibleAlerts.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-black text-base">Aucune alerte pour ces filtres.</p>
        </div>
      )}
    </div>
  )
}
