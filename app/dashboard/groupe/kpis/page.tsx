import { KPI_KWH_TONNE, KPI_L_TONNE, KPI_M3_TONNE, CHART_COLORS } from '@/app/lib/mock-data'
import SectionHeader from '@/app/dashboard/components/section-header'
import { KpiLineChart } from './charts'

export default function KpisPage() {
  const lastKwhScci1 = KPI_KWH_TONNE[KPI_KWH_TONNE.length - 1]['SCCI 1']
  const lastKwhScci2 = KPI_KWH_TONNE[KPI_KWH_TONNE.length - 1]['SCCI 2']
  const lastKwhAcc   = KPI_KWH_TONNE[KPI_KWH_TONNE.length - 1]['ACC']
  const lastL        = KPI_L_TONNE[KPI_L_TONNE.length - 1]['SCCI 1']
  const lastM3       = KPI_M3_TONNE[KPI_M3_TONNE.length - 1]['SCCI 2']

  function Delta({ v, obj, unit }: { v: number; obj: number; unit: string }) {
    const d = v - obj
    const good = d <= 0
    return (
      <span className={`text-xs font-semibold ${good ? 'text-emerald-700' : 'text-red-700'}`}>
        {d >= 0 ? '+' : ''}{d.toFixed(1)} {unit}
      </span>
    )
  }

  return (
    <div className="space-y-5 p-6">
      <SectionHeader
        title="KPIs production croisés"
        subtitle="Indicateurs calculés ERP/SQL — courbe 12 mois + objectif"
      />

      {/* ── Summary cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'SCCI 1  kWh/t',  v: lastKwhScci1, obj: 82,   unit: 'kWh/t' },
          { label: 'SCCI 2  kWh/t',  v: lastKwhScci2, obj: 88,   unit: 'kWh/t' },
          { label: 'ACC  kWh/t',     v: lastKwhAcc,   obj: 78,   unit: 'kWh/t' },
          { label: 'SCCI 1  L/t',    v: lastL,        obj: 18.5, unit: 'L/t'   },
          { label: 'SCCI 2  m³/t',   v: lastM3,       obj: 12.0, unit: 'm³/t'  },
        ].map(({ label, v, obj, unit }) => {
          const good = v <= obj
          return (
            <div key={label} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">{label}</p>
              <p className={`mt-2 text-xl font-bold ${good ? 'text-emerald-600' : 'text-red-600'}`}>{v.toFixed(1)}</p>
              <p className="mt-0.5 text-xs text-gray-500">Objectif {obj} {unit}</p>
              <div className="mt-1">
                <Delta v={v} obj={obj} unit={unit} />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Charts ─────────────────────────────────────────────────────── */}
      <KpiLineChart
        title="IPÉ Électricité — kWh / tonne produite (3 sites)"
        unit="kWh/t"
        data={KPI_KWH_TONNE}
        lines={[
          { key: 'SCCI 1', color: CHART_COLORS.scci1, label: 'SCCI 1' },
          { key: 'SCCI 2', color: CHART_COLORS.scci2, label: 'SCCI 2' },
          { key: 'ACC',    color: CHART_COLORS.acc,   label: 'ACC' },
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
    </div>
  )
}
