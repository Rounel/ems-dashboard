'use client'

import { useEffect, useRef, useState } from 'react'
import type { SiteConfig, SiteAccent, SiteTab, Zone } from '@/app/lib/site-data'
import { useDateFilter } from '@/app/dashboard/components/date-filter'

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
    sidebarActive: 'bg-blue-50 text-primary',
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

function ZonePanel({ zone }: { zone: Zone }) {
  return (
    <div className="space-y-5">
      {/* Zone header */}
      <div className="flex items-start gap-3">
        <span
          className="h-7 w-7 rounded-lg flex items-center justify-center text-base font-bold shrink-0"
          style={{ background: zone.bgColor, color: zone.textColor }}
        >
          {zone.letter}
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-black leading-tight">{zone.name}</h2>
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
              <Icon name={item.icon} className="h-4 w-4 text-black shrink-0 mt-0.5" />
              <span className="text-base text-black leading-snug flex-1">
                {item.text}
                {item.tag && (
                  <span
                    className="ml-1.5 inline-flex px-1.5 py-0.5 text-sm font-semibold rounded-full"
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

    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const ACC_DASHBOARD_METRICS = [
  { label: 'Puissance', value: '1 284', unit: 'kW', detail: '72% souscrit', icon: 'bolt', accent: 'text-[#23689b]', border: 'border-t-[#23689b]', bar: 72, spark: [44, 52, 49, 58, 72] },
  { label: 'Énergie jour', value: '8 920', unit: 'kWh', detail: '+0,9% vs J-1', icon: 'hash', accent: 'text-[#23689b]', border: 'border-t-[#23689b]', bar: 61, spark: [38, 46, 44, 51, 61] },
  { label: 'Gaz séchoir', value: '410', unit: 'm³', detail: '76% seuil jour', icon: 'flame', accent: 'text-amber-700', border: 'border-t-amber-600', bar: 76, spark: [30, 42, 54, 68, 76] },
  { label: 'KPI cacao', value: '80,9', unit: 'kWh/t', detail: 'Objectif 78 · +3,7%', icon: 'target', accent: 'text-red-700', border: 'border-t-red-500', bar: 104, badge: 'Hors objectif' },
  { label: 'Compteurs', value: '6', unit: '', detail: '4 OK · 2 à surveiller', icon: 'table', accent: 'text-black', border: 'border-t-emerald-500', bar: 67, badge: '4 OK' },
  { label: 'Score KPI', value: '86', unit: '%', detail: 'Objectif > 90%', icon: 'chart-dots', accent: 'text-emerald-700', border: 'border-t-lime-600', bar: 86 },
]

const ACC_POINT_STATUS = [
  { ref: 'C1', label: 'TGBT 1', meterType: 'Compteur électrique', grandeur: 'Énergie totale', value: '5 640', unit: 'kWh', detail: '63% · En ligne', status: 'OK', bar: 63, border: 'border-l-[#23689b]', color: 'bg-[#23689b]', badge: 'bg-blue-50 text-[#23689b]', icon: 'bolt', iconTone: 'bg-blue-50 text-[#23689b]' },
  { ref: 'C2', label: 'TGBT 2', meterType: 'Compteur électrique', grandeur: 'Énergie totale', value: '3 280', unit: 'kWh', detail: '37% · En ligne', status: 'OK', bar: 37, border: 'border-l-emerald-500', color: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', icon: 'bolt', iconTone: 'bg-emerald-50 text-emerald-700' },
  { ref: 'C3', label: 'Usinage', meterType: 'Compteur électrique', grandeur: 'Énergie usinage', value: '1 760', unit: 'kWh', detail: '80% seuil', status: 'Surveiller', bar: 80, border: 'border-l-amber-600', color: 'bg-amber-600', badge: 'bg-amber-50 text-amber-700', icon: 'bolt', iconTone: 'bg-amber-50 text-amber-700' },
  { ref: 'C4', label: 'Séchoir', meterType: 'Compteur électrique', grandeur: 'Énergie séchoir', value: '2 120', unit: 'kWh', detail: '50% · En ligne', status: 'OK', bar: 50, border: 'border-l-violet-600', color: 'bg-violet-600', badge: 'bg-violet-50 text-violet-700', icon: 'bolt', iconTone: 'bg-violet-50 text-violet-700' },
  { ref: 'C5', label: 'Administration', meterType: 'Compteur électrique', grandeur: 'Énergie administration', value: '620', unit: 'kWh', detail: '7% énergie totale', status: 'OK', bar: 7, border: 'border-l-emerald-500', color: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', icon: 'bolt', iconTone: 'bg-emerald-50 text-emerald-700' },
  { ref: 'C6', label: 'Gaz séchoir', meterType: 'Compteur gaz', grandeur: 'Volume gaz', value: '410', unit: 'm³', detail: '76% seuil jour', status: 'Surveiller', bar: 76, border: 'border-l-amber-600', color: 'bg-amber-600', badge: 'bg-amber-50 text-amber-700', icon: 'flame', iconTone: 'bg-amber-50 text-amber-700' },
]
type IndustrialSiteData = {
  metrics: Array<{ label: string; value: string; detail: string; icon: string; accent: string; bar: number }>
  points: Array<{ ref: string; label: string; value: string; status: string; color: string }>
  profile: Array<{ label: string; value: number; color: string }>
  quality: Array<{ label: string; value: string; color: string }>
  alerts: string[]
  kpis: Array<{ label: string; value: string; target: string; gap: string; formula: string; status: 'ok' | 'watch' | 'alert' }>
}

const INDUSTRIAL_SITE_DATA: Record<string, IndustrialSiteData> = {
  'scci-1': {
    metrics: [
      { label: 'Puissance instantanÃ©e', value: '2 180 kW', detail: 'C1+C2 Â· 81 % souscrit', icon: 'bolt', accent: 'text-primary', bar: 81 },
      { label: 'Ã‰nergie jour', value: '42,6 MWh', detail: '+2,4 % vs J-1', icon: 'hash', accent: 'text-emerald-700', bar: 68 },
      { label: 'Carburant GE', value: '1 240 L', detail: 'GE1/GE2 Â· 64 % seuil jour', icon: 'droplet', accent: 'text-amber-700', bar: 64 },
      { label: 'kWh / tonne', value: '91,4', detail: 'Objectif 88,0 kWh/t', icon: 'target', accent: 'text-red-700', bar: 104 },
      { label: 'Compteurs', value: '12', detail: 'DIRIS + HTA + GE + carburant', icon: 'table', accent: 'text-black', bar: 100 },
      { label: 'Points de mesure', value: '156', detail: 'Mesures électriques et carburant', icon: 'circle-dot', accent: 'text-primary', bar: 86 },
    ],
    points: [
      { ref: 'C1', label: 'TGBT 1', value: '24,8 MWh', status: 'OK', color: 'bg-emerald-500' },
      { ref: 'C2', label: 'Administration', value: '3,4 MWh', status: 'OK', color: 'bg-emerald-500' },
      { ref: 'C3', label: 'ExpÃ©dition', value: '5,8 MWh', status: 'Surveiller', color: 'bg-amber-500' },
      { ref: 'HTA', label: 'Salle 6 kV', value: '12,6 MWh', status: 'Surveiller', color: 'bg-amber-500' },
      { ref: 'GE1', label: 'Groupe GE1', value: '620 L', status: 'OK', color: 'bg-emerald-500' },
      { ref: 'CUVE', label: 'Carburant', value: '38 %', status: 'OK', color: 'bg-emerald-500' },
    ],
    profile: [
      { label: 'Broyage / HTA', value: 38, color: 'bg-blue-500' },
      { label: 'ExpÃ©dition C3', value: 14, color: 'bg-amber-500' },
      { label: 'Administration C2', value: 8, color: 'bg-emerald-500' },
      { label: 'Autres process', value: 40, color: 'bg-gray-400' },
    ],
    quality: [
      { label: 'cos Ï† global', value: '0,93', color: 'text-emerald-700' },
      { label: 'THD moyen', value: '4,7 %', color: 'text-amber-700' },
      { label: 'DÃ©sÃ©quilibre phases', value: '6,2 %', color: 'text-amber-700' },
    ],
    alerts: ['C3 Â· Courant L2 proche seuil', 'Salle 6 kV Â· THD > 5 % sur 12 min'],
    kpis: [
      { label: 'kWh / tonne ciment produite', value: '91,4 kWh/t', target: '88,0 kWh/t', gap: '+3,9 %', formula: 'Ã‰nergie totale / Tonnage ERP', status: 'watch' },
      { label: 'L carburant / tonne ciment', value: '2,7 L/t', target: '3,0 L/t', gap: '-10,0 %', formula: 'Litres carburant / Tonnage ERP', status: 'ok' },
      { label: '% Ã©nergie Administration', value: '8,0 %', target: '9,0 %', gap: '-1,0 pt', formula: 'C2 / (C1+C2) Ã— 100', status: 'ok' },
      { label: 'PUE Process', value: '0,86', target: '0,88', gap: '-2,3 %', formula: 'Ã‰nergie process / Ã‰nergie totale', status: 'watch' },
    ],
  },
  'scci-2': {
    metrics: [
      { label: 'Puissance instantanÃ©e', value: '1 960 kW', detail: 'C1 Â· 76 % souscrit', icon: 'bolt', accent: 'text-emerald-700', bar: 76 },
      { label: 'Ã‰nergie jour', value: '38,2 MWh', detail: '-1,1 % vs J-1', icon: 'hash', accent: 'text-primary', bar: 59 },
      { label: 'Gaz process', value: '1 520 mÂ³', detail: 'C9 Â· 69 % seuil jour', icon: 'flame', accent: 'text-amber-700', bar: 69 },
      { label: 'kWh / tonne', value: '84,6', detail: 'Objectif 86,0 kWh/t', icon: 'target', accent: 'text-emerald-700', bar: 98 },
      { label: 'Compteurs', value: '9', detail: 'C1 à C9 supervisés', icon: 'table', accent: 'text-black', bar: 100 },
      { label: 'Points de mesure', value: '117', detail: 'Mesures électriques + gaz', icon: 'circle-dot', accent: 'text-emerald-700', bar: 82 },
    ],
    points: [
      { ref: 'C1', label: 'GÃ©nÃ©ral usine', value: '38,2 MWh', status: 'OK', color: 'bg-emerald-500' },
      { ref: 'C2', label: 'Administration', value: '2,8 MWh', status: 'OK', color: 'bg-emerald-500' },
      { ref: 'C3+C4', label: 'ExpÃ©dition', value: '6,1 MWh', status: 'OK', color: 'bg-emerald-500' },
      { ref: 'C6', label: 'Compresseurs', value: '4,4 MWh', status: 'Surveiller', color: 'bg-amber-500' },
      { ref: 'C7+C8', label: 'GE', value: '0,8 MWh', status: 'OK', color: 'bg-emerald-500' },
      { ref: 'C9', label: 'Gaz', value: '1 520 mÂ³', status: 'Surveiller', color: 'bg-amber-500' },
    ],
    profile: [
      { label: 'ExpÃ©dition C3+C4', value: 16, color: 'bg-emerald-500' },
      { label: 'Compresseurs C6', value: 12, color: 'bg-amber-500' },
      { label: 'Administration C2', value: 7, color: 'bg-blue-500' },
      { label: 'Autres process', value: 65, color: 'bg-gray-400' },
    ],
    quality: [
      { label: 'cos Ï† global', value: '0,95', color: 'text-emerald-700' },
      { label: 'THD moyen', value: '3,9 %', color: 'text-emerald-700' },
      { label: 'DisponibilitÃ© flux', value: '99,8 %', color: 'text-emerald-700' },
    ],
    alerts: ['C6 Â· Compresseurs +9 % vs profil', 'C9 Â· Gaz proche seuil journalier'],
    kpis: [
      { label: 'kWh / tonne ciment produite', value: '84,6 kWh/t', target: '86,0 kWh/t', gap: '-1,6 %', formula: 'C1 / Tonnage ERP', status: 'ok' },
      { label: 'mÂ³ gaz / tonne ciment', value: '3,4 mÂ³/t', target: '3,2 mÂ³/t', gap: '+6,3 %', formula: 'C9 / Tonnage ERP', status: 'watch' },
      { label: 'kWh ExpÃ©dition / tonne expÃ©diÃ©e', value: '13,5 kWh/t', target: '14,0 kWh/t', gap: '-3,6 %', formula: '(C3+C4) / Tonnage expÃ©diÃ©', status: 'ok' },
      { label: 'PUE Process', value: '0,89', target: '0,90', gap: '-1,1 %', formula: '(C3+C4+C6) / C1', status: 'watch' },
    ],
  },
}

const ACC_KPI_INPUTS = {
  totalEnergyKwh: 8920,
  dryerEnergyKwh: 2120,
  gasM3: 410,
  machiningEnergyKwh: 1760,
  adminEnergyKwh: 620,
  processEnergyKwh: 7550,
  pvKwh: 640,
  cocoaTons: 110.3,
  driedTons: 47.8,
  machinedTons: 54.2,
}

const ACC_KPIS = [
  {
    label: 'kWh/tonne cacao traité',
    value: ACC_KPI_INPUTS.totalEnergyKwh / ACC_KPI_INPUTS.cocoaTons,
    unit: 'kWh/t',
    target: 78,
    formula: 'Énergie totale (C1+C2) / Tonnage ERP',
    detail: '8 920 kWh / 110,3 t',
  },
  {
    label: 'kWh Séchoir / tonne séchée',
    value: ACC_KPI_INPUTS.dryerEnergyKwh / ACC_KPI_INPUTS.driedTons,
    unit: 'kWh/t',
    target: 42,
    formula: 'Énergie C4 / Tonnage séché ERP',
    detail: '2 120 kWh / 47,8 t',
  },
  {
    label: 'm³ gaz / tonne séchée',
    value: ACC_KPI_INPUTS.gasM3 / ACC_KPI_INPUTS.driedTons,
    unit: 'm³/t',
    target: 8,
    formula: 'Volume gaz C6 / Tonnage séché ERP',
    detail: '410 m³ / 47,8 t',
  },
  {
    label: 'kWh Usinage / tonne usinée',
    value: ACC_KPI_INPUTS.machiningEnergyKwh / ACC_KPI_INPUTS.machinedTons,
    unit: 'kWh/t',
    target: 35,
    formula: 'Énergie C3 / Tonnage usinage ERP',
    detail: '1 760 kWh / 54,2 t',
  },
  {
    label: '% énergie Administration',
    value: (ACC_KPI_INPUTS.adminEnergyKwh / ACC_KPI_INPUTS.totalEnergyKwh) * 100,
    unit: '%',
    target: 8,
    formula: 'C5 / (C1+C2) × 100',
    detail: '620 kWh / 8 920 kWh',
  },
  {
    label: 'PUE Process (ratio usages)',
    value: ACC_KPI_INPUTS.processEnergyKwh / ACC_KPI_INPUTS.totalEnergyKwh,
    unit: '',
    target: 0.9,
    formula: 'Énergie process / Énergie totale',
    detail: '7 550 kWh / 8 920 kWh',
    higherIsBetter: true,
  },
  {
    label: 'Part Solaire PV',
    value: (ACC_KPI_INPUTS.pvKwh / ACC_KPI_INPUTS.totalEnergyKwh) * 100,
    unit: '%',
    target: 10,
    formula: 'kWh PV / kWh total × 100',
    detail: '640 kWh / 8 920 kWh',
    higherIsBetter: true,
  },
]

type MapFeature = {
  id: string
  label: string
  type: 'building' | 'utility' | 'yard' | 'meter'
  x: number
  y: number
  w: number
  h: number
  meter?: string
  detail: string
}

const ACC_MAP_FEATURES: MapFeature[] = [
  { id: 'usine-feves', label: 'USINE FEVES', type: 'building', x: 8, y: 13, w: 19, h: 16, detail: 'Zone fèves, torréfaction et préparation amont.' },
  { id: 'usine-nibs', label: 'USINE NIBS', type: 'building', x: 6, y: 35, w: 17, h: 16, detail: 'Zone nibs et traitement intermédiaire.' },
  { id: 'atelier-torrefaction', label: 'ATELIER TORREFACTION', type: 'building', x: 27, y: 12, w: 18, h: 13, detail: 'Atelier torréfaction extrait du plan PL13.' },
  { id: 'atelier-pressage', label: 'ATELIER PRESSAGE', type: 'building', x: 47, y: 12, w: 17, h: 13, detail: 'Atelier pressage adjacent aux zones process.' },
  { id: 'atelier-pulverisation', label: 'ATELIER PULVERISATION', type: 'building', x: 66, y: 12, w: 22, h: 13, detail: 'Atelier pulvérisation en partie haute du process.' },
  { id: 'atelier-broyage', label: 'ATELIER BROYAGE', type: 'building', x: 27, y: 30, w: 16, h: 13, meter: 'C3', detail: 'Départ Usinage fèves, suivi par le compteur C3.' },
  { id: 'local-ge', label: 'LOCAL GE', type: 'utility', x: 18, y: 52, w: 13, h: 10, detail: 'Local groupes électrogènes.' },
  { id: 'local-tgbt', label: 'LOCAL TGBT', type: 'utility', x: 33, y: 52, w: 13, h: 10, meter: 'C1/C2', detail: 'Local TGBT 1 et TGBT 2, points C1 et C2.' },
  { id: 'atelier-desodo', label: 'ATELIER DESODO', type: 'building', x: 48, y: 31, w: 16, h: 12, detail: 'Atelier désodorisation.' },
  { id: 'tempereuse', label: 'ATELIER TEMPEREUSE', type: 'building', x: 66, y: 31, w: 18, h: 12, detail: 'Tempéreuses beurre/masse.' },
  { id: 'salle-coulage', label: 'SALLE DE COULAGE', type: 'building', x: 66, y: 49, w: 22, h: 13, detail: 'Stations de coulage 1, 2 et 3.' },
  { id: 'sechoir', label: 'SECHOIR', type: 'building', x: 48, y: 48, w: 14, h: 14, meter: 'C4/C6', detail: 'Séchoir thermique, énergie C4 et gaz C6.' },
  { id: 'administration', label: 'ADMINISTRATION', type: 'building', x: 11, y: 67, w: 19, h: 11, meter: 'C5', detail: 'Bâtiment administratif et bureaux.' },
  { id: 'labo', label: 'LABO PHYSICOCHIMIQUE', type: 'building', x: 32, y: 67, w: 19, h: 11, detail: 'Laboratoire physicochimique.' },
  { id: 'chambre-froide', label: 'CHAMBRE FROIDE', type: 'building', x: 53, y: 67, w: 15, h: 11, detail: 'Chambre froide.' },
  { id: 'magasin-finis', label: 'MAGASIN PRODUITS FINIS', type: 'building', x: 70, y: 67, w: 20, h: 11, detail: 'Magasin produits finis.' },
  { id: 'quai', label: 'QUAI DE RECEPTION', type: 'yard', x: 45, y: 83, w: 24, h: 8, detail: 'Quai de réception et zone logistique.' },
  { id: 'gaz', label: 'LOCAL GAZ', type: 'utility', x: 74, y: 82, w: 13, h: 8, meter: 'C6', detail: 'Arrivée gaz séchoir, localisation à confirmer terrain.' },
]

const ACC_METER_POINTS = [
  { id: 'C1', x: 36.5, y: 53.5, label: 'TGBT 1', detail: 'Aval Masterpact 2500A NW25 H1 · SOCOMEC DIRIS A40 · Modbus RS485' },
  { id: 'C2', x: 42.5, y: 53.5, label: 'TGBT 2', detail: 'Aval Masterpact 3200A · SOCOMEC DIRIS A40 · Modbus RS485' },
  { id: 'C3', x: 35, y: 35, label: 'Usinage', detail: 'Départ NS 160H Usinage fèves · SOCOMEC DIRIS A40' },
  { id: 'C4', x: 55, y: 52, label: 'Séchoir', detail: 'Départ NS 100H Séchoir · SOCOMEC DIRIS A40' },
  { id: 'C5', x: 20, y: 70.5, label: 'Administration', detail: 'Départ NS 100H Administration · SOCOMEC DIRIS A40' },
  { id: 'C6', x: 80.5, y: 84.5, label: 'Gaz Séchoir', detail: 'Elster BK-G / Itron Gallus · M-Bus / Impulsion' },
]

type AccPointMetric = {
  label: string
  value: string
  trend: string
  status: 'ok' | 'watch' | 'alert'
}

const ACC_POINT_DETAIL_DATA: Record<string, { label: string; role: string; metrics: AccPointMetric[] }> = {
  C1: {
    label: 'TGBT 1',
    role: 'Alimentation générale ancien TGBT',
    metrics: [
      { label: 'Puissance active totale', value: '742 kW', trend: '+3,1 %', status: 'ok' },
      { label: 'Puissance réactive totale', value: '238 kvar', trend: '+1,8 %', status: 'ok' },
      { label: 'Tension L1-L2', value: '401 V', trend: 'stable', status: 'ok' },
      { label: 'Tension L2-L3', value: '399 V', trend: 'stable', status: 'ok' },
      { label: 'Tension L3-L1', value: '402 V', trend: 'stable', status: 'ok' },
      { label: 'Courant L1', value: '1 078 A', trend: '+2,4 %', status: 'watch' },
      { label: 'Courant L2', value: '1 041 A', trend: '+1,9 %', status: 'ok' },
      { label: 'Courant L3', value: '1 066 A', trend: '+2,2 %', status: 'ok' },
      { label: 'Facteur de puissance (cosφ)', value: '0,94', trend: '+0,01', status: 'ok' },
      { label: 'THD courant total', value: '4,2 %', trend: '+0,4 pt', status: 'watch' },
      { label: 'Énergie active import', value: '5 640 kWh', trend: '+0,7 %', status: 'ok' },
      { label: 'Énergie réactive import', value: '1 220 kvarh', trend: '+1,1 %', status: 'ok' },
      { label: 'Fréquence réseau', value: '50,02 Hz', trend: 'stable', status: 'ok' },
    ],
  },
  C2: {
    label: 'TGBT 2',
    role: 'Alimentation générale nouveau TGBT',
    metrics: [
      { label: 'Puissance active totale', value: '542 kW', trend: '-1,4 %', status: 'ok' },
      { label: 'Puissance réactive totale', value: '164 kvar', trend: '-0,8 %', status: 'ok' },
      { label: 'Tension L1-L2', value: '400 V', trend: 'stable', status: 'ok' },
      { label: 'Tension L2-L3', value: '398 V', trend: 'stable', status: 'ok' },
      { label: 'Tension L3-L1', value: '401 V', trend: 'stable', status: 'ok' },
      { label: 'Courant L1', value: '781 A', trend: '-1,2 %', status: 'ok' },
      { label: 'Courant L2', value: '796 A', trend: '-0,6 %', status: 'ok' },
      { label: 'Courant L3', value: '772 A', trend: '-1,9 %', status: 'ok' },
      { label: 'Facteur de puissance (cosφ)', value: '0,95', trend: '+0,02', status: 'ok' },
      { label: 'THD courant total', value: '3,7 %', trend: '-0,2 pt', status: 'ok' },
      { label: 'Énergie active import', value: '3 280 kWh', trend: '-0,5 %', status: 'ok' },
      { label: 'Énergie réactive import', value: '720 kvarh', trend: '+0,3 %', status: 'ok' },
      { label: 'Fréquence réseau', value: '50,01 Hz', trend: 'stable', status: 'ok' },
    ],
  },
  C3: {
    label: 'Usinage',
    role: 'Départ usinage fèves',
    metrics: [
      { label: 'Puissance active totale', value: '318 kW', trend: '+12,0 %', status: 'watch' },
      { label: 'Puissance réactive totale', value: '116 kvar', trend: '+8,4 %', status: 'watch' },
      { label: 'Tension L1-L2', value: '397 V', trend: '-0,6 %', status: 'ok' },
      { label: 'Tension L2-L3', value: '396 V', trend: '-0,7 %', status: 'ok' },
      { label: 'Tension L3-L1', value: '399 V', trend: '-0,3 %', status: 'ok' },
      { label: 'Courant L1', value: '462 A', trend: '+10,8 %', status: 'watch' },
      { label: 'Courant L2', value: '488 A', trend: '+13,1 %', status: 'watch' },
      { label: 'Courant L3', value: '451 A', trend: '+9,7 %', status: 'ok' },
      { label: 'Facteur de puissance (cosφ)', value: '0,91', trend: '-0,02', status: 'watch' },
      { label: 'THD courant total', value: '5,8 %', trend: '+1,1 pt', status: 'watch' },
      { label: 'Énergie active import', value: '1 760 kWh', trend: '+12,0 %', status: 'watch' },
      { label: 'Énergie réactive import', value: '392 kvarh', trend: '+8,7 %', status: 'watch' },
      { label: 'Fréquence réseau', value: '50,00 Hz', trend: 'stable', status: 'ok' },
    ],
  },
  C4: {
    label: 'Séchoir',
    role: 'Départ séchoir thermique',
    metrics: [
      { label: 'Puissance active totale', value: '286 kW', trend: '+2,3 %', status: 'ok' },
      { label: 'Puissance réactive totale', value: '84 kvar', trend: '+1,0 %', status: 'ok' },
      { label: 'Tension L1-L2', value: '400 V', trend: 'stable', status: 'ok' },
      { label: 'Tension L2-L3', value: '401 V', trend: 'stable', status: 'ok' },
      { label: 'Tension L3-L1', value: '399 V', trend: 'stable', status: 'ok' },
      { label: 'Courant L1', value: '414 A', trend: '+1,9 %', status: 'ok' },
      { label: 'Courant L2', value: '406 A', trend: '+1,4 %', status: 'ok' },
      { label: 'Courant L3', value: '421 A', trend: '+2,1 %', status: 'ok' },
      { label: 'Facteur de puissance (cosφ)', value: '0,96', trend: '+0,01', status: 'ok' },
      { label: 'THD courant total', value: '3,2 %', trend: '-0,1 pt', status: 'ok' },
      { label: 'Énergie active import', value: '2 120 kWh', trend: '+2,5 %', status: 'ok' },
      { label: 'Énergie réactive import', value: '438 kvarh', trend: '+1,2 %', status: 'ok' },
      { label: 'Fréquence réseau', value: '50,01 Hz', trend: 'stable', status: 'ok' },
    ],
  },
  C5: {
    label: 'Administration',
    role: 'Départ bâtiment administratif',
    metrics: [
      { label: 'Puissance active totale', value: '74 kW', trend: '-3,6 %', status: 'ok' },
      { label: 'Puissance réactive totale', value: '21 kvar', trend: '-2,1 %', status: 'ok' },
      { label: 'Tension L1-L2', value: '402 V', trend: 'stable', status: 'ok' },
      { label: 'Tension L2-L3', value: '401 V', trend: 'stable', status: 'ok' },
      { label: 'Tension L3-L1', value: '403 V', trend: '+0,2 %', status: 'ok' },
      { label: 'Courant L1', value: '106 A', trend: '-2,7 %', status: 'ok' },
      { label: 'Courant L2', value: '112 A', trend: '-3,1 %', status: 'ok' },
      { label: 'Courant L3', value: '109 A', trend: '-2,4 %', status: 'ok' },
      { label: 'Facteur de puissance (cosφ)', value: '0,97', trend: '+0,01', status: 'ok' },
      { label: 'THD courant total', value: '2,9 %', trend: '-0,3 pt', status: 'ok' },
      { label: 'Énergie active import', value: '620 kWh', trend: '-1,8 %', status: 'ok' },
      { label: 'Énergie réactive import', value: '124 kvarh', trend: '-1,1 %', status: 'ok' },
      { label: 'Fréquence réseau', value: '50,02 Hz', trend: 'stable', status: 'ok' },
    ],
  },
  C6: {
    label: 'Gaz Séchoir',
    role: 'Compteur gaz communicant du séchoir',
    metrics: [
      { label: 'Puissance active totale', value: 'N/A', trend: 'gaz', status: 'ok' },
      { label: 'Puissance réactive totale', value: 'N/A', trend: 'gaz', status: 'ok' },
      { label: 'Tension L1-L2', value: 'N/A', trend: 'gaz', status: 'ok' },
      { label: 'Tension L2-L3', value: 'N/A', trend: 'gaz', status: 'ok' },
      { label: 'Tension L3-L1', value: 'N/A', trend: 'gaz', status: 'ok' },
      { label: 'Courant L1', value: 'N/A', trend: 'gaz', status: 'ok' },
      { label: 'Courant L2', value: 'N/A', trend: 'gaz', status: 'ok' },
      { label: 'Courant L3', value: 'N/A', trend: 'gaz', status: 'ok' },
      { label: 'Facteur de puissance (cosφ)', value: 'N/A', trend: 'gaz', status: 'ok' },
      { label: 'THD courant total', value: 'N/A', trend: 'gaz', status: 'ok' },
      { label: 'Énergie active import', value: '410 m³', trend: '+6,8 %', status: 'watch' },
      { label: 'Énergie réactive import', value: 'N/A', trend: 'gaz', status: 'ok' },
      { label: 'Fréquence réseau', value: 'N/A', trend: 'gaz', status: 'ok' },
    ],
  },
}

type SingleLineNode = {
  id: string
  label: string
  subtitle: string
  type: 'source' | 'breaker' | 'busbar' | 'feeder' | 'meter' | 'load'
  x: number
  y: number
  w: number
  h: number
  detail: string
  meter?: string
}

const ACC_REFERENCE_SCHEMA_NODES: SingleLineNode[] = [
  { id: 'cie', label: 'Poste de livraison CIE', subtitle: '630 kVA', type: 'source', x: 1.5, y: 4, w: 18, h: 9, detail: 'Poste de livraison CIE 630 kVA en amont de la distribution ACC.' },
  { id: 'transformer', label: 'Transformateur', subtitle: 'Couplage amont', type: 'source', x: 23.5, y: 11, w: 7, h: 13, detail: 'Symbole de transformation avant répartition vers les deux TGBT.' },
  { id: 'c1', label: 'C1', subtitle: 'Masterpact 2500A - TGBT 1', type: 'meter', x: 11, y: 28, w: 7, h: 6, detail: 'Compteur général C1 positionné sur le Masterpact 2500A - TGBT 1.', meter: 'C1' },
  { id: 'c2', label: 'C2', subtitle: 'Masterpact 3200A - TGBT 2', type: 'meter', x: 34.5, y: 28, w: 7, h: 6, detail: 'Compteur général C2 positionné sur le Masterpact 3200A - TGBT 2.', meter: 'C2' },
  { id: 'mp-tgbt1', label: 'Masterpact 2500A - TGBT 1', subtitle: 'Barre principale gauche', type: 'breaker', x: 2.5, y: 38, w: 26, h: 7, detail: 'Arrivée TGBT 1 ciblée par C1. Départ critique associé à l\'usinage fèves.' },
  { id: 'mp-tgbt2', label: 'Masterpact 3200A - TGBT 2', subtitle: 'Barre principale droite', type: 'breaker', x: 31.5, y: 38, w: 28, h: 7, detail: 'Arrivée TGBT 2 ciblée par C2. Départs séchoir, administration et gaz séchoir représentés.' },
  { id: 'target-zone', label: 'Zones cibles', subtitle: 'Process et Utilités', type: 'load', x: 2.5, y: 55, w: 58, h: 27, detail: 'Périmètre EMS cible: les TGBT C1/C2 et les départs névralgiques C3 à C6 pour une supervision granulaire multi-énergies.' },
  { id: 'c3', label: 'C3', subtitle: 'Usinage fèves', type: 'feeder', x: 8, y: 72, w: 8, h: 6, detail: 'Départ usinage fèves en aval du Masterpact 2500A - TGBT 1.', meter: 'C3' },
  { id: 'c4', label: 'C4', subtitle: 'Séchoir', type: 'feeder', x: 28, y: 72, w: 8, h: 6, detail: 'Départ séchoir en aval du TGBT 2, comptage électrique du process thermique.', meter: 'C4' },
  { id: 'c5', label: 'C5', subtitle: 'Administration', type: 'feeder', x: 40, y: 72, w: 8, h: 6, detail: 'Depart administration, suivi tertiaire et bureaux.', meter: 'C5' },
  { id: 'c6', label: 'C6', subtitle: 'Compteur gaz séchoir', type: 'meter', x: 52, y: 72, w: 8, h: 6, detail: 'Compteur gaz communicant du séchoir, intégré au suivi multi-énergies.', meter: 'C6' },
]

function AccGlobalDashboard() {
  const dateFilter = useDateFilter()

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-6 gap-3">
        {ACC_DASHBOARD_METRICS.map((metric) => (
          <article
            key={metric.label}
            className={`min-h-[172px] rounded-xl border border-gray-200 border-t-4 ${metric.border} bg-white p-4 shadow-sm`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-base font-semibold uppercase tracking-widest text-black">{metric.label}</p>
                <div className="mt-2 flex items-end gap-1">
                  <p className={`text-3xl font-bold leading-none ${metric.accent}`}>{metric.value}</p>
                  {metric.unit && <span className="pb-0.5 text-base font-bold text-black">{metric.unit}</span>}
                </div>
              </div>
              <Icon name={metric.icon} className="h-5 w-5 text-black/50" />
            </div>

            <div className="mt-4">
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${metric.bar > 100 ? 'bg-red-600' : metric.bar > 75 ? 'bg-amber-600' : 'bg-emerald-600'}`}
                  style={{ width: `${Math.min(metric.bar, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-base font-medium text-black">{metric.detail}</p>
            </div>

            {metric.spark ? (
              <div className="mt-4 flex h-8 items-end gap-1.5">
                {metric.spark.map((value, index) => (
                  <span
                    key={`${metric.label}-${index}`}
                    className={`w-4 rounded-t ${index === metric.spark.length - 1 ? 'bg-[#23689b]' : 'bg-[#b7d4eb]'}`}
                    style={{ height: `${Math.max(8, value / 1.3)}%` }}
                  />
                ))}
              </div>
            ) : metric.badge ? (
              <span className={`mt-4 inline-flex rounded-md px-2 py-1 text-base font-bold ${metric.bar > 100 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {metric.badge}
              </span>
            ) : null}
          </article>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-black">Points de mesure ACC — Statut temps réel</h2>
            <p className="mt-1 text-base text-black/70">Vue synthétique sur la période active : {dateFilter.label}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-base font-bold text-emerald-700">4 OK</span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-base font-bold text-amber-700">2 à surveiller</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {ACC_POINT_STATUS.map((point) => (
            <article
              key={point.ref}
              className={`rounded-xl border border-gray-200 ${point.border} border-l-4 bg-[#fbfaf4] p-4 shadow-sm`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${point.iconTone}`}>
                    <Icon name={point.icon} className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-bold text-black">{point.label}</p>
                      <span className="rounded-md bg-white/80 px-2 py-0.5 text-base font-semibold text-black/70">
                        {point.meterType}
                      </span>
                    </div>
                    <p className="mt-2 text-base font-semibold uppercase tracking-widest text-black/70">{point.grandeur}</p>
                    <div className="mt-1 flex items-end gap-1.5">
                      <p className="text-3xl font-bold text-black">{point.value}</p>
                      <span className="pb-0.5 text-base font-bold text-black">{point.unit}</span>
                    </div>
                  </div>
                </div>
                <span className={`rounded-md px-2 py-1 font-mono text-base font-bold ${point.badge}`}>{point.ref}</span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                <div className={`h-full rounded-full ${point.color}`} style={{ width: `${point.bar}%` }} />
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-base">
                <span className="font-medium text-black">{point.detail}</span>
                {point.status !== 'OK' && <span className="font-bold text-amber-700">Surveiller</span>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
function IndustrialGlobalDashboard({ site }: { site: SiteConfig }) {
  const data = INDUSTRIAL_SITE_DATA[site.slug]
  const dateFilter = useDateFilter()

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-base text-blue-900">
        Données agrégées sur la période active : <span className="font-semibold">{dateFilter.label}</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {data.metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-base font-medium uppercase tracking-wider text-black">{metric.label}</p>
              <Icon name={metric.icon} className="h-4 w-4 text-black" />
            </div>
            <p className={`mt-3 text-base font-bold ${metric.accent}`}>{metric.value}</p>
            <p className="mt-1 text-base text-black">{metric.detail}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${metric.bar > 95 ? 'bg-red-500' : metric.bar > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(metric.bar, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-black">Supervision {site.name}</p>
              <p className="mt-0.5 text-base text-black">Points critiques, utilitÃ©s et dÃ©parts process</p>
            </div>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-base font-semibold text-amber-700">
              {data.points.filter((point) => point.status !== 'OK').length} Ã  surveiller
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {data.points.map((point) => (
              <div key={point.ref} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-black">{point.ref}</span>
                  <span className={`h-2 w-2 rounded-full ${point.color}`} />
                </div>
                <p className="mt-2 text-base font-semibold text-black">{point.label}</p>
                <div className="mt-1 flex items-center justify-between text-base">
                  <span className="text-black">{point.status}</span>
                  <span className="font-semibold text-black">{point.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-base font-semibold text-black">RÃ©partition usages</p>
          <p className="mt-0.5 text-base text-black">Part Ã©nergie jour par famille</p>
          <div className="mt-5 space-y-4">
            {data.profile.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-base">
                  <span className="font-medium text-black">{item.label}</span>
                  <span className="font-semibold text-black">{item.value} %</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-base font-semibold text-black">QualitÃ© rÃ©seau</p>
          <div className="mt-4 space-y-3 text-base">
            {data.quality.map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-black">{item.label}</span>
                <span className={`font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-base font-semibold text-black">Seuils d&apos;utilisation</p>
          <div className="mt-4 space-y-3 text-base">
            <div className="flex justify-between"><span className="text-black">Puissance</span><span className="font-semibold text-amber-700">{data.metrics[0].bar} %</span></div>
            <div className="flex justify-between"><span className="text-black">Ã‰nergie jour</span><span className="font-semibold text-emerald-700">{data.metrics[1].bar} %</span></div>
            <div className="flex justify-between"><span className="text-black">{site.slug === 'scci-1' ? 'Carburant' : 'Gaz'}</span><span className="font-semibold text-amber-700">{data.metrics[2].bar} %</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-base font-semibold text-black">Alertes {site.name}</p>
          <div className="mt-4 space-y-3 text-base">
            {data.alerts.map((alert) => (
              <div key={alert} className="rounded-lg border border-amber-100 bg-amber-50 p-2 text-amber-800">{alert}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function IndustrialKpiDashboard({ site }: { site: SiteConfig }) {
  const data = INDUSTRIAL_SITE_DATA[site.slug]
  const dateFilter = useDateFilter()
  const okCount = data.kpis.filter((kpi) => kpi.status === 'ok').length

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-semibold uppercase tracking-widest text-black">Vue KPI {site.name}</p>
            <h2 className="mt-2 text-base font-bold text-black">Performance Ã©nergÃ©tique cimenterie</h2>
            <p className="mt-1 text-base text-black">DonnÃ©es factices croisÃ©es compteurs, ERP production et seuils ISO 50001 Â· {dateFilter.label}.</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
            <p className="text-base font-semibold uppercase tracking-widest text-emerald-700">KPI tenus</p>
            <p className="mt-1 text-base font-bold text-emerald-800">{okCount}/{data.kpis.length}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-4 gap-4">
        {data.kpis.map((kpi) => {
          const statusClass =
            kpi.status === 'ok' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
            kpi.status === 'watch' ? 'border-amber-200 bg-amber-50 text-amber-700' :
            'border-red-200 bg-red-50 text-red-700'
          return (
            <article key={kpi.label} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-base font-semibold leading-snug text-black">{kpi.label}</p>
                <span className={`rounded-full border px-2 py-0.5 text-base font-bold ${statusClass}`}>
                  {kpi.status === 'ok' ? 'OK' : kpi.status === 'watch' ? 'Surveiller' : 'Alerte'}
                </span>
              </div>
              <p className="mt-5 text-base font-bold text-black">{kpi.value}</p>
              <div className="mt-2 flex items-center justify-between text-base">
                <span className="text-black">Objectif {kpi.target}</span>
                <span className={kpi.status === 'ok' ? 'font-bold text-emerald-700' : 'font-bold text-amber-700'}>{kpi.gap}</span>
              </div>
              <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-base font-semibold uppercase tracking-widest text-black">Formule</p>
                <p className="mt-1 text-base leading-relaxed text-black">{kpi.formula}</p>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}

function IndustrialZoneDashboard({ site, tab, zone }: { site: SiteConfig; tab: SiteTab; zone: Zone }) {
  const data = INDUSTRIAL_SITE_DATA[site.slug]
  const accent = TAG_STYLE[site.name] ?? { bg: '#f3f4f6', text: '#374151' }
  const dateFilter = useDateFilter()

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base font-bold"
              style={{ background: zone.bgColor, color: zone.textColor }}
            >
              {zone.letter}
            </span>
            <div>
              <p className="text-base font-semibold uppercase tracking-widest text-black">{tab.label} Â· {site.name} Â· {dateFilter.label}</p>
              <h2 className="mt-1 text-base font-bold text-black">{zone.name}</h2>
            </div>
          </div>
          <span className="rounded-full px-2.5 py-1 text-base font-semibold" style={{ background: accent.bg, color: accent.text }}>
            {site.fullName}
          </span>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-4">
        {zone.items.slice(0, 6).map((item, index) => (
          <article key={`${item.text}-${index}`} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-black">
                <Icon name={item.icon} className="h-4 w-4" />
              </span>
              <div>
                <p className="text-base font-semibold leading-snug text-black">{item.text}</p>
                <p className="mt-2 text-base text-black">
                  Valeur simulÃ©e: {index % 3 === 0 ? data.metrics[0].value : index % 3 === 1 ? data.metrics[1].value : data.quality[0].value}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-base font-semibold text-black">Points associÃ©s</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {data.points.slice(0, 4).map((point) => (
              <div key={point.ref} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-black">{point.ref}</span>
                  <span className={`h-2 w-2 rounded-full ${point.color}`} />
                </div>
                <p className="mt-2 text-base font-semibold text-black">{point.label}</p>
                <p className="mt-1 text-base text-black">{point.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-base font-semibold text-black">Profil zone</p>
          <div className="mt-4 space-y-4">
            {data.profile.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-base">
                  <span className="font-medium text-black">{item.label}</span>
                  <span className="font-semibold text-black">{item.value} %</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function formatAccKpiValue(value: number, unit: string) {
  const fractionDigits = unit === '' ? 2 : 1
  const formatted = value.toLocaleString('fr-FR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })

  return unit ? `${formatted} ${unit}` : formatted
}

function getAccKpiGap(kpi: (typeof ACC_KPIS)[number]) {
  const gap = ((kpi.value - kpi.target) / kpi.target) * 100
  const isPositive = kpi.higherIsBetter ? gap >= 0 : gap <= 0
  const prefix = gap > 0 ? '+' : ''

  return {
    text: `${prefix}${gap.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %`,
    color: isPositive ? 'text-emerald-700' : 'text-red-700',
  }
}


function AccKpiDashboard() {
  const dateFilter = useDateFilter()
  const kpiScore = Math.round(
    (ACC_KPIS.filter((kpi) => {
      const ratio = kpi.value / kpi.target
      return kpi.higherIsBetter ? ratio >= 0.9 : ratio <= 1.08
    }).length / ACC_KPIS.length) * 100
  )
  const visibleKpis = ACC_KPIS.filter((kpi) => kpi.label !== 'PUE Process (ratio usages)')
  const sourceCards = [
    { label: 'Énergie totale', value: '8 920 kWh' },
    { label: 'Cacao traité', value: '110,3 t' },
    { label: 'Tonnage séché', value: '47,8 t' },
    { label: 'Tonnage usiné', value: '54,2 t' },
    { label: 'Gaz séchoir', value: '410 m³' },
  ]

  function cardStatus(kpi: (typeof ACC_KPIS)[number]) {
    const gap = ((kpi.value - kpi.target) / kpi.target) * 100
    const isBetter = kpi.higherIsBetter ? gap >= 0 : gap <= 0

    if (isBetter) {
      return {
        label: 'Objectif tenu',
        badge: 'bg-emerald-50 text-emerald-800',
        border: 'border-t-emerald-500',
        value: 'text-emerald-700',
        bar: 'bg-emerald-500',
        marker: 'bg-[#23689b]',
      }
    }

    if (kpi.label.includes('gaz')) {
      return {
        label: 'À surveiller',
        badge: 'bg-amber-50 text-amber-800',
        border: 'border-t-amber-600',
        value: 'text-amber-700',
        bar: 'bg-amber-600',
        marker: 'bg-[#23689b]',
      }
    }

    return {
      label: 'Hors objectif',
      badge: 'bg-red-50 text-red-800',
      border: 'border-t-red-500',
      value: 'text-red-700',
      bar: 'bg-red-500',
      marker: 'bg-[#23689b]',
    }
  }

  function progressFor(kpi: (typeof ACC_KPIS)[number]) {
    if (kpi.higherIsBetter) return Math.min((kpi.value / kpi.target) * 100, 100)
    return Math.min((kpi.target / kpi.value) * 100, 100)
  }

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-[1fr_200px] gap-4">
        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-black">Vue KPI ACC — Performance énergétique par tonne produite</h2>
              <p className="mt-1 text-base text-black/70">Sources C1 à C6 et tonnages ERP · {dateFilter.label}</p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {sourceCards.map((source) => (
              <div key={source.label} className="rounded-xl border border-gray-100 bg-[#fbfaf4] p-4">
                <p className="text-base font-semibold uppercase tracking-widest text-black">{source.label}</p>
                <p className="mt-3 text-2xl font-bold text-black">{source.value}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <p className="text-base font-semibold uppercase tracking-widest text-black">Score KPI global</p>
          <div className="relative mx-auto mt-5 h-24 w-24">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="36" fill="none" stroke="#f3ead9" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#b7790b"
                strokeLinecap="round"
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - kpiScore / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-700">{kpiScore}%</span>
            </div>
          </div>
          <p className="mt-3 text-base font-medium text-black">Objectif &gt; 90%</p>
          <span className="mt-3 inline-flex rounded-md bg-amber-50 px-4 py-2 text-base font-bold text-amber-800">À améliorer</span>
        </aside>
      </section>

      <section className="grid grid-cols-3 gap-4">
        {visibleKpis.map((kpi) => {
          const status = cardStatus(kpi)
          const gap = getAccKpiGap(kpi)
          const progress = progressFor(kpi)
          const targetPosition = Math.min(Math.max((kpi.target / Math.max(kpi.value, kpi.target)) * 100, 8), 96)

          return (
            <article key={kpi.label} className={`rounded-xl border border-gray-200 border-t-4 ${status.border} bg-white p-5 shadow-sm`}>
              <div className="flex min-h-[58px] items-start justify-between gap-4">
                <h3 className="max-w-[58%] text-lg font-bold leading-tight text-black">{kpi.label}</h3>
                <span className={`rounded-md px-3 py-2 text-base font-bold ${status.badge}`}>{status.label}</span>
              </div>

              <div className="mt-4 flex items-end gap-2">
                <p className={`text-3xl font-bold leading-none ${status.value}`}>
                  {kpi.value.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </p>
                <span className="pb-0.5 text-base font-bold text-black">{kpi.unit}</span>
              </div>

              <div className="mt-4 grid grid-cols-3 items-end text-base">
                <span className="font-medium text-black">Réalisé</span>
                <span className={`text-center font-bold ${gap.color}`}>{gap.text}</span>
                <span className="text-right font-medium text-black">Cible</span>
              </div>
              <div className="relative mt-2 h-3 rounded-full bg-gray-100">
                <div className={`h-full rounded-full ${status.bar}`} style={{ width: `${progress}%` }} />
                <span
                  className={`absolute top-[-4px] h-5 w-1.5 rounded-full ${status.marker}`}
                  style={{ left: `${targetPosition}%` }}
                />
              </div>

              <p className="mt-3 text-base leading-snug text-black">
                Objectif {formatAccKpiValue(kpi.target, kpi.unit)} · Formule : {kpi.formula}
              </p>
            </article>
          )
        })}
      </section>
    </div>
  )
}
function AccPointDetailDashboard({ zone }: { zone: Zone }) {
  const dateFilter = useDateFilter()
  const meterId = zone.name.match(/C\d/)?.[0] ?? 'C1'
  const meter = ACC_POINT_DETAIL_DATA[meterId] ?? ACC_POINT_DETAIL_DATA.C1
  const metricAt = (index: number) => meter.metrics[index]
  const splitValue = (value: string) => {
    if (value === 'N/A') return { main: value, unit: '' }
    const match = value.match(/^(.+?)\s+([^\s]+)$/)
    return match ? { main: match[1], unit: match[2] } : { main: value, unit: '' }
  }
  const imbalanceByMeter: Record<string, string> = {
    C1: '1,8 %',
    C2: '1,5 %',
    C3: '4,1 %',
    C4: '2,2 %',
    C5: '1,9 %',
    C6: 'N/A',
  }
  const energyBudgetByMeter: Record<string, string> = {
    C1: '63% budget',
    C2: '37% budget',
    C3: '80% seuil',
    C4: '50% budget',
    C5: '7% énergie',
    C6: '76% seuil',
  }
  const cards = [
    { title: 'PUISSANCE ACTIVE TOTALE', metric: metricAt(0), footer: 'Variation', right: metricAt(0).trend, bar: 62 },
    { title: 'PUISSANCE RÉACTIVE TOTALE', metric: metricAt(1), footer: 'Variation', right: metricAt(1).trend, bar: 38 },
    { title: 'FACTEUR DE PUISSANCE COS φ', metric: metricAt(8), footer: 'Seuil min 0,85', right: metricAt(8).value === 'N/A' ? 'N/A' : 'OK', bar: 96 },
    { title: 'TENSION L1-L2', metric: metricAt(2), footer: 'Ref 400V ±5%', right: metricAt(2).trend, bar: 84 },
    { title: 'TENSION L2-L3', metric: metricAt(3), footer: 'Ref 400V ±5%', right: metricAt(3).trend, bar: 83 },
    { title: 'TENSION L3-L1', metric: metricAt(4), footer: 'Ref 400V ±5%', right: metricAt(4).trend, bar: 85 },
    { title: 'COURANT L1', metric: metricAt(5), footer: 'Seuil 1200A', right: metricAt(5).trend, bar: 90 },
    { title: 'COURANT L2', metric: metricAt(6), footer: 'Seuil 1200A', right: metricAt(6).trend, bar: 87 },
    { title: 'COURANT L3', metric: metricAt(7), footer: 'Seuil 1200A', right: metricAt(7).trend, bar: 89 },
    { title: 'DÉSÉQUILIBRE COURANT', customValue: imbalanceByMeter[meterId] ?? '1,8 %', status: meterId === 'C3' ? 'watch' : 'ok', footer: 'Seuil max 5%', right: meterId === 'C3' ? 'Surveiller' : 'Normal', bar: meterId === 'C3' ? 82 : 24 },
    { title: 'ÉNERGIE ACTIVE (INDEX)', metric: metricAt(10), footer: 'Journée', right: energyBudgetByMeter[meterId] ?? '63% budget', bar: meterId === 'C3' ? 80 : meterId === 'C6' ? 76 : 63 },
    { title: 'THD TENSION (L1)', customValue: meterId === 'C6' ? 'N/A' : meterId === 'C3' ? '5,8 %' : '2,4 %', status: meterId === 'C3' ? 'watch' : 'ok', footer: 'Seuil max 8%', right: meterId === 'C3' ? 'Surveiller' : 'Normal', bar: meterId === 'C3' ? 72 : 30 },
  ]

  return (
    <div className="space-y-4">
      <section className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-base font-bold"
            style={{ background: zone.bgColor, color: zone.textColor }}
          >
            {meterId}
          </span>
          <div>
            <p className="text-base font-semibold uppercase tracking-widest text-black">Détail par point · {dateFilter.label}</p>
            <h2 className="mt-1 text-xl font-bold text-black">{meter.label}</h2>
            <p className="mt-0.5 text-base font-medium text-black/70">{meter.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-base font-bold text-emerald-700">En ligne</span>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-base font-bold text-black">
            {meterId === 'C6' ? 'M-Bus / Impulsion' : 'Modbus RS485'}
          </span>
        </div>
      </section>

      {meterId === 'C6' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-base font-medium text-amber-800">
          C6 est un compteur gaz : les grandeurs électriques non applicables restent affichées pour conserver la même grille de supervision.
        </div>
      )}

      <section className="grid grid-cols-3 gap-3">
        {cards.map((card) => {
          const metric = card.metric
          const status = card.status ?? metric?.status ?? 'ok'
          const value = splitValue(card.customValue ?? metric?.value ?? 'N/A')
          const isWatch = status === 'watch'
          const isAlert = status === 'alert'
          const border = isAlert ? 'border-l-red-500' : isWatch ? 'border-l-amber-500' : 'border-l-emerald-500'
          const valueColor = isAlert ? 'text-red-700' : isWatch ? 'text-amber-700' : card.title.includes('TENSION') ? 'text-black' : 'text-emerald-700'
          const barColor = isAlert ? 'bg-red-500' : isWatch ? 'bg-amber-600' : card.title.includes('PUISSANCE') || card.title.includes('ÉNERGIE') ? 'bg-[#23689b]' : 'bg-emerald-500'
          const rightColor = isAlert ? 'text-red-700' : isWatch ? 'text-amber-700' : 'text-emerald-700'

          return (
            <article key={card.title} className={`min-h-[124px] rounded-xl border border-gray-100 ${border} border-l-4 bg-[#fbfaf4] p-4 shadow-sm`}>
              <p className="min-h-[34px] text-base font-semibold uppercase tracking-widest text-black/80">{card.title}</p>
              <div className="mt-2 flex items-end gap-2">
                <p className={`font-mono text-3xl font-bold leading-none ${valueColor}`}>{value.main}</p>
                {value.unit && <span className="pb-0.5 text-base font-bold text-black">{value.unit}</span>}
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${card.bar}%` }} />
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-base">
                <span className="font-medium text-black">{card.footer}</span>
                <span className={`font-bold ${rightColor}`}>{card.right}</span>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
function AccSingleLineCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState('target-zone')
  const selectedNode =
    ACC_REFERENCE_SCHEMA_NODES.find((node) => node.id === selectedId) ??
    ACC_REFERENCE_SCHEMA_NODES.find((node) => node.id === 'target-zone') ??
    ACC_REFERENCE_SCHEMA_NODES[0]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(rect.height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const width = rect.width
    const height = rect.height
    const px = (value: number) => (value / 100) * width
    const py = (value: number) => (value / 100) * height
    const isActive = (id: string) => id === selectedId || id === hoveredId

    const drawLine = (points: Array<[number, number]>, options: { width?: number; color?: string; dash?: number[] } = {}) => {
      ctx.save()
      ctx.strokeStyle = options.color ?? '#111827'
      ctx.lineWidth = options.width ?? 3
      ctx.lineCap = 'square'
      ctx.lineJoin = 'miter'
      if (options.dash) ctx.setLineDash(options.dash)
      ctx.beginPath()
      points.forEach(([x, y], index) => {
        if (index === 0) ctx.moveTo(px(x), py(y))
        else ctx.lineTo(px(x), py(y))
      })
      ctx.stroke()
      ctx.restore()
    }

    const drawLabel = (text: string, x: number, y: number, options: { size?: number; weight?: number; color?: string; align?: CanvasTextAlign; rotate?: boolean } = {}) => {
      ctx.save()
      ctx.fillStyle = options.color ?? '#111827'
      ctx.font = `${options.weight ?? 700} ${Math.max(9, (options.size ?? 14) * Math.min(width / 1100, 1.15))}px Arial`
      ctx.textAlign = options.align ?? 'center'
      ctx.textBaseline = 'middle'
      if (options.rotate) {
        ctx.translate(px(x), py(y))
        ctx.rotate(-Math.PI / 2)
        ctx.fillText(text, 0, 0)
      } else {
        ctx.fillText(text, px(x), py(y))
      }
      ctx.restore()
    }

    const drawChip = (text: string, x: number, y: number, options: { pointer?: 'left' | 'right' | 'none'; active?: boolean } = {}) => {
      const chipWidth = px(5.8)
      const chipHeight = py(5.2)
      const left = px(x)
      const top = py(y)
      const radius = Math.min(10, chipHeight / 3)

      ctx.save()
      if (options.active) {
        ctx.shadowColor = 'rgba(16, 185, 129, 0.45)'
        ctx.shadowBlur = 16
      }
      ctx.fillStyle = '#7bd99c'
      ctx.strokeStyle = options.active ? '#047857' : '#65c98a'
      ctx.lineWidth = options.active ? 2.5 : 1.5
      ctx.beginPath()
      ctx.roundRect(left, top, chipWidth, chipHeight, radius)
      ctx.fill()
      ctx.stroke()

      if (options.pointer === 'right') {
        ctx.beginPath()
        ctx.moveTo(left + chipWidth - 2, top + chipHeight * 0.25)
        ctx.lineTo(left + chipWidth + px(2.5), top + chipHeight * 0.5)
        ctx.lineTo(left + chipWidth - 2, top + chipHeight * 0.75)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }
      if (options.pointer === 'left') {
        ctx.beginPath()
        ctx.moveTo(left + 2, top + chipHeight * 0.25)
        ctx.lineTo(left - px(2.5), top + chipHeight * 0.5)
        ctx.lineTo(left + 2, top + chipHeight * 0.75)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }

      ctx.fillStyle = '#073b26'
      ctx.font = `800 ${Math.max(12, 18 * Math.min(width / 1100, 1.1))}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, left + chipWidth / 2, top + chipHeight / 2 + 1)
      ctx.restore()
    }

    const drawDisconnect = (x: number, y: number) => {
      ctx.save()
      ctx.strokeStyle = '#111827'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(px(x - 0.6), py(y - 1.1))
      ctx.lineTo(px(x + 0.5), py(y - 0.2))
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(px(x - 0.8), py(y - 1.25), 2.3, 0, Math.PI * 2)
      ctx.arc(px(x + 0.8), py(y + 0.15), 2.3, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }

    const drawBreakerCoil = (x: number, y: number) => {
      ctx.save()
      ctx.strokeStyle = '#111827'
      ctx.lineWidth = 2
      for (let i = 0; i < 4; i += 1) {
        ctx.beginPath()
        ctx.moveTo(px(x - 0.4), py(y + i * 0.45))
        ctx.lineTo(px(x + 0.4), py(y + i * 0.45 - 0.2))
        ctx.stroke()
      }
      ctx.restore()
    }

    const drawFactory = () => {
      ctx.save()
      ctx.globalAlpha = 0.72
      ctx.strokeStyle = '#cbd5e1'
      ctx.fillStyle = 'rgba(248, 250, 252, 0.45)'
      ctx.lineWidth = 1.2

      const cylinder = (x: number, y: number, w: number, h: number) => {
        ctx.beginPath()
        ctx.ellipse(px(x + w / 2), py(y), px(w / 2), py(1.4), 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(px(x), py(y))
        ctx.lineTo(px(x), py(y + h))
        ctx.ellipse(px(x + w / 2), py(y + h), px(w / 2), py(1.4), 0, 0, Math.PI)
        ctx.lineTo(px(x + w), py(y))
        ctx.stroke()
      }

      drawLine([[56, 42], [68, 32], [98, 42], [86, 55], [56, 42]], { width: 1, color: '#d1d5db' })
      for (let i = 0; i < 4; i += 1) cylinder(67 + i * 4, 9 + i * 1.5, 5.2, 16)
      cylinder(92, 22, 5.8, 20)

      ctx.strokeRect(px(79), py(4), px(6), py(24))
      for (let i = 0; i < 5; i += 1) {
        ctx.beginPath()
        ctx.moveTo(px(79), py(8 + i * 4))
        ctx.lineTo(px(85), py(6 + i * 4))
        ctx.stroke()
      }
      drawLine([[58, 28], [70, 16], [78, 15]], { width: 1.2, color: '#cbd5e1' })
      drawLine([[83, 25], [92, 36], [95, 34]], { width: 1.2, color: '#cbd5e1' })
      drawLine([[69, 48], [78, 55], [93, 48]], { width: 1.2, color: '#cbd5e1' })

      ctx.strokeRect(px(76), py(31), px(8), py(7))
      ctx.strokeRect(px(88), py(47), px(10), py(12))
      ctx.strokeRect(px(66), py(43), px(5), py(10))
      cylinder(73, 40, 4.5, 10)
      cylinder(69, 36, 4, 11)
      cylinder(64, 33, 4, 12)

      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(255, 255, 255, 0.68)'
      ctx.fillRect(px(53), 0, px(47), py(63))
      ctx.restore()
    }

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    drawFactory()

    ctx.save()
    ctx.fillStyle = '#cfefd8'
    ctx.fillRect(0, py(90), width, py(10))
    ctx.restore()

    drawLabel('Poste de livraison', 9.6, 4.9, { size: 19, weight: 700 })
    drawLabel('CIE 630 kVA', 9.6, 9.1, { size: 18, weight: 700 })
    drawLine([[18.5, 6], [25.7, 6], [25.7, 14]], { width: 4 })

    ctx.save()
    ctx.strokeStyle = '#111827'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(px(25.7), py(18), px(3.1), 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(px(25.7), py(23), px(3.1), 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    drawLine([[25.7, 26], [25.7, 30.5], [17.5, 30.5], [17.5, 45], [34, 45], [34, 30.5], [25.7, 30.5]], { width: 3 })
    drawLine([[2.5, 45], [22.5, 45]], { width: 4 })
    drawLine([[28, 45], [59, 45]], { width: 4 })
    drawLabel('Masterpact 2500A - TGBT 1', 13.5, 41.8, { size: 17, weight: 800 })
    drawLabel('Masterpact 3200A - TGBT 2', 45, 41.8, { size: 17, weight: 800 })

    drawChip('C1', 12, 32, { pointer: 'right', active: isActive('c1') })
    drawChip('C2', 36, 32, { pointer: 'left', active: isActive('c2') })
    drawBreakerCoil(17.5, 36.4)
    drawBreakerCoil(34, 36.4)

    ctx.save()
    ctx.strokeStyle = isActive('target-zone') ? '#059669' : '#6ee7a8'
    ctx.lineWidth = isActive('target-zone') ? 3.5 : 3
    ctx.beginPath()
    ctx.roundRect(px(2.7), py(56), px(60), py(27), 8)
    ctx.stroke()
    ctx.restore()

    drawLine([[9.5, 45], [9.5, 51], [9.5, 67]], { width: isActive('c3') ? 3.5 : 3 })
    drawDisconnect(9.5, 51)
    drawBreakerCoil(9.5, 56)
    drawLabel('Usinage fèves', 9.5, 63, { size: 13, weight: 700, rotate: true })
    drawChip('C3', 7.2, 75.8, { pointer: 'none', active: isActive('c3') })

    drawLine([[29.5, 45], [29.5, 51], [29.5, 67]], { width: isActive('c4') ? 3.5 : 3 })
    drawDisconnect(29.5, 51)
    drawBreakerCoil(29.5, 56)
    drawLabel('Compact', 24.2, 52.1, { size: 12, weight: 700 })
    drawLabel('NS 1660H', 24.2, 55.3, { size: 12, weight: 700 })
    drawLabel('Séchoir', 29.5, 64, { size: 13, weight: 700, rotate: true })
    drawChip('C4', 27.2, 75.8, { pointer: 'none', active: isActive('c4') })

    drawLine([[41.5, 45], [41.5, 51], [41.5, 67]], { width: isActive('c5') ? 3.5 : 3 })
    drawDisconnect(41.5, 51)
    drawBreakerCoil(41.5, 56)
    drawLabel('NSX 630N', 45.8, 52.4, { size: 13, weight: 700 })
    drawLabel('Administration', 41.5, 64, { size: 13, weight: 700, rotate: true })
    drawChip('C5', 39.2, 75.8, { pointer: 'none', active: isActive('c5') })

    drawLine([[53.5, 45], [53.5, 67]], { width: isActive('c6') ? 3.5 : 3, dash: [8, 7] })
    drawLabel('Compteur gaz', 53.5, 61.2, { size: 12, weight: 700, rotate: true })
    drawLabel('séchoir', 55.2, 61.2, { size: 12, weight: 700, rotate: true })
    drawChip('C6', 51.2, 75.8, { pointer: 'none', active: isActive('c6') })

    ctx.save()
    ctx.fillStyle = '#69d893'
    ctx.beginPath()
    ctx.roundRect(px(65.2), py(68.4), px(22), py(5.2), 8)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(px(65.2), py(68.4))
    ctx.lineTo(px(62.4), py(71))
    ctx.lineTo(px(65.2), py(73.6))
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#073b26'
    ctx.font = `800 ${Math.max(12, 15 * Math.min(width / 1100, 1.1))}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Zones Cibles : Process et Utilités', px(76.2), py(71))
    ctx.restore()

    ctx.save()
    ctx.fillStyle = '#0f172a'
    ctx.font = `800 ${Math.max(13, 16 * Math.min(width / 1100, 1.1))}px Arial`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('Alignement EMS / Unifilaire :', px(3.2), py(94.4))
    ctx.font = `600 ${Math.max(12, 15 * Math.min(width / 1100, 1.08))}px Arial`
    ctx.fillText('Le plan de comptage cible les TGBT (C1/C2) et les 4 départs névralgiques (C3 à C6) pour une supervision granulaire multi-énergies (Élec/Gaz).', px(22.7), py(94.4))
    ctx.restore()

    const activeNode = hoveredId ?? selectedId
    const node = ACC_REFERENCE_SCHEMA_NODES.find((item) => item.id === activeNode)
    if (node) {
      ctx.save()
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2.5
      ctx.setLineDash([5, 4])
      ctx.beginPath()
      ctx.roundRect(px(node.x - 0.4), py(node.y - 0.5), px(node.w + 0.8), py(node.h + 1), 8)
      ctx.stroke()
      ctx.restore()
    }
  }, [hoveredId, selectedId])

  function findNode(clientX: number, clientY: number) {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100

    return ACC_REFERENCE_SCHEMA_NODES.find((node) =>
      x >= node.x && x <= node.x + node.w && y >= node.y && y <= node.y + node.h
    )
  }

  return (
    <div className="grid h-full min-h-[700px] grid-cols-[1fr_300px] gap-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-base md:text-lg font-semibold text-black">Schéma unifilaire ACC</p>
            <p className="mt-0.5 text-base text-black">Plan de comptage cible C1 à C6 · TGBT, process et utilités</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3 text-base text-black">
            <span className="flex items-center gap-1"><span className="h-3 w-5 rounded bg-[#7bd99c] ring-1 ring-emerald-300" /> Point EMS</span>
            <span className="flex items-center gap-1"><span className="h-1 w-6 bg-gray-900" /> Puissance</span>
            <span className="flex items-center gap-1"><span className="h-1 w-6 border-t-2 border-dashed border-gray-900" /> Gaz</span>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          className="h-[600px] w-full cursor-crosshair rounded-lg border border-gray-100 bg-white"
          onMouseMove={(event) => setHoveredId(findNode(event.clientX, event.clientY)?.id ?? null)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={(event) => {
            const node = findNode(event.clientX, event.clientY)
            if (node) setSelectedId(node.id)
          }}
        />
      </div>

      <aside className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-base font-semibold uppercase tracking-widest text-black">Sélection</p>
        <h2 className="mt-2 text-base md:text-lg font-semibold text-black">{selectedNode.label}</h2>
        <p className="mt-1 text-base font-semibold uppercase tracking-widest text-black">{selectedNode.subtitle}</p>
        <p className="mt-3 text-base leading-relaxed text-black">{selectedNode.detail}</p>
        {selectedNode.meter && (
          <span className="mt-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-base font-semibold text-emerald-800">
            Point mesure {selectedNode.meter}
          </span>
        )}

        <div className="mt-5">
          <p className="mb-2 text-base font-semibold uppercase tracking-widest text-black">Architecture</p>
          <div className="space-y-2 text-base">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
              <p className="font-semibold text-black">TGBT 1</p>
              <p className="mt-1 text-base leading-relaxed text-black">C1 surveille le Masterpact 2500A et le départ usinage fèves C3.</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
              <p className="font-semibold text-black">TGBT 2</p>
              <p className="mt-1 text-base leading-relaxed text-black">C2 surveille le Masterpact 3200A avec les départs C4, C5 et la zone gaz C6.</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
              <p className="font-semibold text-black">Zone cible</p>
              <p className="mt-1 text-base leading-relaxed text-black">Le cadre vert isole les usages process et utilités à superviser dans le périmètre EMS.</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
function AccMassPlanCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState('local-tgbt')
  const selectedFeature =
    ACC_MAP_FEATURES.find((feature) => feature.id === selectedId) ??
    ACC_MAP_FEATURES.find((feature) => feature.id === 'local-tgbt') ??
    ACC_MAP_FEATURES[0]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(rect.height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const width = rect.width
    const height = rect.height
    const px = (value: number) => (value / 100) * width
    const py = (value: number) => (value / 100) * height

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i += 1) {
      ctx.beginPath()
      ctx.moveTo(px(i * 10), 0)
      ctx.lineTo(px(i * 10), height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, py(i * 10))
      ctx.lineTo(width, py(i * 10))
      ctx.stroke()
    }

    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 2
    ctx.strokeRect(px(4), py(8), px(90), py(84))

    ACC_MAP_FEATURES.forEach((feature) => {
      const isActive = feature.id === selectedId
      const isHover = feature.id === hoveredId
      const x = px(feature.x)
      const y = py(feature.y)
      const w = px(feature.w)
      const h = py(feature.h)
      const fill =
        feature.type === 'utility' ? '#fff7ed' :
        feature.type === 'yard' ? '#f1f5f9' :
        '#ffffff'
      const stroke =
        isActive ? '#d97706' :
        isHover ? '#f59e0b' :
        feature.type === 'utility' ? '#fdba74' :
        '#cbd5e1'

      ctx.fillStyle = fill
      ctx.strokeStyle = stroke
      ctx.lineWidth = isActive || isHover ? 2.5 : 1.5
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, 8)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#111827'
      ctx.font = '600 11px Arial'
      ctx.textBaseline = 'top'
      const words = feature.label.split(' ')
      const line1 = words.slice(0, 2).join(' ')
      const line2 = words.slice(2).join(' ')
      ctx.fillText(line1, x + 8, y + 8)
      if (line2) ctx.fillText(line2, x + 8, y + 22)

      if (feature.meter) {
        ctx.fillStyle = '#f59e0b'
        ctx.beginPath()
        ctx.roundRect(x + w - 38, y + 8, 30, 18, 9)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = '700 10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(feature.meter, x + w - 23, y + 12)
        ctx.textAlign = 'left'
      }
    })

    ACC_METER_POINTS.forEach((meter) => {
      const x = px(meter.x)
      const y = py(meter.y)
      ctx.fillStyle = '#111827'
      ctx.beginPath()
      ctx.arc(x, y, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = '700 10px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(meter.id, x, y)
      ctx.textAlign = 'left'
      ctx.textBaseline = 'alphabetic'
    })

    ctx.fillStyle = '#475569'
    ctx.font = '700 12px Arial'
    ctx.fillText('PLAN DE MASSE ACC - PL13', px(5), py(5))
    ctx.font = '10px Arial'
    ctx.fillText('Reproduction schématique interactive d’après le PDF AutoCAD du 21/05/2025', px(5), py(7))
  }, [hoveredId, selectedId])

  function findFeature(clientX: number, clientY: number) {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    return ACC_MAP_FEATURES.find((feature) =>
      x >= feature.x && x <= feature.x + feature.w && y >= feature.y && y <= feature.y + feature.h
    )
  }

  return (
    <div className="grid h-full min-h-[620px] grid-cols-[1fr_280px] gap-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-black">Plan de masse ACC</p>
            <p className="mt-0.5 text-base text-black">Zones process, utilités et points de mesure C1 à C6</p>
          </div>
          <div className="flex items-center gap-3 text-base text-black">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-white ring-1 ring-gray-300" /> Bâtiment</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-orange-50 ring-1 ring-orange-300" /> Utilité</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gray-900" /> Compteur</span>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          className="h-[540px] w-full cursor-crosshair rounded-lg border border-gray-100"
          onMouseMove={(event) => setHoveredId(findFeature(event.clientX, event.clientY)?.id ?? null)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={(event) => {
            const feature = findFeature(event.clientX, event.clientY)
            if (feature) setSelectedId(feature.id)
          }}
        />
      </div>

      <aside className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-base font-semibold uppercase tracking-widest text-black">Sélection</p>
        <h2 className="mt-2 text-base font-semibold text-black">{selectedFeature.label}</h2>
        <p className="mt-2 text-base leading-relaxed text-black">{selectedFeature.detail}</p>
        {selectedFeature.meter && (
          <span className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-base font-semibold text-amber-800">
            Point mesure {selectedFeature.meter}
          </span>
        )}

        <div className="mt-5">
          <p className="mb-2 text-base font-semibold uppercase tracking-widest text-black">Compteurs</p>
          <div className="space-y-2">
            {ACC_METER_POINTS.map((meter) => (
              <div key={meter.id} className="rounded-lg border border-gray-100 bg-gray-50 p-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-black">{meter.id}</span>
                  <span className="text-base font-medium text-black">{meter.label}</span>
                </div>
                <p className="mt-1 text-base leading-snug text-black">{meter.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}

const ACC_PRODUCTION_SUMMARY = [
  { label: 'Cacao traité', value: '110,3', unit: 't', detail: 'Journée en cours', border: 'border-l-[#23689b]', valueColor: 'text-[#23689b]', surface: 'bg-[#fbfaf4]' },
  { label: 'Tonnage séché', value: '47,8', unit: 't', detail: 'Rdt séchoir 92%', border: 'border-l-emerald-500', valueColor: 'text-emerald-700', surface: 'bg-[#fbfaf4]' },
  { label: 'Tonnage usiné', value: '54,2', unit: 't', detail: 'Atelier C3', border: 'border-l-violet-600', valueColor: 'text-violet-700', surface: 'bg-[#fbfaf4]' },
  { label: 'Énergie / tonne', value: '80,9', unit: 'kWh/t', detail: '+3,7% vs cible', border: 'border-l-amber-600', valueColor: 'text-amber-700', surface: 'bg-[#fbfaf4]' },
]

const ACC_DAILY_PRODUCTION_FLOW = [
  { label: 'Réception', value: '110,3', unit: 't', detail: 'Cacao entrant', tag: 'ACC', border: 'border-blue-200', surface: 'bg-blue-50', valueColor: 'text-[#23689b]' },
  { label: 'Séchage', value: '47,8', unit: 't', detail: 'Sortie séchoir C4', tag: 'Rdt 92%', border: 'border-emerald-200', surface: 'bg-emerald-50', valueColor: 'text-emerald-700', bar: 92 },
  { label: 'Usinage', value: '54,2', unit: 't', detail: 'Atelier C3', tag: 'Suivi horaire validé', border: 'border-violet-200', surface: 'bg-violet-50', valueColor: 'text-violet-700' },
  { label: 'Énergie totale', value: '8 920', unit: 'kWh', detail: 'C1+C2 consommés', tag: 'Gaz: 410 m³', border: 'border-amber-200', surface: 'bg-amber-50', valueColor: 'text-amber-700' },
]

function AccProductionDashboard() {
  const dateFilter = useDateFilter()

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-4 gap-4">
        {ACC_PRODUCTION_SUMMARY.map((metric) => (
          <article
            key={metric.label}
            className={`rounded-xl border border-gray-100 ${metric.border} border-l-4 ${metric.surface} p-5 shadow-sm`}
          >
            <p className="text-base font-semibold uppercase tracking-widest text-black">{metric.label}</p>
            <div className="mt-2 flex items-end gap-1.5">
              <p className={`text-3xl font-bold leading-none ${metric.valueColor}`}>{metric.value}</p>
              <span className="pb-0.5 text-base font-bold text-black">{metric.unit}</span>
            </div>
            <p className="mt-2 text-base font-medium text-black">{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-black">Flux de production journalier</h2>
            <p className="mt-1 text-base font-medium text-black/70">ACC · Données ERP et compteurs · {dateFilter.label}</p>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-base font-bold text-emerald-700">
            Chaîne cohérente
          </span>
        </div>

        <div className="grid grid-cols-[1fr_32px_1fr_32px_1fr_32px_1fr] items-center gap-3">
          {ACC_DAILY_PRODUCTION_FLOW.map((step, index) => (
            <div key={step.label} className="contents">
              <article className={`min-h-[140px] rounded-xl border ${step.border} ${step.surface} p-5 text-center shadow-sm`}>
                <p className="text-base font-bold uppercase tracking-widest text-black/75">{step.label}</p>
                <div className="mt-4 flex items-end justify-center gap-1.5">
                  <p className={`text-3xl font-bold leading-none ${step.valueColor}`}>{step.value}</p>
                  <span className="pb-0.5 text-base font-bold text-black">{step.unit}</span>
                </div>
                <p className="mt-3 text-base font-medium text-black">{step.detail}</p>
                {step.bar ? (
                  <div className="mx-auto mt-4 h-2 w-[82%] overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-emerald-600" style={{ width: `${step.bar}%` }} />
                  </div>
                ) : null}
                <span className="mt-3 inline-flex rounded-md bg-white/70 px-2.5 py-1 text-base font-bold text-black">
                  {step.tag}
                </span>
              </article>
              {index < ACC_DAILY_PRODUCTION_FLOW.length - 1 && (
                <span className="text-center text-3xl font-light text-black/70" aria-hidden="true">
                  &rarr;
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-black">Tonnages cacao — Aujourd&apos;hui</h2>
          <div className="mt-5 divide-y divide-gray-200">
            {[
              ['Tonnage cacao traité', '110,3 t', 'ACC', 'bg-emerald-50 text-emerald-800'],
              ['Tonnage séché ERP', '47,8 t', 'Rdt 92%', 'bg-white text-emerald-700'],
              ['Tonnage usiné ERP', '54,2 t', 'Atelier C3', 'bg-white text-black'],
              ['Courbe production horaire', '', 'Voir graphique ↗', 'bg-blue-50 text-[#23689b]'],
            ].map(([label, value, badge, badgeClass]) => (
              <div key={label} className="flex items-center justify-between gap-4 py-3 first:pt-0">
                <p className="text-base font-medium text-black">{label}</p>
                <div className="flex items-center gap-3">
                  {value && <span className="text-lg font-bold text-black">{value}</span>}
                  <span className={`rounded-md px-2.5 py-1 text-base font-bold ${badgeClass}`}>{badge}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl bg-[#fbfaf4] p-4">
            <p className="text-base font-medium text-black">Production horaire C1+C2 (dernier cycle)</p>
            <div className="mt-4 flex h-16 items-end gap-1.5">
              {[42, 52, 38, 56, 61, 48, 59, 70].map((value, index) => (
                <span
                  key={`${value}-${index}`}
                  className={`flex-1 rounded-t ${index > 5 ? 'bg-[#3d8fd8]' : 'bg-[#a7c7e5]'}`}
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-black">Séchage & usinage — Détail énergie</h2>
          <div className="mt-5 divide-y divide-gray-200">
            {[
              ['Énergie séchoir (C4)', '2 120 kWh', 'text-violet-700'],
              ['Gaz séchoir (C6)', '410 m³', 'text-amber-700'],
              ['Énergie usinage (C3)', '1 760 kWh', 'text-amber-700'],
              ['Rendement séchoir global', '92%', 'text-emerald-700'],
            ].map(([label, value, color], index) => (
              <div key={label} className="flex items-center justify-between gap-4 py-3 first:pt-0">
                <p className="text-base font-medium text-black">{label}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${color}`}>{value}</span>
                  {index === 3 && (
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-base font-bold text-emerald-800">OK</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <p className="text-base font-medium text-black">Répartition énergie process séchage/usinage</p>
            <div className="mt-3 flex h-4 overflow-hidden rounded-full bg-gray-100">
              <span className="bg-violet-600" style={{ width: '24%' }} />
              <span className="bg-amber-600" style={{ width: '20%' }} />
              <span className="bg-emerald-500" style={{ width: '7%' }} />
              <span className="bg-[#23689b]" style={{ width: '49%' }} />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 text-base font-medium text-black">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-violet-600" /> Séchoir 24%</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-amber-600" /> Usinage 20%</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-emerald-500" /> Admin 7%</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-[#23689b]" /> TGBT 49%</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}

function productionTabForSite(site: SiteConfig): SiteTab {
  const base =
    site.slug === 'acc'
      ? {
          title: 'Production cacao',
          source: 'ERP production ACC',
          zoneA: 'Tonnages cacao',
          zoneB: 'Séchage & usinage',
          items: [
            { icon: 'hash', text: 'Tonnage cacao traité : 110,3 t sur la journée', tag: 'ACC' },
            { icon: 'sun', text: 'Tonnage séché ERP : 47,8 t · rendement séchoir 92 %' },
            { icon: 'tools', text: 'Tonnage usinage ERP : 54,2 t · suivi atelier C3' },
            { icon: 'chart-line', text: 'Courbe production horaire et comparaison énergie C1+C2', full: true },
          ],
          quality: [
            { icon: 'percentage', text: 'Rendement matière : 94,1 %' },
            { icon: 'target', text: 'Objectif journalier : 125 t cacao traité' },
          ],
        }
      : site.slug === 'scci-1'
        ? {
            title: 'Production ciment SCCI 1',
            source: 'ERP cimenterie · Ligne 1',
            zoneA: 'Tonnage clinker / ciment',
            zoneB: 'Expédition & ensachage',
            items: [
              { icon: 'hash', text: 'Tonnage ciment produit : 466 t sur la journée', tag: 'SCCI 1' },
              { icon: 'engine', text: 'Broyage / HTA : 12,6 MWh corrélés à la production' },
              { icon: 'truck', text: 'Ensachage / Expédition C3 : 438 t expédiées' },
              { icon: 'chart-line', text: 'Courbe production horaire vs puissance C1+C2', full: true },
            ],
            quality: [
              { icon: 'percentage', text: 'Disponibilité ligne : 91,8 %' },
              { icon: 'target', text: 'Objectif journalier : 510 t ciment' },
            ],
          }
        : {
            title: 'Production ciment SCCI 2',
            source: 'ERP cimenterie · Ligne 2',
            zoneA: 'Tonnage ciment',
            zoneB: 'Expédition & utilités',
            items: [
              { icon: 'hash', text: 'Tonnage ciment produit : 452 t sur la journée', tag: 'SCCI 2' },
              { icon: 'truck', text: 'Expédition C3+C4 : 451 t expédiées' },
              { icon: 'wind', text: 'Compresseurs C6 : 4,4 MWh associés au process' },
              { icon: 'chart-line', text: 'Courbe production horaire vs puissance C1', full: true },
            ],
            quality: [
              { icon: 'percentage', text: 'Disponibilité ligne : 94,6 %' },
              { icon: 'target', text: 'Objectif journalier : 475 t ciment' },
            ],
          }

  return {
    id: 'production-data',
    label: 'Données de production',
    icon: 'table',
    zones: [
      {
        letter: 'A',
        bgColor: site.accent === 'blue' ? '#E6F1FB' : site.accent === 'emerald' ? '#E1F5EE' : '#FAEEDA',
        textColor: site.accent === 'blue' ? '#0C447C' : site.accent === 'emerald' ? '#085041' : '#8B5500',
        name: base.zoneA,
        source: base.source,
        items: base.items,
      },
      {
        letter: 'B',
        bgColor: '#EAF3DE',
        textColor: '#27500A',
        name: base.zoneB,
        source: base.title,
        items: base.quality,
      },
    ],
    widgets: [
      { label: 'Production', type: 'ERP journalier', icon: 'hash' },
      { label: 'Objectif', type: 'Réalisé vs cible', icon: 'target' },
      { label: 'Corrélation', type: 'kWh vs tonnes', icon: 'chart-line' },
      { label: 'Qualité', type: 'Rendement', icon: 'percentage' },
    ],
  }
}

function visibleTabsForSite(site: SiteConfig): SiteTab[] {
  const production = productionTabForSite(site)

  if (site.slug !== 'acc') {
    const tabsWithProduction = [...site.tabs]
    const kpiIndex = tabsWithProduction.findIndex((tab) => tab.id === 'kpis')
    const detailIndex = tabsWithProduction.findIndex((tab) => tab.id === 'detail-points')
    const insertIndex = detailIndex >= 0 ? detailIndex : kpiIndex >= 0 ? kpiIndex + 1 : 1
    tabsWithProduction.splice(insertIndex, 0, production)
    return tabsWithProduction
  }

  const vueGlobale = site.tabs.find((tab) => tab.id === 'bilan')
  const detailParPointBase = site.tabs.find((tab) => tab.id === 'detail-points')
  const detailParPoint = detailParPointBase
    ? {
        ...detailParPointBase,
        zones: [
          {
            letter: 'S',
            bgColor: '#111827',
            textColor: '#FFFFFF',
            name: 'Schéma unifilaire ACC',
            source: 'Schéma unifilaire ACC · PDF fourni',
            items: [],
          },
          ...detailParPointBase.zones,
        ],
      }
    : undefined
  const kpi = site.tabs.find((tab) => tab.id === 'kpis')
  const carte: SiteTab = {
    id: 'carte',
    label: 'Carte',
    icon: 'layers',
    zones: [
      {
        letter: 'A',
        bgColor: '#FAEEDA',
        textColor: '#8B5500',
        name: 'Carte énergétique ACC',
        source: 'Plan site · points C1 à C6',
        items: [
          { icon: 'layers', text: 'Vue schématique des TGBT 1 & 2 et départs C1 à C6', tag: 'ACC' },
          { icon: 'bolt', text: 'C1 + C2 : arrivée générale et puissance totale atelier' },
          { icon: 'building-factory', text: 'C3 : usinage fèves · C4 : séchoir thermique · C5 : administration' },
          { icon: 'flame', text: 'C6 : compteur gaz séchoir et suivi thermique' },
        ],
      },
      {
        letter: 'B',
        bgColor: '#EAF3DE',
        textColor: '#27500A',
        name: 'État des points',
        source: 'InfluxDB · supervision temps réel',
        items: [
          { icon: 'activity', text: 'Statut communication de chaque compteur' },
          { icon: 'alert', text: 'Mise en évidence des points en dépassement ou en défaut' },
          { icon: 'chart-line', text: 'Accès rapide à la courbe du point sélectionné' },
        ],
      },
    ],
    widgets: [
      { label: 'Carte', type: 'Synoptique ACC', icon: 'layers' },
      { label: 'Points', type: 'C1 à C6', icon: 'list' },
      { label: 'Statuts', type: 'Online / défaut', icon: 'activity' },
      { label: 'Alertes', type: 'Seuils point', icon: 'alert' },
    ],
  }

  return [vueGlobale, kpi, production, detailParPoint, carte].filter((tab): tab is SiteTab => Boolean(tab))
}

export default function SiteView({ site }: { site: SiteConfig }) {
  const [activeTabIdx, setActiveTabIdx] = useState(0)
  const [activeZoneIdx, setActiveZoneIdx] = useState(0)
  const dateFilter = useDateFilter()

  const accentCfg = ACCENT[site.accent]
  const tabs = visibleTabsForSite(site)
  const tab = tabs[activeTabIdx] ?? tabs[0]
  const zone = tab.zones[activeZoneIdx]
  const isAccGlobalDashboard = site.slug === 'acc' && tab.id === 'bilan'
  const isAccKpiDashboard = site.slug === 'acc' && tab.id === 'kpis'
  const isAccProductionDashboard = site.slug === 'acc' && tab.id === 'production-data'
  const isAccPointDetail = site.slug === 'acc' && tab.id === 'detail-points'
  const isAccSingleLine = isAccPointDetail && zone.name === 'Schéma unifilaire ACC'
  const isAccMassPlan = site.slug === 'acc' && tab.id === 'carte'
  const isIndustrialSite = site.slug === 'scci-1' || site.slug === 'scci-2'
  const isIndustrialGlobalDashboard = isIndustrialSite && tab.id === 'bilan'
  const isIndustrialKpiDashboard = isIndustrialSite && tab.id === 'kpis'
  const isFullScreenView = isAccGlobalDashboard || isAccKpiDashboard || isAccProductionDashboard || isAccMassPlan || isIndustrialGlobalDashboard || isIndustrialKpiDashboard

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
          <h1 className="text-base font-semibold text-black leading-none">{site.fullName}</h1>
          <p className="mt-1 text-base font-medium text-black">{site.name} · Période : {dateFilter.label}</p>
        </div>
      </div>

      {/* ── Horizontal tab bar ──────────────────────────────────────────── */}
      <div className="shrink-0 flex gap-0 overflow-x-auto border-b border-gray-200 bg-white px-6">
        {tabs.map((t, i) => {
          const isActive = i === activeTabIdx
          return (
            <button
              key={t.id}
              onClick={() => switchTab(i)}
              className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-base transition-colors ${
                isActive
                  ? `${accentCfg.tabBorder} ${accentCfg.tabActive}`
                  : 'border-transparent text-black hover:text-black'
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
        {isFullScreenView ? (
          <main className="flex-1 overflow-y-auto p-6">
            {isAccMassPlan ? (
              <AccMassPlanCanvas />
            ) : isAccKpiDashboard ? (
              <AccKpiDashboard />
            ) : isAccProductionDashboard ? (
              <AccProductionDashboard />
            ) : isAccGlobalDashboard ? (
              <AccGlobalDashboard />
            ) : isIndustrialKpiDashboard ? (
              <IndustrialKpiDashboard site={site} />
            ) : (
              <IndustrialGlobalDashboard site={site} />
            )}
          </main>
        ) : (
          <>

        {/* Sidebar — zones of active tab */}
        <aside className="w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-white py-3 px-2">
          <p className="px-2 mb-2 text-base font-semibold uppercase tracking-widest text-black">
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
                        : 'text-black hover:bg-gray-50 hover:text-black'
                    }`}
                  >
                    <span
                      className="h-5 w-5 shrink-0 rounded flex items-center justify-center text-base font-bold"
                      style={{ background: z.bgColor, color: z.textColor }}
                    >
                      {z.letter}
                    </span>
                    <span className="flex-1 truncate text-base leading-tight">{z.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>

        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {isAccSingleLine ? (
            <AccSingleLineCanvas />
          ) : isAccPointDetail ? (
            <AccPointDetailDashboard zone={zone} />
          ) : isIndustrialSite ? (
            <IndustrialZoneDashboard site={site} tab={tab} zone={zone} />
          ) : (
            <ZonePanel zone={zone} />
          )}
        </main>
          </>
        )}
      </div>
    </div>
  )
}
