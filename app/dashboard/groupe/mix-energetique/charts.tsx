'use client'

import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import type { EnergyMixRow, MonthlyEnergyRow } from '@/app/lib/mock-data'
import { CHART_COLORS } from '@/app/lib/mock-data'

// ── Shared light tooltip ──────────────────────────────────────────────────────

type ChartPayload = {
  name?: string
  value?: string | number
  color?: string
  fill?: string
}

type LightTooltipProps = {
  active?: boolean
  payload?: ChartPayload[]
  label?: string | number
}

function LightTooltip({ active, payload, label }: LightTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-base shadow-lg">
      {label && <p className="mb-1 text-black">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? p.fill }}>
          {p.name}: <span className="font-semibold text-black">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

// ── Donut charts (3 sites) ────────────────────────────────────────────────────

const MIX_COLORS = [CHART_COLORS.cie, CHART_COLORS.ge, CHART_COLORS.gaz]

function SingleDonut({ row }: { row: EnergyMixRow }) {
  const data = [
    { name: 'Réseau CIE', value: row.cie },
    { name: 'GE',         value: row.ge  },
    { name: 'Gaz',        value: row.gaz },
  ]
  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-base font-semibold text-black">{row.site}</p>
      <div className="relative w-full" style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={50}
              outerRadius={72}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={MIX_COLORS[i]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<LightTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ paddingBottom: 20 }}>
          <span className="text-base text-black">Mix</span>
        </div>
      </div>
      {/* Legend */}
      <div className="mt-1 space-y-1 text-base">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: MIX_COLORS[i] }} />
            <span className="text-black">{d.name}</span>
            <span className="font-semibold text-black ml-auto pl-3">{d.value} %</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MixDonutCharts({ data }: { data: EnergyMixRow[] }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {data.map((row) => (
        <div key={row.site} className="rounded-xl border border-gray-200 bg-white p-5">
          <SingleDonut row={row} />
        </div>
      ))}
    </div>
  )
}

// ── Stacked bar 12 months ─────────────────────────────────────────────────────

export function MixStackedBar({ data }: { data: MonthlyEnergyRow[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-4 text-base font-semibold text-black">Évolution 12 mois — Groupe (MWh)</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barSize={18} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="month" tick={{ fill: CHART_COLORS.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: CHART_COLORS.tick, fontSize: 11 }} axisLine={false} tickLine={false} unit=" MWh" width={58} />
          <Tooltip content={<LightTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: CHART_COLORS.tick, paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="CIE" name="Réseau CIE" stackId="a" fill={CHART_COLORS.cie} radius={[0, 0, 0, 0]} />
          <Bar dataKey="GE"  name="GE"         stackId="a" fill={CHART_COLORS.ge}  radius={[0, 0, 0, 0]} />
          <Bar dataKey="Gaz" name="Gaz"        stackId="a" fill={CHART_COLORS.gaz} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
