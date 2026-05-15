import { INFRA_SERVICES } from '@/app/lib/mock-data'
import SectionHeader from '@/app/dashboard/components/section-header'
import InfraStatusCards from './status-cards'

export default function InfrastructurePage() {
  const operational = INFRA_SERVICES.filter((s) => s.status === 'operational').length
  const degraded    = INFRA_SERVICES.filter((s) => s.status === 'degraded').length
  const down        = INFRA_SERVICES.filter((s) => s.status === 'down').length

  return (
    <div className="space-y-5 p-6">
      <SectionHeader
        title="Statut infrastructure EMS"
        subtitle="VPN · InfluxDB · Serveur Cloud · API"
      />

      {/* ── Summary ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Opérationnels</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{operational} / {INFRA_SERVICES.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Dégradés</p>
          <p className={`mt-2 text-2xl font-bold ${degraded > 0 ? 'text-amber-600' : 'text-gray-400'}`}>{degraded}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Hors service</p>
          <p className={`mt-2 text-2xl font-bold ${down > 0 ? 'text-red-600' : 'text-gray-400'}`}>{down}</p>
        </div>
      </div>

      {/* ── Service cards (client — refresh button) ─────────────────────── */}
      <InfraStatusCards initialServices={INFRA_SERVICES} />
    </div>
  )
}
