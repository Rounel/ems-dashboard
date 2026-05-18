import { ALERTS, SITES } from '@/app/lib/mock-data'
import SectionHeader from './components/section-header'
import { Factory, Flame, Fuel, Zap } from 'lucide-react'

const SITE_CONSUMPTIONS = [
  { site: 'SCCI 1', electricKwh: 14820, gasM3: 1260, fuelL: 740 },
  { site: 'SCCI 2', electricKwh: 11340, gasM3: 1840, fuelL: 920 },
  { site: 'ACC', electricKwh: 8920, gasM3: 410, fuelL: 360 },
]

const formatNumber = (value: number) => value.toLocaleString('fr-FR')

function thresholdStatus(total: number, warning: number, critical: number) {
  if (total >= critical) {
    return {
      label: 'Critique',
      text: 'text-red-700',
      bg: 'bg-red-500',
      badge: 'border-red-200 bg-red-50 text-red-700',
    }
  }

  if (total >= warning) {
    return {
      label: 'À surveiller',
      text: 'text-amber-700',
      bg: 'bg-amber-500',
      badge: 'border-amber-200 bg-amber-50 text-amber-700',
    }
  }

  return {
    label: 'Sous seuil',
    text: 'text-emerald-700',
    bg: 'bg-emerald-500',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  }
}

export default function DashboardPage() {
  const totalKwh = SITES.reduce((s, site) => s + site.kwhToday, 0)
  const activeAlerts = ALERTS.filter((a) => a.status === 'active').length
  const consumptionBlocks = [
    {
      label: 'Consommation électrique',
      unit: 'kWh',
      accent: 'text-[#54a8dc]',
      bg: 'bg-[#54a8dc]',
      warning: 34000,
      critical: 39000,
      icon: Zap,
      values: SITE_CONSUMPTIONS.map(({ site, electricKwh }) => ({ site, value: electricKwh })),
    },
    {
      label: 'Consommation gaz',
      unit: 'm³',
      accent: 'text-[#ef4444]',
      bg: 'bg-[#ef4444]',
      warning: 3200,
      critical: 3800,
      icon: Flame,
      values: SITE_CONSUMPTIONS.map(({ site, gasM3 }) => ({ site, value: gasM3 })),
    },
    {
      label: 'Consommation carburant',
      unit: 'L',
      accent: 'text-[#e8be5c]',
      bg: 'bg-[#e8be5c]',
      warning: 1900,
      critical: 2300,
      icon: Fuel,
      values: SITE_CONSUMPTIONS.map(({ site, fuelL }) => ({ site, value: fuelL })),
    },
  ]

  return (
    <div className="space-y-5 p-6">
      <SectionHeader title="Vue d'ensemble" subtitle="Supervision temps réel — 3 sites industriels" />

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Sites</p>
          <p className="mt-2 text-2xl lg:text-4xl font-bold">
            {SITES.length}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {SITES.filter((s) => s.status === 'warning').length} site(s) en alerte
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Points de mesure</p>
          <p className="mt-2 text-2xl lg:text-4xl font-bold">26</p>
          <p className="mt-1 text-xs text-gray-400">Somme des 3 sites</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Alertes actives</p>
          <p className={`mt-2 text-2xl lg:text-4xl font-bold ${activeAlerts > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {activeAlerts}
          </p>
          <p className="mt-1 text-xs text-gray-400">{ALERTS.length} alertes sur 30 jours</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {consumptionBlocks.map((block) => {
          const total = block.values.reduce((sum, item) => sum + item.value, 0)
          const status = thresholdStatus(total, block.warning, block.critical)
          const warningUsage = Math.min((total / block.warning) * 100, 100)
          const criticalUsage = Math.min((total / block.critical) * 100, 100)

          return (
            <div key={block.label} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className={` ${block.bg} p-3 rounded-lg`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-200">{block.label}</p>
                  <div className="bg-white rounded-full size-14 flex justify-center items-center">
                    <block.icon className={`size-8 ${block.accent}`} />
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="">
                    <p className="text-xs md:text-sm lg:text-base font-medium text-gray-100">Total</p>
                    <p className={`text-2xl lg:text-4xl font-bold text-white`}>
                      {formatNumber(total)} {block.unit}
                    </p>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] h-fit font-semibold ${status.badge}`}>
                    {status.label}
                  </span>
                </div>
                <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-500">Seuil d&apos;utilisation</span>
                    <span className={`font-semibold ${status.text}`}>
                      {warningUsage.toFixed(0)} % du seuil
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div className={`h-full rounded-full ${status.bg}`} style={{ width: `${criticalUsage}%` }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                    <span>Seuil {formatNumber(block.warning)} {block.unit}</span>
                    <span>Critique {formatNumber(block.critical)} {block.unit}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                {block.values.map((item) => (
                  <div key={item.site} className="flex items-center justify-between text-sm bg-gray-500/10 rounded-lg p-2">
                    <div className="flex gap-4 items-center">
                      <Factory className="size-6 text-gray-600" />
                      <span className="text-xs md:text-sm lg:text-base font-medium text-gray-700">{item.site}</span>
                    </div>
                    <span className="text-xs md:text-sm lg:text-base font-semibold text-gray-900">
                      {formatNumber(item.value)} {block.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
