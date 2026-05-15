'use client'

import { useState } from 'react'
import type { SiteConfig, SiteAccent, SiteTab, Zone, Widget } from '@/app/lib/site-data'

// ── Icon lookup ───────────────────────────────────────────────────────────────

const PATHS: Record<string, string> = {
  gauge:            'M12 12m-1 0a1 1 0 102 0 1 1 0 10-2 0M12 13l-4.5-4.5M3.4 17.4A9 9 0 1120.6 17.4',
  'building-factory':'M2 20h20M4 20V10l5 5V10l5 5V8l5-4v16M14 14h3v6h-3z',
  'battery-charging':'M7 7H4a2 2 0 00-2 2v6a2 2 0 002 2h3M17 7h3a2 2 0 012 2v6a2 2 0 01-2 2h-3M11 7l-3 5h4l-3 5',
  'chart-dots':     'M3 3v18h18M8 17l4-6 4 3 4-6',
  tools:            'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
  bell:             'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
  'file-export':    'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M9 13h6M9 17h4M14 17l2 2 2-2M16 16v4',
  flame:            'M11.42 15.17L17.25 21A6 6 0 006 18c0-4 4-6 4-12a6 6 0 016 6c0 2-1.5 3-1.5 4.5',
  bolt:             'M13 2L4 14h7l-1 8 9-11h-7z',
  activity:         'M22 12h-4l-3 9L9 3l-3 9H2',
  'wave-sine':      'M2 12c1.5-4 3-4 4.5 0s3 4 4.5 0 3-4 4.5 0 3 4 4.5 0',
  calendar:         'M3 9h18M7 3v2m10-2v2M3 7h18v13a1 1 0 01-1 1H4a1 1 0 01-1-1V7z',
  percentage:       'M19 5L5 19M7 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm11 11a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
  'chart-pie':      'M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z',
  'chart-bar':      'M18 20V10M12 20V4M6 20v-6',
  'chart-line':     'M3 12l5-5 4 4 9-9',
  'trending-up':    'M23 6l-9.5 9.5-5-5L1 18',
  'trending-down':  'M23 18l-9.5-9.5-5 5L1 6',
  droplet:          'M12 2L7 10.5a6.5 6.5 0 1011 0L12 2z',
  'arrows-diff':    'M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4',
  target:           'M12 12m-2 0a2 2 0 104 0 2 2 0 10-4 0M12 12m-7 0a7 7 0 1014 0 7 7 0 10-14 0M12 12m-11 0a11 11 0 1022 0 11 11 0 10-22 0',
  list:             'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  mail:             'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  check:            'M20 6L9 17l-5-5',
  archive:          'M21 8v13H3V8M23 3H1v5h22V3zM10 12h4',
  eye:              'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z',
  download:         'M8 17l4 4 4-4M12 12v9M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4',
  trophy:           'M12 15.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0M8.5 19.5L8 21h8l-.5-1.5M3 3h18M3 3v4a9 9 0 0018 0V3',
  history:          'M3 12a9 9 0 105.168-8.243M3 3v5h5M12 7v5l3 3',
  exchange:         'M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4',
  wind:             'M17.7 7.7a2.5 2.5 0 111.8 4.3H2M9.6 4.6A2 2 0 1111 8H2m10.8 11.4a2 2 0 101.4-3.4H2',
  sun:              'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 8a4 4 0 100 8 4 4 0 000-8z',
  filter:           'M22 3H2l8 9.46V19l4 2v-8.54z',
  'wifi-off':       'M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01',
  replace:          'M4 12l4-4m0 0l-4-4m4 4H3M20 12l-4 4m0 0l4 4m-4-4h1',
  engine:           'M12 12m-2 0a2 2 0 104 0 2 2 0 10-4 0M12 5V3M17 7l1.4-1.4M19 12h2M17 17l1.4 1.4M12 19v2M7 17l-1.4 1.4M5 12H3M7 7L5.6 5.6',
  layers:           'M12 2L2 7l10 5 10-5-10-5M2 17l10 5 10-5M2 12l10 5 10-5',
  sigma:            'M4 7V4h16v3l-7 5 7 5v3H4v-3l7-5-7-5z',
  clock:            'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2',
  'circle-dot':     'M12 12m-1 0a1 1 0 102 0 1 1 0 10-2 0M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0',
  hash:             'M4 9h16M4 15h16M10 3L8 21M16 3l-2 18',
  alert:            'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
  table:            'M3 3h18v18H3V3zM3 9h18M3 15h18M9 3v18M15 3v18',
  truck:            'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  armchair:         'M5 11h14M5 11V6a2 2 0 012-2h10a2 2 0 012 2v5M5 11L3 16h18l-2-5M6 16v3M18 16v3',
  sliders:          'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
}

function Icon({ name, className }: { name: string; className?: string }) {
  const d = PATHS[name]
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? 'h-4 w-4'}
      aria-hidden="true"
    >
      {d ? <path d={d} /> : <circle cx="12" cy="12" r="4" />}
    </svg>
  )
}

// ── Accent config ─────────────────────────────────────────────────────────────

type AccentConfig = {
  tabActive: string
  tabBorder: string
  sidebarActive: string
  tagBg: string
  tagText: string
  dot: string
}

