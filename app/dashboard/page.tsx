import SectionHeader from './components/section-header'
import { Flame, Fuel, Zap } from 'lucide-react'
import { ALERTS, SITES } from '@/app/lib/mock-data'

const SITE_OVERVIEW = [
  {
    site: 'SCCI 1',
    displayName: 'SCCI 1',
    updatedAgo: '12s',
    electricKwh: 14820,
    electricWarning: 15000,
    electricCritical: 17500,
    gasM3: 1260,
    fuelL: 740,
    status: 'Normal',
    metersOnline: 12,
    metersTotal: 12,
  },
  {
    site: 'SCCI 2',
    displayName: 'SCCI 2',
    updatedAgo: '8s',
    electricKwh: 11340,
    electricWarning: 12500,
    electricCritical: 14500,
    gasM3: 1840,
    fuelL: 920,
    status: 'Alerte',
    metersOnline: 8,
    metersTotal: 9,
  },
  {
    site: 'ACC',
    displayName: 'ACC — Atlantic Cocoa',
    updatedAgo: '5s',
    electricKwh: 8920,
    electricWarning: 10500,
    electricCritical: 12000,
    gasM3: 410,
    fuelL: 360,
    status: 'Critique',
    metersOnline: 6,
    metersTotal: 6,
  },
]

const formatNumber = (value: number) => value.toLocaleString('fr-FR')

function usageTone(value: number, warning: number, critical: number) {
  if (value >= critical) {
    return {
      label: 'Dépassement',
      row: 'border-red-200 bg-red-50 text-red-800',
      dot: 'bg-red-500',
      bar: 'bg-red-500',
    }
  }

  if (value >= warning) {
    return {
      label: 'Proche seuil',
      row: 'border-amber-200 bg-amber-50 text-amber-800',
      dot: 'bg-amber-500',
      bar: 'bg-amber-500',
    }
  }

  return {
    label: 'Sous seuil',
    row: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-500',
  }
}

function siteStatusTone(status: string) {
  if (status === 'Critique') {
    return {
      card: 'border-l-red-500',
      badge: 'bg-red-50 text-red-800',
      bar: 'bg-red-500',
      dot: 'bg-red-500',
    }
  }

  if (status === 'Alerte') {
    return {
      card: 'border-l-amber-500',
      badge: 'bg-amber-50 text-amber-800',
      bar: 'bg-amber-500',
      dot: 'bg-amber-500',
    }
  }

  return {
    card: 'border-l-emerald-500',
    badge: 'bg-emerald-50 text-emerald-800',
    bar: 'bg-emerald-500',
    dot: 'bg-emerald-500',
  }
}

