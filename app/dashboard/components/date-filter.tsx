'use client'

import { createContext, useContext, useMemo, useState } from 'react'

type DatePreset = 'today' | '7d' | '30d' | 'custom'

type DateFilterState = {
  preset: DatePreset
  startDate: string
  endDate: string
  label: string
  multiplier: number
  setPreset: (preset: DatePreset) => void
  setStartDate: (value: string) => void
  setEndDate: (value: string) => void
}

const DateFilterContext = createContext<DateFilterState | null>(null)

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function daysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return formatDate(date)
}

function periodLabel(preset: DatePreset, startDate: string, endDate: string) {
  if (preset === 'today') return "Aujourd'hui"
  if (preset === '7d') return '7 derniers jours'
  if (preset === '30d') return '30 derniers jours'
  return `${startDate} → ${endDate}`
}

function periodMultiplier(preset: DatePreset, startDate: string, endDate: string) {
  if (preset === 'today') return 1
  if (preset === '7d') return 7
  if (preset === '30d') return 30

  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1)
  return diff
}

export function DateFilterProvider({ children }: { children: React.ReactNode }) {
  const [preset, setPresetState] = useState<DatePreset>('today')
  const [startDate, setStartDate] = useState(formatDate(new Date()))
  const [endDate, setEndDate] = useState(formatDate(new Date()))

  function setPreset(nextPreset: DatePreset) {
    setPresetState(nextPreset)
    if (nextPreset === 'today') {
      const today = formatDate(new Date())
      setStartDate(today)
      setEndDate(today)
    }
    if (nextPreset === '7d') {
      setStartDate(daysAgo(6))
      setEndDate(formatDate(new Date()))
    }
    if (nextPreset === '30d') {
      setStartDate(daysAgo(29))
      setEndDate(formatDate(new Date()))
    }
  }

  const value = useMemo<DateFilterState>(() => ({
    preset,
    startDate,
    endDate,
    label: periodLabel(preset, startDate, endDate),
    multiplier: periodMultiplier(preset, startDate, endDate),
    setPreset,
    setStartDate: (value) => {
      setPresetState('custom')
      setStartDate(value)
    },
    setEndDate: (value) => {
      setPresetState('custom')
      setEndDate(value)
    },
  }), [preset, startDate, endDate])

  return (
    <DateFilterContext.Provider value={value}>
      {children}
    </DateFilterContext.Provider>
  )
}

export function useDateFilter() {
  const context = useContext(DateFilterContext)
  if (!context) {
    throw new Error('useDateFilter must be used inside DateFilterProvider')
  }
  return context
}

export function DateFilterControl() {
  const dateFilter = useDateFilter()

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1">
      {[
        ['today', "Aujourd'hui"],
        ['7d', '7j'],
        ['30d', '30j'],
      ].map(([preset, label]) => (
        <button
          key={preset}
          type="button"
          onClick={() => dateFilter.setPreset(preset as DatePreset)}
          className={`rounded-md px-2.5 py-1.5 text-base font-semibold transition-colors cursor-pointer ${
            dateFilter.preset === preset
              ? 'bg-white text-primary shadow-sm'
              : 'text-black hover:text-black'
          }`}
        >
          {label}
        </button>
      ))}
      <div className="h-5 w-px bg-gray-200" />
      <input
        type="date"
        value={dateFilter.startDate}
        onChange={(event) => dateFilter.setStartDate(event.target.value)}
        className="h-7 rounded-md border border-gray-200 bg-white px-2 text-base text-black outline-none focus:border-blue-500"
        aria-label="Date de début"
      />
      <input
        type="date"
        value={dateFilter.endDate}
        onChange={(event) => dateFilter.setEndDate(event.target.value)}
        className="h-7 rounded-md border border-gray-200 bg-white px-2 text-base text-black outline-none focus:border-blue-500"
        aria-label="Date de fin"
      />
    </div>
  )
}
