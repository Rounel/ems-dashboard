import { REPORT_HISTORY } from '@/app/lib/mock-data'
import SectionHeader from '@/app/dashboard/components/section-header'
import RapportsForm from './rapports-form'

const FORMAT_BADGE: Record<string, string> = {
  'PDF ISO 50001': 'bg-red-50 text-red-700 border border-red-200',
  'Excel':         'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

export default function RapportsPage() {
  return (
    <div className="space-y-5 p-6">
      <SectionHeader
        title="Rapports"
        subtitle="Génération à la demande & envoi automatique Direction Énergie"
      />

      {/* ── Generate on demand ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-1 text-base font-semibold text-black">Génération à la demande</p>
        <p className="mb-4 text-base text-black">Rapport groupe consolidé — période en cours</p>
        <RapportsForm />
      </div>

      {/* ── Auto-send config ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-4 text-base font-semibold text-black">Envoi automatique — Direction Énergie</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-medium text-black mb-1.5">Destinataires</label>
            <input
              type="text"
              defaultValue="direction.energie@groupe.ci, dg@groupe.ci"
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-base text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-black mb-1.5">Fréquence</label>
            <select className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-base text-black focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Mensuel (1er du mois à 08h00)</option>
              <option>Hebdomadaire (lundi 08h00)</option>
              <option>Désactivé</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-base text-black">Prochain envoi automatique : <strong className="text-black">1er Avr 2025 à 08h00</strong></span>
        </div>
      </div>

      {/* ── History ─────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-3">
          <p className="text-base font-semibold text-black">Historique — 24 mois</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-gray-200">
                {['Nom', 'Période', 'Format', 'Généré le', 'Par', 'Taille', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-base font-semibold uppercase tracking-wider text-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REPORT_HISTORY.map((r) => (
                <tr key={r.id} className="border-b border-gray-100">
                  <td className="px-5 py-3 text-black">{r.name}</td>
                  <td className="px-5 py-3 text-black">{r.period}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-base font-semibold ${FORMAT_BADGE[r.format]}`}>
                      {r.format}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-base text-black whitespace-nowrap">{r.generatedAt}</td>
                  <td className="px-5 py-3 text-base text-black">{r.generatedBy}</td>
                  <td className="px-5 py-3 text-base text-black">{r.size}</td>
                  <td className="px-5 py-3">
                    <button className="text-base text-blue-600 hover:text-blue-700 transition-colors">
                      Télécharger
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