export default function DashboardPage() {
  const totalElectric = SITE_OVERVIEW.reduce((sum, site) => sum + site.electricKwh, 0)
  const totalGas = SITE_OVERVIEW.reduce((sum, site) => sum + site.gasM3, 0)
  const totalFuel = SITE_OVERVIEW.reduce((sum, site) => sum + site.fuelL, 0)
  const activeAlerts = ALERTS.filter((a) => a.status === 'active').length

  const cards = [
    {
      label: 'Consommation électrique',
      value: `${formatNumber(totalElectric)} kWh`,
      detail: 'Cumul journalier des 3 sites',
      icon: Zap,
      rows: SITE_OVERVIEW.map((site) => {
        const tone = usageTone(site.electricKwh, site.electricWarning, site.electricCritical)
        return {
          site: site.site,
          value: `${formatNumber(site.electricKwh)} kWh`,
          detail: tone.label,
          progress: Math.min((site.electricKwh / site.electricCritical) * 100, 100),
          tone,
        }
      }),
    },
    {
      label: 'Consommation gaz',
      value: `${formatNumber(totalGas)} m³`,
      detail: 'Cumul journalier gaz des 3 sites',
      icon: Flame,
      rows: SITE_OVERVIEW.map((site) => {
        const thresholds: Record<string, { warning: number; critical: number }> = {
          'SCCI 1': { warning: 1500, critical: 1800 },
          'SCCI 2': { warning: 1700, critical: 2100 },
          ACC: { warning: 520, critical: 650 },
        }
        const threshold = thresholds[site.site]
        const tone = usageTone(site.gasM3, threshold.warning, threshold.critical)
        return {
          site: site.site,
          value: `${formatNumber(site.gasM3)} m³`,
          detail: tone.label,
          progress: Math.min((site.gasM3 / threshold.critical) * 100, 100),
          tone,
        }
      }),
    },
    {
      label: 'Consommation carburant',
      value: `${formatNumber(totalFuel)} L`,
      detail: 'Cumul journalier carburant des 3 sites',
      icon: Fuel,
      rows: SITE_OVERVIEW.map((site) => {
        const thresholds: Record<string, { warning: number; critical: number }> = {
          'SCCI 1': { warning: 850, critical: 1050 },
          'SCCI 2': { warning: 850, critical: 1050 },
          ACC: { warning: 430, critical: 550 },
        }
        const threshold = thresholds[site.site]
        const tone = usageTone(site.fuelL, threshold.warning, threshold.critical)
        return {
          site: site.site,
          value: `${formatNumber(site.fuelL)} L`,
          detail: tone.label,
          progress: Math.min((site.fuelL / threshold.critical) * 100, 100),
          tone,
        }
      }),
    },
  ]
  return (
    <div className="space-y-5 p-6">
      <SectionHeader title="Vue d'ensemble" subtitle="Supervision groupe — synthèse par site" />
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-base font-medium uppercase tracking-wider text-black">Sites</p>
          <p className="mt-2 text-base lg:text-3xl font-bold">
            {SITES.length}
          </p>
          <p className="mt-1 text-base text-black">
            {SITES.filter((s) => s.status === 'warning').length} site(s) en alerte
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-base font-medium uppercase tracking-wider text-black">Points de mesure</p>
          <p className="mt-2 text-base lg:text-3xl font-bold">26</p>
          <p className="mt-1 text-base text-black">Somme des 3 sites</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-base font-medium uppercase tracking-wider text-black">Alertes actives</p>
          <p className={`mt-2 text-base lg:text-3xl font-bold ${activeAlerts > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {activeAlerts}
          </p>
          <p className="mt-1 text-base text-black">{ALERTS.length} alertes sur 30 jours</p>
        </div>
      </div>

      <section className="grid grid-cols-3 gap-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="rounded-xl border border-[#d8e6f2] bg-[#eef6fb] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold uppercase tracking-widest text-black">{card.label}</p>
                  <p className="mt-3 text-3xl font-bold text-[#23689b]">{card.value}</p>
                  <p className="mt-1 text-base font-medium text-black/70">{card.detail}</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#23689b] shadow-sm">
                  <card.icon className="h-6 w-6" />
                </span>
              </div>
            </div>
            {/* <div className="mt-4 space-y-2">
              {card.rows.map((row) => (
                <div key={`${card.label}-${row.site}`} className={`rounded-xl border p-3 ${row.tone.row}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${row.tone.dot}`} />
                      <span className="text-base font-bold text-black">{row.site}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-black">{row.value}</p>
                      <p className="text-base font-semibold">{row.detail}</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80">
                    <div className={`h-full rounded-full ${row.tone.bar}`} style={{ width: `${row.progress}%` }} />
                  </div>
                </div>
              ))}
            </div> */}
          </article>
        ))}
      </section>

      <section className="grid grid-cols-3 gap-4">
        {SITE_OVERVIEW.map((site) => {
          const tone = siteStatusTone(site.status)
          const share = totalElectric === 0 ? 0 : Math.round((site.electricKwh / totalElectric) * 100)

          return (
            <article key={site.site} className={`rounded-xl border border-gray-200 ${tone.card} border-l-4 bg-white p-5 shadow-sm`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold leading-tight text-black">{site.displayName}</h2>
                  <p className="mt-0.5 text-base font-medium text-black">Mise à jour il y a {site.updatedAgo}</p>
                </div>
                <span className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-base font-bold ${tone.badge}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                  {site.status}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-[#f7f6ef] p-3">
                  <p className="text-base font-semibold uppercase tracking-widest text-black/70">Élec.</p>
                  <p className="mt-1 text-2xl font-bold leading-tight text-[#23689b]">{formatNumber(site.electricKwh)}</p>
                  <p className="mt-1 text-base font-bold text-black">kWh</p>
                </div>
                <div className="rounded-xl bg-[#f7f6ef] p-3">
                  <p className="text-base font-semibold uppercase tracking-widest text-black/70">Gaz</p>
                  <p className="mt-1 text-2xl font-bold leading-tight text-black">{formatNumber(site.gasM3)}</p>
                  <p className="mt-1 text-base font-bold text-black">m³</p>
                </div>
                <div className="rounded-xl bg-[#f7f6ef] p-3">
                  <p className="text-base font-semibold uppercase tracking-widest text-black/70">Carb.</p>
                  <p className="mt-1 text-2xl font-bold leading-tight text-black">{formatNumber(site.fuelL)}</p>
                  <p className="mt-1 text-base font-bold text-black">L</p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${share}%` }} />
              </div>
              <p className="mt-2 text-base font-medium text-black">{share}% de la consommation groupe</p>
            </article>
          )
        })}
      </section>
    </div>
  )
}
