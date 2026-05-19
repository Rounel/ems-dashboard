import { ISO_COMPARISON, ISO_ANNUAL } from '@/app/lib/mock-data'
import SectionHeader from '@/app/dashboard/components/section-header'
import { IsoDeviationChart, IsoAnnualChart } from './charts'

export default function Iso50001Page() {
  const lastScore = ISO_ANNUAL[ISO_ANNUAL.length - 1].realise
  const lastObj   = ISO_ANNUAL[ISO_ANNUAL.length - 1].objectif
  const sitesAbove = ISO_COMPARISON.filter((r) => r.delta > 0).length

  return (
    <div className="space-y-5 p-6">
      <SectionHeader
        title="Benchmark ISO 50001"
        subtitle="Tableau comparatif inter-sites — objectif vs réalisé"
      />

      {/* ── Score summary ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-base font-medium uppercase tracking-wider text-black">Score ISO groupe</p>
          <p className={`mt-2 text-base font-bold ${lastScore >= lastObj ? 'text-emerald-600' : 'text-amber-600'}`}>
            {lastScore.toFixed(1)} / 100
          </p>
          <p className="mt-1 text-base text-black">Objectif : {lastObj}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-base font-medium uppercase tracking-wider text-black">Indicateurs hors objectif</p>
          <p className={`mt-2 text-base font-bold ${sitesAbove === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {sitesAbove} / {ISO_COMPARISON.length}
          </p>
          <p className="mt-1 text-base text-black">dépassent l&apos;objectif</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-base font-medium uppercase tracking-wider text-black">Tendance annuelle</p>
          <p className="mt-2 text-base font-bold text-blue-600">
            +{(ISO_ANNUAL[ISO_ANNUAL.length - 1].realise - ISO_ANNUAL[0].realise).toFixed(1)} pts
          </p>
          <p className="mt-1 text-base text-black">depuis Avr 2024</p>
        </div>
      </div>

      {/* ── Comparison table ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-3">
          <p className="text-base font-semibold text-black">Tableau comparatif inter-sites</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-gray-200">
                {['Site', 'Indicateur', 'Unité', 'Objectif', 'Réalisé', 'Écart', 'Statut'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-base font-semibold uppercase tracking-wider text-black">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ISO_COMPARISON.map((row, i) => {
                const good = row.delta <= 0
                return (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-5 py-3 font-medium text-black">{row.site}</td>
                    <td className="px-5 py-3 text-black">{row.indicateur}</td>
                    <td className="px-5 py-3 text-black">{row.unit}</td>
                    <td className="px-5 py-3 font-mono text-black">{row.objectif}</td>
                    <td className="px-5 py-3 font-mono font-semibold text-black">{row.realise}</td>
                    <td className={`px-5 py-3 font-mono font-semibold ${good ? 'text-emerald-700' : 'text-red-700'}`}>
                      {row.delta >= 0 ? '+' : ''}{row.delta.toFixed(1)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-base font-semibold ${
                        good
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {good ? '✓ Objectif atteint' : '✗ Hors objectif'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Charts ─────────────────────────────────────────────────────── */}
      <IsoDeviationChart data={ISO_COMPARISON} />
      <IsoAnnualChart    data={ISO_ANNUAL} />
    </div>
  )
}
