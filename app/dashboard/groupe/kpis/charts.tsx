'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer,
} from 'recharts'
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
        <p key={i} style={{ color: p.color }}>
          {p.name}: <span className="font-semibold text-black">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

type LineConfig = { key: string; color: string; label: string }

type KpiLineChartProps = {
  title: string
  unit: string
  data: Record<string, string | number>[]
  lines: LineConfig[]
  objectif: number
  objectifLabel?: string
  yDomain?: [number, number]
}

export function KpiLineChart({
  title, unit, data, lines, objectif, objectifLabel = 'Objectif', yDomain,
}: KpiLineChartProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-4 text-base font-semibold text-black">{title}</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="month" tick={{ fill: CHART_COLORS.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: CHART_COLORS.tick, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            unit={` ${unit}`}
            width={56}
            domain={yDomain}
          />
          <Tooltip content={<LightTooltip />} cursor={{ stroke: CHART_COLORS.grid }} />
          <Legend wrapperStyle={{ fontSize: 11, color: CHART_COLORS.tick, paddingTop: 12 }} iconType="circle" iconSize={8} />
          <ReferenceLine
            y={objectif}
            stroke={CHART_COLORS.objectif}
            strokeDasharray="5 3"
            label={{ value: objectifLabel, fill: CHART_COLORS.tick, fontSize: 10, position: 'insideTopRight' }}
          />
          {lines.map((l) => (
            <Line
              key={l.key}
              type="linear"
              dataKey={l.key}
              name={l.label}
              stroke={l.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
