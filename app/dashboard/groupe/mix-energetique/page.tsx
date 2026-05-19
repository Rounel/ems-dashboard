import { ENERGY_MIX, MONTHLY_ENERGY, ENERGY_COSTS } from '@/app/lib/mock-data'
import SectionHeader from '@/app/dashboard/components/section-header'
import { MixDonutCharts, MixStackedBar } from './charts'

function formatFcfa(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA'
}

export default function MixEnergetiqueePage() {
  const totalCost = ENERGY_COSTS.reduce((s, r) => s + r.total, 0)

  return (
    <div className="space-y-5 p-6">
      <SectionHeader
        title="Mix énergétique"
        subtitle="Répartition Réseau CIE / Groupe Électrogène / Gaz par site"
      />

      {/* ── Cost summary cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        {ENERGY_COSTS.map((row) => (
          <div key={row.site} className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-base font-medium uppercase tracking-wider text-black">{row.site}</p>
            <p className="mt-2 text-base font-bold text-black">{(row.total / 1_000_000).toFixed(1)} M</p>
            <p className="mt-0.5 text-base text-black">FCFA / mois</p>
            <div className="mt-3 space-y-1 text-base text-black">
              <div className="flex justify-between"><span>Réseau CIE</span><span>{(row.cie / 1_000_000).toFixed(1)} M</span></div>
              <div className="flex justify-between"><span>GE</span><span>{(row.ge / 1_000_000).toFixed(1)} M</span></div>
              <div className="flex justify-between"><span>Gaz</span><span>{(row.gaz / 1_000_000).toFixed(1)} M</span></div>
            </div>
          </div>
        ))}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-base font-medium uppercase tracking-wider text-blue-700">Total Groupe</p>
          <p className="mt-2 text-base font-bold text-blue-700">{(totalCost / 1_000_000).toFixed(1)} M</p>
          <p className="mt-0.5 text-base text-blue-600">FCFA / mois</p>
          <p className="mt-3 text-base text-blue-700">{formatFcfa(totalCost)}</p>
        </div>
      </div>

      {/* ── Donut charts ───────────────────────────────────────────────── */}
      <MixDonutCharts data={ENERGY_MIX} />

      {/* ── Stacked bar ────────────────────────────────────────────────── */}
      <MixStackedBar data={MONTHLY_ENERGY} />
    </div>
  )
}
