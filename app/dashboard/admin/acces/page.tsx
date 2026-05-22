import { GRAFANA_USERS, ALERT_THRESHOLDS } from '@/app/lib/mock-data'
import SectionHeader from '@/app/dashboard/components/section-header'

const ROLE_BADGE: Record<string, string> = {
  'Administrateur': 'bg-blue-50 text-primary border border-blue-200',
  'Éditeur':        'bg-indigo-50 text-indigo-700 border border-indigo-200',
  'Lecteur':        'bg-gray-100 text-black border border-gray-200',
}

export default function AccesPage() {
  return (
    <div className="space-y-5 p-6">
      <SectionHeader
        title="Gestion des accès"
        subtitle="Comptes Grafana multi-tenants — rôles & périmètres par site"
        action={
          <button className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-base font-medium text-black transition-colors hover:border-gray-400 hover:text-black">
            + Nouvel utilisateur
          </button>
        }
      />

      {/* ── Users table ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-3">
          <p className="text-base font-semibold text-black">Utilisateurs Grafana</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-gray-200">
                {['Nom', 'Email', 'Rôle', 'Périmètre sites', 'Dernière connexion', 'Statut', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-base font-semibold uppercase tracking-wider text-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GRAFANA_USERS.map((u) => (
                <tr key={u.id} className="border-b border-gray-100">
                  <td className="px-5 py-3 font-medium text-black">{u.name}</td>
                  <td className="px-5 py-3 text-black">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-base font-semibold ${ROLE_BADGE[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.siteScope.map((s) => (
                        <span key={s} className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-base text-black">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-base text-black whitespace-nowrap">{u.lastLogin}</td>
                  <td className="px-5 py-3">
                    <span className={`flex items-center gap-1.5 text-base font-medium ${u.active ? 'text-emerald-700' : 'text-black'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      {u.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button className="text-base text-blue-600 hover:text-primary transition-colors">Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Alert thresholds ────────────────────────────────────────────── */}
      {/* <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <p className="text-base font-semibold text-black">Seuils d&apos;alerte groupe</p>
          <span className="text-base text-black">Warning → Orange / Critique → Rouge</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-gray-200">
                {['Indicateur', 'Site', 'Unité', 'Seuil Warning', 'Seuil Critique', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-base font-semibold uppercase tracking-wider text-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALERT_THRESHOLDS.map((t, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-5 py-3 font-medium text-black">{t.indicateur}</td>
                  <td className="px-5 py-3 text-black">{t.site}</td>
                  <td className="px-5 py-3 text-black">{t.unit}</td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-amber-600">{t.warning}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-red-600">{t.critical}</span>
                  </td>
                  <td className="px-5 py-3">
                    <button className="text-base text-blue-600 hover:text-primary transition-colors">Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  )
}