const ACCENT: Record<SiteAccent, AccentConfig> = {
  blue: {
    tabActive:     'text-blue-600 font-medium',
    tabBorder:     'border-blue-600',
    sidebarActive: 'bg-blue-50 text-blue-700',
    tagBg:  '#E6F1FB', tagText: '#0C447C',
    dot: 'bg-blue-600',
  },
  emerald: {
    tabActive:     'text-emerald-700 font-medium',
    tabBorder:     'border-emerald-600',
    sidebarActive: 'bg-emerald-50 text-emerald-800',
    tagBg:  '#E1F5EE', tagText: '#085041',
    dot: 'bg-emerald-600',
  },
  amber: {
    tabActive:     'text-amber-700 font-medium',
    tabBorder:     'border-amber-600',
    sidebarActive: 'bg-amber-50 text-amber-800',
    tagBg:  '#FAEEDA', tagText: '#8B5500',
    dot: 'bg-amber-600',
  },
}

// ── Tag badge ─────────────────────────────────────────────────────────────────

const TAG_STYLE: Record<string, { bg: string; text: string }> = {
  'SCCI 1': { bg: '#E6F1FB', text: '#0C447C' },
  'SCCI 2': { bg: '#E1F5EE', text: '#085041' },
  'ACC':    { bg: '#FAEEDA', text: '#8B5500' },
}

// ── Zone panel ────────────────────────────────────────────────────────────────

function ZonePanel({ zone, tab, accentCfg }: { zone: Zone; tab: SiteTab; accentCfg: AccentConfig }) {
  return (
    <div className="space-y-5">
      {/* Zone header */}
      <div className="flex items-start gap-3">
        <span
          className="h-7 w-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: zone.bgColor, color: zone.textColor }}
        >
          {zone.letter}
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-gray-900 leading-tight">{zone.name}</h2>
          <p className="mt-0.5 text-xs font-mono text-gray-400">{zone.source}</p>
        </div>
      </div>

      {/* Items grid */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
          {zone.items.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 py-2 border-b border-gray-50 last:border-0 ${item.full ? 'col-span-2' : ''}`}
            >
              <Icon name={item.icon} className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700 leading-snug flex-1">
                {item.text}
                {item.tag && (
                  <span
                    className="ml-1.5 inline-flex px-1.5 py-0.5 text-[9px] font-semibold rounded-full"
                    style={{
                      background: TAG_STYLE[item.tag]?.bg ?? '#f3f4f6',
                      color:      TAG_STYLE[item.tag]?.text ?? '#374151',
                    }}
                  >
                    {item.tag}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Widget cards */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Widgets — {tab.label}
        </p>
        <div className="grid grid-cols-4 gap-3">
          {tab.widgets.map((w, i) => (
            <WidgetCard key={i} widget={w} />
          ))}
        </div>
      </div>
    </div>
  )
}

function WidgetCard({ widget }: { widget: Widget }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 hover:border-gray-300 transition-colors">
      <p className="text-[9px] font-medium uppercase tracking-widest text-gray-400 mb-1.5">{widget.label}</p>
      <div className="flex items-center gap-1.5">
        <Icon name={widget.icon} className="h-3.5 w-3.5 text-gray-400 shrink-0" />
        <span className="text-xs text-gray-600 leading-tight">{widget.type}</span>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SiteView({ site }: { site: SiteConfig }) {
  const [activeTabIdx, setActiveTabIdx] = useState(0)
  const [activeZoneIdx, setActiveZoneIdx] = useState(0)

  const accentCfg = ACCENT[site.accent]
  const tab = site.tabs[activeTabIdx]
  const zone = tab.zones[activeZoneIdx]

  function switchTab(i: number) {
    setActiveTabIdx(i)
    setActiveZoneIdx(0)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Site header ─────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 px-6 pt-5 pb-3">
        <div className={`h-2.5 w-2.5 rounded-full ${accentCfg.dot}`} />
        <div>
          <h1 className="text-lg font-semibold text-gray-900 leading-none">{site.name}</h1>
          <p className="text-xs text-gray-500 mt-0.5">{site.location}</p>
        </div>
      </div>

      {/* ── Horizontal tab bar ──────────────────────────────────────────── */}
      <div className="shrink-0 flex gap-0 overflow-x-auto border-b border-gray-200 bg-white px-6">
        {site.tabs.map((t, i) => {
          const isActive = i === activeTabIdx
          return (
            <button
              key={t.id}
              onClick={() => switchTab(i)}
              className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? `${accentCfg.tabBorder} ${accentCfg.tabActive}`
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon name={t.icon} className="h-3.5 w-3.5 shrink-0" />
              {t.label}
              {t.alertDot && (
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Content: sidebar + main ──────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — zones of active tab */}
        <aside className="w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-white py-3 px-2">
          <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            {tab.label}
          </p>
          <ul className="space-y-0.5">
            {tab.zones.map((z, i) => {
              const isActive = i === activeZoneIdx
              return (
                <li key={z.letter}>
                  <button
                    onClick={() => setActiveZoneIdx(i)}
                    className={`group w-full flex items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors ${
                      isActive
                        ? accentCfg.sidebarActive
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span
                      className="h-5 w-5 shrink-0 rounded flex items-center justify-center text-[10px] font-bold"
                      style={{ background: z.bgColor, color: z.textColor }}
                    >
                      {z.letter}
                    </span>
                    <span className="flex-1 truncate text-xs leading-tight">{z.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Source info for active zone */}
          <div className="mt-4 mx-2 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Source</p>
            <p className="text-[10px] font-mono text-gray-500 leading-tight break-all">{zone.source}</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <ZonePanel zone={zone} tab={tab} accentCfg={accentCfg} />
        </main>
      </div>
    </div>
  )
}
