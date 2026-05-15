import { ALERTS } from '@/app/lib/mock-data'
import SectionHeader from '@/app/dashboard/components/section-header'
import AlertList from './alert-list'

export default function AlertesPage() {
  const active      = ALERTS.filter((a) => a.status === 'active').length
  const critiques   = ALERTS.filter((a) => a.level === 'critique' && a.status === 'active').length
  const admin       = ALERTS.filter((a) => a.type === 'admin').length
  const operationnel= ALERTS.filter((a) => a.type === 'operationnel').length

  return (
    <div className="space-y-5 p-6">
      <SectionHeader
        title="Alertes groupe"
        subtitle="Journal 30 jours — Administrateur & Opérationnel"
      />

      {/* ── Summary ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Alertes actives',      v: active,        color: active > 0 ? 'text-amber-600' : 'text-emerald-600' },
          { label: 'Critiques non traitées',v: critiques,    color: critiques > 0 ? 'text-red-600' : 'text-emerald-600' },
          { label: 'Type Administrateur',  v: admin,         color: 'text-blue-600'  },
          { label: 'Type Opérationnel',    v: operationnel,  color: 'text-indigo-600'},
        ].map(({ label, v, color }) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
            <p className={`mt-2 text-2xl font-bold ${color}`}>{v}</p>
          </div>
        ))}
      </div>

      {/* ── Alert list (client component) ──────────────────────────────── */}
      <AlertList initialAlerts={ALERTS} />
    </div>
  )
}
