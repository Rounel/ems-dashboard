'use client'

import {
  BarChart, Bar, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer,
} from 'recharts'
import type { IsoCompRow, IsoAnnualPoint } from '@/app/lib/mock-data'
import { CHART_COLORS } from '@/app/lib/mock-data'

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

// ── Deviation bar chart (± around 0) ─────────────────────────────────────────

export function IsoDeviationChart({ data }: { data: IsoCompRow[] }) {
  const chartData = data.map((r) => ({
    name: `${r.site} — ${r.indicateur}`,
    shortName: r.indicateur,
    site: r.site,
    delta: r.delta,
  }))

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-4 text-base font-semibold text-black">Écart objectif / réalisé (valeur positive = dépassement)</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} barSize={24} margin={{ top: 16, right: 8, bottom: 40, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={true} vertical={false} />
          <XAxis
            dataKey="shortName"
            tick={{ fill: CHART_COLORS.tick, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            angle={-30}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fill: CHART_COLORS.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<LightTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <ReferenceLine y={0} stroke={CHART_COLORS.grid} strokeWidth={1} />
          <Bar dataKey="delta" name="Écart (±)" radius={[3, 3, 3, 3]}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.delta > 0 ? '#ef4444' : '#10b981'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Annual consolidated line chart ────────────────────────────────────────────

export function IsoAnnualChart({ data }: { data: IsoAnnualPoint[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-4 text-base font-semibold text-black">Performance annuelle consolidée groupe — Score ISO 50001</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="month" tick={{ fill: CHART_COLORS.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: CHART_COLORS.tick, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={[70, 95]}
            width={36}
          />
          <Tooltip content={<LightTooltip />} cursor={{ stroke: CHART_COLORS.grid }} />
          <Legend wrapperStyle={{ fontSize: 11, color: CHART_COLORS.tick, paddingTop: 12 }} iconType="circle" iconSize={8} />
          <Line
            type="linear"
            dataKey="objectif"
            name="Objectif"
            stroke={CHART_COLORS.objectif}
            strokeDasharray="5 3"
            strokeWidth={1.5}
            dot={false}
          />
          <Line
            type="linear"
            dataKey="realise"
            name="Réalisé"
            stroke={CHART_COLORS.cie}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
