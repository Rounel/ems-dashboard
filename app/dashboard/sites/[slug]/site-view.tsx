'use client'

import { useEffect, useRef, useState } from 'react'
import type { SiteConfig, SiteAccent, SiteTab, Zone } from '@/app/lib/site-data'

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

function ZonePanel({ zone }: { zone: Zone }) {
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

    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const ACC_DASHBOARD_METRICS = [
  { label: 'Puissance instantanée', value: '1 284 kW', detail: 'C1+C2 · 72 % souscrit', icon: 'bolt', accent: 'text-amber-700', bar: 72 },
  { label: 'Énergie jour', value: '8 920 kWh', detail: '+0,9 % vs J-1', icon: 'hash', accent: 'text-blue-700', bar: 61 },
  { label: 'Gaz séchoir', value: '410 m³', detail: 'C6 · 76 % seuil jour', icon: 'flame', accent: 'text-emerald-700', bar: 76 },
  { label: 'KPI cacao', value: '80,9 kWh/t', detail: 'Objectif 78,0 kWh/t', icon: 'target', accent: 'text-red-700', bar: 104 },
]

const ACC_POINT_STATUS = [
  { ref: 'C1', label: 'TGBT 1', value: '5 640 kWh', status: 'OK', color: 'bg-emerald-500' },
  { ref: 'C2', label: 'TGBT 2', value: '3 280 kWh', status: 'OK', color: 'bg-emerald-500' },
  { ref: 'C3', label: 'Usinage', value: '1 760 kWh', status: 'Surveiller', color: 'bg-amber-500' },
  { ref: 'C4', label: 'Séchoir', value: '2 120 kWh', status: 'OK', color: 'bg-emerald-500' },
  { ref: 'C5', label: 'Administration', value: '620 kWh', status: 'OK', color: 'bg-emerald-500' },
  { ref: 'C6', label: 'Gaz Séchoir', value: '410 m³', status: 'Surveiller', color: 'bg-amber-500' },
]

const ACC_LOAD_PROFILE = [
  { label: 'Usinage C3', value: 20, color: 'bg-amber-500' },
  { label: 'Séchoir C4', value: 24, color: 'bg-emerald-500' },
  { label: 'Admin C5', value: 7, color: 'bg-blue-500' },
  { label: 'Autres TGBT', value: 49, color: 'bg-gray-400' },
]

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

type SingleLineLink = {
  from: string
  to: string
  label?: string
}

const ACC_SINGLE_LINE_NODES: SingleLineNode[] = [
  { id: 'cie', label: 'Arrivée CIE', subtitle: 'Réseau 400 V', type: 'source', x: 43, y: 5, w: 14, h: 6, detail: 'Alimentation principale du site ACC avant distribution vers les deux TGBT.' },
  { id: 'mp-tgbt1', label: 'Masterpact NW25 H1', subtitle: '2500 A', type: 'breaker', x: 18, y: 18, w: 20, h: 7, detail: 'Disjoncteur général TGBT 1, ancien TGBT. Le compteur C1 est placé en aval.' },
  { id: 'mp-tgbt2', label: 'Masterpact', subtitle: '3200 A', type: 'breaker', x: 62, y: 18, w: 20, h: 7, detail: 'Disjoncteur général TGBT 2, nouveau TGBT. Le compteur C2 est placé en aval.' },
  { id: 'c1', label: 'C1', subtitle: 'Compteur TGBT 1', type: 'meter', x: 22, y: 30, w: 12, h: 7, detail: 'SOCOMEC DIRIS A40 · Modbus RS485 · mesure globale TGBT 1.', meter: 'C1' },
  { id: 'c2', label: 'C2', subtitle: 'Compteur TGBT 2', type: 'meter', x: 66, y: 30, w: 12, h: 7, detail: 'SOCOMEC DIRIS A40 · Modbus RS485 · mesure globale TGBT 2.', meter: 'C2' },
  { id: 'bus-tgbt1', label: 'Jeu de barres TGBT 1', subtitle: 'Ancien TGBT', type: 'busbar', x: 8, y: 44, w: 40, h: 5, detail: 'Barre de distribution TGBT 1 couvrant usinage, séchoir, chaudière, compresseur air 1, administration et GE.' },
  { id: 'bus-tgbt2', label: 'Jeu de barres TGBT 2', subtitle: 'Nouveau TGBT', type: 'busbar', x: 52, y: 44, w: 40, h: 5, detail: 'Barre de distribution TGBT 2 couvrant broyeurs, compresseurs 2, infrarouge, affineurs, froid, UPS, tour cristallisation et GE J.' },
  { id: 'c3', label: 'C3', subtitle: 'Usinage fèves', type: 'feeder', x: 7, y: 61, w: 15, h: 9, detail: 'Départ NS 160H vers l’atelier usinage fèves. Compteur proposé SOCOMEC DIRIS A40.', meter: 'C3' },
  { id: 'c4', label: 'C4', subtitle: 'Séchoir', type: 'feeder', x: 25, y: 61, w: 15, h: 9, detail: 'Départ NS 100H vers le séchoir thermique. Compteur proposé SOCOMEC DIRIS A40.', meter: 'C4' },
  { id: 'c5', label: 'C5', subtitle: 'Administration', type: 'feeder', x: 43, y: 61, w: 15, h: 9, detail: 'Départ NS 100H vers le bâtiment administratif et les bureaux. Compteur proposé SOCOMEC DIRIS A40.', meter: 'C5' },
  { id: 'loads-tgbt1', label: 'Autres départs TGBT 1', subtitle: 'Chaudière · Air 1 · GE D/B', type: 'load', x: 7, y: 78, w: 33, h: 8, detail: 'Charges couvertes par C1 sans sous-comptage dédié dans la proposition actuelle.' },
  { id: 'loads-tgbt2', label: 'Départs process TGBT 2', subtitle: 'Broyeurs · Froid · UPS · GE J', type: 'load', x: 60, y: 61, w: 30, h: 9, detail: 'Charges couvertes par C2: N5000-1, N5000-2, PG6000, compresseurs 2, infrarouge, affineurs, froid, UPS, tour cristallisation et GE J.' },
  { id: 'c6', label: 'C6', subtitle: 'Gaz séchoir', type: 'meter', x: 34, y: 82, w: 16, h: 8, detail: 'Compteur gaz communicant sur arrivée gaz du séchoir · Elster BK-G / Itron Gallus · M-Bus / Impulsion.', meter: 'C6' },
]

const ACC_SINGLE_LINE_LINKS: SingleLineLink[] = [
  { from: 'cie', to: 'mp-tgbt1', label: 'Alim. TGBT 1' },
  { from: 'cie', to: 'mp-tgbt2', label: 'Alim. TGBT 2' },
  { from: 'mp-tgbt1', to: 'c1' },
  { from: 'mp-tgbt2', to: 'c2' },
  { from: 'c1', to: 'bus-tgbt1' },
  { from: 'c2', to: 'bus-tgbt2' },
  { from: 'bus-tgbt1', to: 'c3' },
  { from: 'bus-tgbt1', to: 'c4' },
  { from: 'bus-tgbt1', to: 'c5' },
  { from: 'bus-tgbt1', to: 'loads-tgbt1' },
  { from: 'bus-tgbt2', to: 'loads-tgbt2' },
  { from: 'c4', to: 'c6', label: 'Process séchoir' },
]

function AccGlobalDashboard() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {ACC_DASHBOARD_METRICS.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{metric.label}</p>
              <Icon name={metric.icon} className="h-4 w-4 text-gray-400" />
            </div>
            <p className={`mt-3 text-2xl font-bold ${metric.accent}`}>{metric.value}</p>
            <p className="mt-1 text-xs text-gray-500">{metric.detail}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${metric.bar > 90 ? 'bg-red-500' : metric.bar > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
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
              <p className="text-sm font-semibold text-gray-900">Points de mesure ACC</p>
              <p className="mt-0.5 text-xs text-gray-500">Statut temps réel des compteurs C1 à C6</p>
            </div>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              2 à surveiller
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {ACC_POINT_STATUS.map((point) => (
              <div key={point.ref} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-gray-500">{point.ref}</span>
                  <span className={`h-2 w-2 rounded-full ${point.color}`} />
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900">{point.label}</p>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-gray-500">{point.status}</span>
                  <span className="font-semibold text-gray-700">{point.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-semibold text-gray-900">Répartition usages</p>
          <p className="mt-0.5 text-xs text-gray-500">Part énergie jour par famille</p>
          <div className="mt-5 space-y-4">
            {ACC_LOAD_PROFILE.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.value} %</span>
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
          <p className="text-sm font-semibold text-gray-900">Seuils critiques</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Puissance C1+C2</span><span className="font-semibold text-amber-700">72 %</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Gaz C6 journalier</span><span className="font-semibold text-amber-700">76 %</span></div>
            <div className="flex justify-between"><span className="text-gray-500">kWh/t cacao</span><span className="font-semibold text-red-700">+3,7</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-semibold text-gray-900">Qualité énergie</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">cos φ global</span><span className="font-semibold text-emerald-700">0,94</span></div>
            <div className="flex justify-between"><span className="text-gray-500">THD moyen</span><span className="font-semibold text-emerald-700">3,8 %</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Disponibilité flux</span><span className="font-semibold text-emerald-700">100 %</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-semibold text-gray-900">Alertes ACC</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-2 text-amber-800">C3 · Usinage +12 % vs profil</div>
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-2 text-amber-800">C6 · Gaz proche seuil journalier</div>
          </div>
        </div>
      </div>
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

function getAccKpiStatus(kpi: (typeof ACC_KPIS)[number]) {
  const ratio = kpi.value / kpi.target
  const isGood = kpi.higherIsBetter ? ratio >= 1 : ratio <= 1
  const isWarning = kpi.higherIsBetter ? ratio >= 0.9 : ratio <= 1.08

  if (isGood) {
    return {
      label: 'Objectif tenu',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      bar: 'bg-emerald-500',
    }
  }

  if (isWarning) {
    return {
      label: 'À surveiller',
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      bar: 'bg-amber-500',
    }
  }

  return {
    label: 'Hors objectif',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    bar: 'bg-red-500',
  }
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

const ACC_KPI_TREND = [74, 77, 82, 79, 81, 76, 84, 80, 78, 83, 81, 80.9]

function AccKpiDashboard() {
  const kpiScore = Math.round(
    (ACC_KPIS.filter((kpi) => {
      const ratio = kpi.value / kpi.target
      return kpi.higherIsBetter ? ratio >= 0.9 : ratio <= 1.08
    }).length / ACC_KPIS.length) * 100
  )

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[1.2fr_0.8fr] gap-4">
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Vue KPI ACC</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">Performance énergétique par tonne produite</h2>
              <p className="mt-1 text-sm text-gray-500">
                Données factices calculées à partir des points C1 à C6 et des tonnages ERP.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Score KPI</p>
              <p className="mt-1 text-3xl font-bold text-emerald-800">{kpiScore} %</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-5 gap-3">
            {[
              { label: 'Énergie totale', value: '8 920 kWh', icon: 'bolt' },
              { label: 'Cacao traité', value: '110,3 t', icon: 'building-factory' },
              { label: 'Tonnage séché', value: '47,8 t', icon: 'flame' },
              { label: 'Tonnage usiné', value: '54,2 t', icon: 'tools' },
              { label: 'Gaz séchoir', value: '410 m³', icon: 'droplet' },
            ].map((input) => (
              <div key={input.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <Icon name={input.icon} className="h-4 w-4 text-gray-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Source</span>
                </div>
                <p className="mt-3 text-lg font-bold text-gray-900">{input.value}</p>
                <p className="mt-0.5 text-xs text-gray-500">{input.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Tendance kWh/t cacao</p>
              <p className="mt-0.5 text-xs text-gray-500">12 derniers mois, valeur cible 78 kWh/t</p>
            </div>
            <Icon name="chart-line" className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-6 flex h-36 items-end gap-2 border-b border-gray-200 pb-2">
            {ACC_KPI_TREND.map((value, index) => (
              <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${value > 78 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                  style={{ height: `${Math.max(24, (value / 90) * 120)}px` }}
                  title={`${value} kWh/t`}
                />
                <span className="text-[10px] text-gray-400">{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Moyenne</p>
              <p className="mt-1 font-bold text-gray-900">79,6 kWh/t</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-xs text-amber-700">Dernier mois</p>
              <p className="mt-1 font-bold text-amber-800">80,9 kWh/t</p>
            </div>
          </div>
        </section>
      </div>

      <section className="grid grid-cols-3 gap-4">
        {ACC_KPIS.map((kpi) => {
          const status = getAccKpiStatus(kpi)
          const gap = getAccKpiGap(kpi)
          const progress = Math.min((kpi.value / kpi.target) * 100, 125)

          return (
            <article key={kpi.label} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold leading-snug text-gray-900">{kpi.label}</p>
                  <p className="mt-1 text-xs text-gray-500">{kpi.detail}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold ${status.bg} ${status.border} ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-950">{formatAccKpiValue(kpi.value, kpi.unit)}</p>
                  <p className="mt-1 text-xs text-gray-500">Objectif {formatAccKpiValue(kpi.target, kpi.unit)}</p>
                </div>
                <p className={`text-sm font-bold ${gap.color}`}>{gap.text}</p>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  <span>Réalisé</span>
                  <span>Cible</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${status.bar}`} style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Formule</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">{kpi.formula}</p>
              </div>
            </article>
          )
        })}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Table de calcul KPI</p>
            <p className="mt-0.5 text-xs text-gray-500">Traçabilité entre formule, sources et résultat affiché</p>
          </div>
          <Icon name="table" className="h-4 w-4 text-gray-400" />
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-400">
              <tr>
                <th className="px-4 py-3 font-semibold">KPI</th>
                <th className="px-4 py-3 font-semibold">Calcul</th>
                <th className="px-4 py-3 font-semibold">Résultat</th>
                <th className="px-4 py-3 font-semibold">Objectif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ACC_KPIS.map((kpi) => (
                <tr key={kpi.label} className="bg-white">
                  <td className="px-4 py-3 font-medium text-gray-900">{kpi.label}</td>
                  <td className="px-4 py-3 text-gray-500">{kpi.formula}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatAccKpiValue(kpi.value, kpi.unit)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatAccKpiValue(kpi.target, kpi.unit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function AccPointDetailDashboard({ zone }: { zone: Zone }) {
  const meterId = zone.name.match(/C\d/)?.[0] ?? 'C1'
  const meter = ACC_POINT_DETAIL_DATA[meterId] ?? ACC_POINT_DETAIL_DATA.C1
  const watchCount = meter.metrics.filter((metric) => metric.status === 'watch').length
  const alertCount = meter.metrics.filter((metric) => metric.status === 'alert').length
  const statusStyles: Record<AccPointMetric['status'], string> = {
    ok: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    watch: 'border-amber-200 bg-amber-50 text-amber-700',
    alert: 'border-red-200 bg-red-50 text-red-700',
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Détail du point de mesure</p>
            <div className="mt-2 flex items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                style={{ background: zone.bgColor, color: zone.textColor }}
              >
                {meterId}
              </span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{meter.label}</h2>
                <p className="mt-0.5 text-sm text-gray-500">{meter.role}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {meter.metrics.length - watchCount - alertCount} OK
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {watchCount} à surveiller
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-3">
          {[
            { label: 'Compteur', value: meterId, icon: 'hash' },
            { label: 'État communication', value: 'En ligne', icon: 'activity' },
            { label: 'Protocole', value: meterId === 'C6' ? 'M-Bus / Impulsion' : 'Modbus RS485', icon: 'wave-sine' },
            { label: 'Dernière mesure', value: 'il y a 12 s', icon: 'clock' },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">{item.label}</p>
                <Icon name={item.icon} className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-base font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {meterId === 'C6' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          C6 est un compteur gaz: les grandeurs électriques sont conservées dans la grille pour garder la même structure de supervision, mais elles sont marquées non applicables.
        </div>
      )}

      <section className="grid grid-cols-3 gap-4">
        {meter.metrics.map((metric) => (
          <article key={metric.label} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold leading-snug text-gray-900">{metric.label}</p>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusStyles[metric.status]}`}>
                {metric.status === 'ok' ? 'OK' : metric.status === 'watch' ? 'Surveiller' : 'Alerte'}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-950">{metric.value}</p>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-500">Variation</span>
              <span className={`text-xs font-semibold ${metric.status === 'watch' ? 'text-amber-700' : metric.status === 'alert' ? 'text-red-700' : 'text-emerald-700'}`}>
                {metric.trend}
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

function AccSingleLineCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState('c1')
  const selectedNode =
    ACC_SINGLE_LINE_NODES.find((node) => node.id === selectedId) ??
    ACC_SINGLE_LINE_NODES.find((node) => node.id === 'c1') ??
    ACC_SINGLE_LINE_NODES[0]

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
    const nodeById = new Map(ACC_SINGLE_LINE_NODES.map((node) => [node.id, node]))

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

    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ACC_SINGLE_LINE_LINKS.forEach((link) => {
      const from = nodeById.get(link.from)
      const to = nodeById.get(link.to)
      if (!from || !to) return

      const fromX = px(from.x + from.w / 2)
      const fromY = py(from.y + from.h)
      const toX = px(to.x + to.w / 2)
      const toY = py(to.y)
      const midY = fromY + (toY - fromY) * 0.48

      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(fromX, midY)
      ctx.lineTo(toX, midY)
      ctx.lineTo(toX, toY)
      ctx.stroke()

      if (link.label) {
        ctx.fillStyle = '#64748b'
        ctx.font = '600 10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(link.label, (fromX + toX) / 2, midY - 5)
      }
    })

    ACC_SINGLE_LINE_NODES.forEach((node) => {
      const isActive = node.id === selectedId
      const isHover = node.id === hoveredId
      const x = px(node.x)
      const y = py(node.y)
      const w = px(node.w)
      const h = py(node.h)
      const fill =
        node.type === 'source' ? '#eff6ff' :
        node.type === 'breaker' ? '#fff7ed' :
        node.type === 'busbar' ? '#111827' :
        node.type === 'meter' ? '#fef3c7' :
        node.type === 'feeder' ? '#ffffff' :
        '#f1f5f9'
      const stroke =
        isActive ? '#d97706' :
        isHover ? '#f59e0b' :
        node.type === 'busbar' ? '#111827' :
        '#cbd5e1'

      ctx.fillStyle = fill
      ctx.strokeStyle = stroke
      ctx.lineWidth = isActive || isHover ? 2.5 : 1.5
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, node.type === 'busbar' ? 4 : 8)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = node.type === 'busbar' ? '#ffffff' : '#111827'
      ctx.font = node.type === 'busbar' ? '700 11px Arial' : '700 12px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label, x + w / 2, y + h * 0.42)
      ctx.font = '600 9px Arial'
      ctx.fillStyle = node.type === 'busbar' ? '#e5e7eb' : '#64748b'
      ctx.fillText(node.subtitle, x + w / 2, y + h * 0.7)

      if (node.meter && node.type !== 'meter') {
        ctx.fillStyle = '#f59e0b'
        ctx.beginPath()
        ctx.arc(x + w - 10, y + 10, 9, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = '700 8px Arial'
        ctx.fillText(node.meter, x + w - 10, y + 10)
      }
    })

    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#475569'
    ctx.font = '700 12px Arial'
    ctx.fillText('SCHÉMA UNIFILAIRE ACC - REPRODUCTION INTERACTIVE', px(3), py(4))
    ctx.font = '10px Arial'
    ctx.fillText('Cliquez sur un disjoncteur, jeu de barres, départ ou compteur pour afficher le détail.', px(3), py(6.5))
  }, [hoveredId, selectedId])

  function findNode(clientX: number, clientY: number) {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100

    return ACC_SINGLE_LINE_NODES.find((node) =>
      x >= node.x && x <= node.x + node.w && y >= node.y && y <= node.y + node.h
    )
  }

  return (
    <div className="grid h-full min-h-[620px] grid-cols-[1fr_290px] gap-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Schéma unifilaire ACC</p>
            <p className="mt-0.5 text-xs text-gray-500">Arrivée, protections, TGBT 1/2, départs process et points C1 à C6</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-100 ring-1 ring-amber-300" /> Compteur</span>
            <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-gray-900" /> Jeu de barres</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-white ring-1 ring-gray-300" /> Départ</span>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          className="h-[540px] w-full cursor-crosshair rounded-lg border border-gray-100"
          onMouseMove={(event) => setHoveredId(findNode(event.clientX, event.clientY)?.id ?? null)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={(event) => {
            const node = findNode(event.clientX, event.clientY)
            if (node) setSelectedId(node.id)
          }}
        />
      </div>

      <aside className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Sélection</p>
        <h2 className="mt-2 text-base font-semibold text-gray-900">{selectedNode.label}</h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-400">{selectedNode.subtitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{selectedNode.detail}</p>
        {selectedNode.meter && (
          <span className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
            Point mesure {selectedNode.meter}
          </span>
        )}

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Architecture</p>
          <div className="space-y-2 text-sm">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
              <p className="font-semibold text-gray-900">TGBT 1</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">C1 couvre C3, C4, C5 et les autres départs ancien TGBT.</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
              <p className="font-semibold text-gray-900">TGBT 2</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">C2 couvre les broyeurs, froid, UPS, compresseurs 2 et GE J.</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
              <p className="font-semibold text-gray-900">Séchoir</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">C4 mesure l’énergie électrique, C6 mesure l’arrivée gaz.</p>
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
            <p className="text-sm font-semibold text-gray-900">Plan de masse ACC</p>
            <p className="mt-0.5 text-xs text-gray-500">Zones process, utilités et points de mesure C1 à C6</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
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
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Sélection</p>
        <h2 className="mt-2 text-base font-semibold text-gray-900">{selectedFeature.label}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{selectedFeature.detail}</p>
        {selectedFeature.meter && (
          <span className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
            Point mesure {selectedFeature.meter}
          </span>
        )}

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Compteurs</p>
          <div className="space-y-2">
            {ACC_METER_POINTS.map((meter) => (
              <div key={meter.id} className="rounded-lg border border-gray-100 bg-gray-50 p-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-gray-900">{meter.id}</span>
                  <span className="text-xs font-medium text-gray-600">{meter.label}</span>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-gray-500">{meter.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}

function visibleTabsForSite(site: SiteConfig): SiteTab[] {
  if (site.slug !== 'acc') return site.tabs

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

  return [vueGlobale, detailParPoint, kpi, carte].filter((tab): tab is SiteTab => Boolean(tab))
}

export default function SiteView({ site }: { site: SiteConfig }) {
  const [activeTabIdx, setActiveTabIdx] = useState(0)
  const [activeZoneIdx, setActiveZoneIdx] = useState(0)

  const accentCfg = ACCENT[site.accent]
  const tabs = visibleTabsForSite(site)
  const tab = tabs[activeTabIdx] ?? tabs[0]
  const zone = tab.zones[activeZoneIdx]
  const isAccGlobalDashboard = site.slug === 'acc' && tab.id === 'bilan'
  const isAccKpiDashboard = site.slug === 'acc' && tab.id === 'kpis'
  const isAccPointDetail = site.slug === 'acc' && tab.id === 'detail-points'
  const isAccSingleLine = isAccPointDetail && zone.name === 'Schéma unifilaire ACC'
  const isAccMassPlan = site.slug === 'acc' && tab.id === 'carte'
  const isAccFullScreenView = isAccGlobalDashboard || isAccKpiDashboard || isAccMassPlan

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
          <h1 className="text-lg font-semibold text-gray-900 leading-none">{site.fullName}</h1>
          <p className="mt-1 text-sm font-medium text-gray-700">{site.name}</p>
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
        {isAccFullScreenView ? (
          <main className="flex-1 overflow-y-auto p-6">
            {isAccMassPlan ? <AccMassPlanCanvas /> : isAccKpiDashboard ? <AccKpiDashboard /> : <AccGlobalDashboard />}
          </main>
        ) : (
          <>

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

        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {isAccSingleLine ? (
            <AccSingleLineCanvas />
          ) : isAccPointDetail ? (
            <AccPointDetailDashboard zone={zone} />
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
