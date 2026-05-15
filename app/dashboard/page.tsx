import { SITES, TOP_ALERTS } from '@/app/lib/mock-data'
import SectionHeader from './components/section-header'
import StatusBadge from './components/status-badge'

const LEVEL_CFG = {
  critique: { dot: 'bg-red-500',   badge: 'bg-red-50 text-red-700 border border-red-200',     label: 'Critique' },
  warning:  { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border border-amber-200', label: 'Warning'  },
  info:     { dot: 'bg-blue-500',  badge: 'bg-blue-50 text-blue-700 border border-blue-200',   label: 'Info'     },
}

export default function DashboardPage() {
  const totalKwh = SITES.reduce((s, site) => s + site.kwhToday, 0)
  const activeAlerts = TOP_ALERTS.filter((a) => a.status === 'active').length

  return (
    <div className="space-y-5 p-6">
      <SectionHeader title="Vue d'ensemble" subtitle="Supervision temps réel — 3 sites industriels" />

      {/* ── Summary row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Sites en ligne</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{SITES.filter((s) => s.status === 'online').length} / {SITES.length}</p>
          <p className="mt-1 text-xs text-gray-400">{SITES.filter((s) => s.status === 'warning').length} site(s) en alerte</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Points de mésure</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">{(totalKwh / 1000).toFixed(1)} MWh</p>
          <p className="mt-1 text-xs text-gray-400">Somme des 3 sites</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Alertes actives</p>
          <p className={`mt-2 text-2xl font-bold ${activeAlerts > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{activeAlerts}</p>
          <p className="mt-1 text-xs text-gray-400">{TOP_ALERTS.length} alertes sur 30 jours</p>
        </div>
      </div>

      {/* ── Site cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {SITES.map((site) => (
          <div key={site.id} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-semibold text-gray-900">{site.label}</p>
                <p className="text-xs text-gray-500">{site.location}</p>
              </div>
              <StatusBadge status={site.status} />
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-500">Énergie aujourd&apos;hui</p>
                  <p className="mt-0.5 text-xl font-bold text-gray-900">{site.kwhToday.toLocaleString('fr-FR')} kWh</p>
                </div>
                <span className={`text-sm font-semibold ${site.kwhChangePct >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {site.kwhChangePct >= 0 ? '+' : ''}{site.kwhChangePct.toFixed(1)} %
                </span>
              </div>
            </div>

            {/* Comm status */}
            <div className="mt-4 flex gap-4 text-xs">
              <span className={`flex items-center gap-1.5 ${site.vpn ? 'text-emerald-600' : 'text-red-600'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${site.vpn ? 'bg-emerald-500' : 'bg-red-500'}`} />
                VPN
              </span>
              <span className={`flex items-center gap-1.5 ${site.dataStream ? 'text-emerald-600' : 'text-red-600'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${site.dataStream ? 'bg-emerald-500' : 'bg-red-500'}`} />
                Flux données
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Communication matrix + Top alerts ──────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-5">
          <p className="mb-4 text-sm font-semibold text-gray-900">Matrice de communication</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Site</th>
                <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">VPN</th>
                <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Flux données</th>
                <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Statut global</th>
              </tr>
            </thead>
            <tbody>
              {SITES.map((site) => (
                <tr key={site.id} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-700">{site.label}</td>
                  <td className="py-3">
                    <span className={`flex items-center gap-1.5 text-xs ${site.vpn ? 'text-emerald-600' : 'text-red-600'}`}>
                      {site.vpn ? '✓ Actif' : '✗ Coupé'}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`flex items-center gap-1.5 text-xs ${site.dataStream ? 'text-emerald-600' : 'text-red-600'}`}>
                      {site.dataStream ? '✓ Normal' : '✗ Interrompu'}
                    </span>
                  </td>
                  <td className="py-3"><StatusBadge status={site.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="mb-4 text-sm font-semibold text-gray-900">Top 3 alertes actives</p>
          <div className="space-y-3">
            {TOP_ALERTS.map((alert) => {
              const cfg = LEVEL_CFG[alert.level]
              return (
                <div key={alert.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    <span className="text-xs text-gray-500">{alert.site}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{alert.message}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
