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
          { label: 'Alertes actives',        v: active,        bg: active > 0 ? 'bg-amber-500' : 'bg-emerald-500' },
          { label: 'Critiques non traitées', v: critiques,     bg: critiques > 0 ? 'bg-red-500' : 'bg-emerald-500' },
          { label: 'Type Administrateur',    v: admin,         bg: admin > 0 ? 'bg-blue-500' : 'bg-emerald-500'  },
          { label: 'Type Opérationnel',      v: operationnel,  bg: operationnel > 0 ? 'bg-indigo-500' : 'bg-emerald-500'},
        ].map(({ label, v, bg }) => (
          <div key={label} className={`rounded-xl overflow-hidden border border-gray-200 ${bg}`}>
            <p className="text-base font-medium bg-black text-white text-center py-1 uppercase tracking-wider">{label}</p>
            <div className="p-5">
              <p className={`mt-2 text-center text-5xl font-bold text-white`}>{v}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Alert list (client component) ──────────────────────────────── */}
      {/* ── Alert list (client component) ──────────────────────────────── */}
      {/* ── Alert list (client component) ──────────────────────────────── */}
      <AlertList initialAlerts={ALERTS} />
    </div>
  )
}


