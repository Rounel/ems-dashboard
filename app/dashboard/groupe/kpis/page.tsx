'use client'

import { useState } from 'react'
import { KPI_KWH_TONNE, KPI_L_TONNE, KPI_M3_TONNE, CHART_COLORS } from '@/app/lib/mock-data'
import SectionHeader from '@/app/dashboard/components/section-header'
import { KpiLineChart } from './charts'

const TABS = ['KPI croisés', 'Données en production', 'Données en temps réel'] as const
type Tab = (typeof TABS)[number]

const PRODUCTION_DATA = [
  { site: 'SCCI 1', production: '466 t ciment', target: '510 t', energy: '42,6 MWh', ratio: '91,4 kWh/t', status: 'Sous objectif' },
  { site: 'SCCI 2', production: '452 t ciment', target: '475 t', energy: '38,2 MWh', ratio: '84,6 kWh/t', status: 'OK' },
  { site: 'ACC', production: '110,3 t cacao', target: '125 t', energy: '8 920 kWh', ratio: '80,9 kWh/t', status: 'Surveiller' },
]

const REAL_TIME_DATA = [
  { site: 'SCCI 1', power: '2 180 kW', quality: 'cosφ 0,93', load: 81, alert: 'HTA THD > 5 %' },
  { site: 'SCCI 2', power: '1 960 kW', quality: 'cosφ 0,95', load: 76, alert: 'C6 compresseurs +9 %' },
  { site: 'ACC', power: '1 284 kW', quality: 'cosφ 0,94', load: 72, alert: 'C6 gaz proche seuil' },
]

function Delta({ v, obj, unit }: { v: number; obj: number; unit: string }) {
  const d = v - obj
  const good = d <= 0
  return (
    <span className={`text-base font-semibold ${good ? 'text-emerald-700' : 'text-red-700'}`}>
      {d >= 0 ? '+' : ''}{d.toFixed(1)} {unit}
    </span>
  )
}

export default function KpisPage() {
  const [activeTab, setActiveTab] = useState<Tab>('KPI croisés')
  const lastKwhScci1 = KPI_KWH_TONNE[KPI_KWH_TONNE.length - 1]['SCCI 1']
  const lastKwhScci2 = KPI_KWH_TONNE[KPI_KWH_TONNE.length - 1]['SCCI 2']
  const lastKwhAcc = KPI_KWH_TONNE[KPI_KWH_TONNE.length - 1]['ACC']
  const lastL = KPI_L_TONNE[KPI_L_TONNE.length - 1]['SCCI 1']
  const lastM3 = KPI_M3_TONNE[KPI_M3_TONNE.length - 1]['SCCI 2']

  return (
    <div className="space-y-5 p-6">
      <SectionHeader
        title="KPI"
        subtitle="Vue groupe avec indicateurs croisés, production ERP et mesures temps réel"
      />

      <div className="flex w-fit rounded-xl border border-gray-200 bg-white p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-base font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-blue-50 text-blue-700'
                : 'text-black hover:bg-gray-50 hover:text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'KPI croisés' && (
        <>
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: 'SCCI 1  kWh/t', v: lastKwhScci1, obj: 82, unit: 'kWh/t' },
              { label: 'SCCI 2  kWh/t', v: lastKwhScci2, obj: 88, unit: 'kWh/t' },
              { label: 'ACC  kWh/t', v: lastKwhAcc, obj: 78, unit: 'kWh/t' },
              { label: 'SCCI 1  L/t', v: lastL, obj: 18.5, unit: 'L/t' },
              { label: 'SCCI 2  m³/t', v: lastM3, obj: 12.0, unit: 'm³/t' },
            ].map(({ label, v, obj, unit }) => {
              const good = v <= obj
              return (
                <div key={label} className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-base font-medium uppercase tracking-wider text-black">{label}</p>
                  <p className={`mt-2 text-base font-bold ${good ? 'text-emerald-600' : 'text-red-600'}`}>{v.toFixed(1)}</p>
                  <p className="mt-0.5 text-base text-black">Objectif {obj} {unit}</p>
                  <div className="mt-1">
                    <Delta v={v} obj={obj} unit={unit} />
                  </div>
                </div>
              )
            })}
          </div>

          <KpiLineChart
            title="IPÉ Électricité — kWh / tonne produite (3 sites)"
            unit="kWh/t"
            data={KPI_KWH_TONNE}
            lines={[
              { key: 'SCCI 1', color: CHART_COLORS.scci1, label: 'SCCI 1' },
              { key: 'SCCI 2', color: CHART_COLORS.scci2, label: 'SCCI 2' },
              { key: 'ACC', color: CHART_COLORS.acc, label: 'ACC' },
            ]}
            objectif={82}
            objectifLabel="Obj. groupe 82"
            yDomain={[75, 102]}
          />

          <div className="grid grid-cols-2 gap-4">
            <KpiLineChart
              title="Carburant GE — L / tonne (SCCI 1)"
              unit="L/t"
              data={KPI_L_TONNE}
              lines={[{ key: 'SCCI 1', color: CHART_COLORS.scci1, label: 'SCCI 1' }]}
              objectif={18.5}
              objectifLabel="Obj. 18.5"
              yDomain={[16, 21]}
            />
            <KpiLineChart
              title="Gaz naturel — m³ / tonne (SCCI 2)"
              unit="m³/t"
              data={KPI_M3_TONNE}
              lines={[{ key: 'SCCI 2', color: CHART_COLORS.scci2, label: 'SCCI 2' }]}
              objectif={12.0}
              objectifLabel="Obj. 12.0"
              yDomain={[10, 14]}
            />
          </div>
        </>
      )}

      {activeTab === 'Données en production' && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-3">
            <p className="text-base font-semibold text-black">Données ERP de production</p>
            <p className="mt-0.5 text-base text-black">Tonnages, objectifs et ratios énergie / production</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Site', 'Production', 'Objectif', 'Énergie', 'Ratio', 'Statut'].map((head) => (
                    <th key={head} className="px-5 py-3 text-left text-base font-semibold uppercase tracking-wider text-black">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRODUCTION_DATA.map((row) => (
                  <tr key={row.site} className="border-b border-gray-100">
                    <td className="px-5 py-3 font-semibold text-black">{row.site}</td>
                    <td className="px-5 py-3 text-black">{row.production}</td>
                    <td className="px-5 py-3 text-black">{row.target}</td>
                    <td className="px-5 py-3 text-black">{row.energy}</td>
                    <td className="px-5 py-3 font-semibold text-black">{row.ratio}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-base font-semibold ${
                        row.status === 'OK'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Données en temps réel' && (
        <div className="grid grid-cols-3 gap-4">
          {REAL_TIME_DATA.map((row) => (
            <div key={row.site} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-black">{row.site}</p>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <p className="mt-4 text-base font-bold text-black">{row.power}</p>
              <p className="mt-1 text-base text-black">{row.quality}</p>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-base">
                  <span className="text-black">Charge instantanée</span>
                  <span className="font-semibold text-black">{row.load} %</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${row.load > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${row.load}%` }} />
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-3 text-base text-amber-800">
                {row.alert}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
