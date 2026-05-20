'use client'

import { useMemo, useState } from 'react'
import SectionHeader from '@/app/dashboard/components/section-header'

type ThresholdRule = {
  id: string
  site: string
  equipment: string
  metric: string
  unit: string
  warningMin?: number
  warningMax?: number
  alarmMin?: number
  alarmMax?: number
  delay: string
  enabled: boolean
}

const SITES = ['ACC', 'SCCI 1', 'SCCI 2']

const EQUIPMENTS: Record<string, string[]> = {
  ACC: ['Transfo 1', 'TGBT 1', 'TGBT 2', 'C1 - TGBT 1', 'C2 - TGBT 2', 'C3 - Usinage', 'C4 - Séchoir', 'C5 - Administration', 'C6 - Gaz Séchoir'],
  'SCCI 1': [
    'Transfo principal',
    'TGBT 1',
    'TGBT 2',
    'C1 - Général usine',
    'C2 - Administration',
    'C3 - Ensachage / Expédition',
    'Broyage - Grinding Plant',
    'Salle 6 kV HTA',
    'GE1',
    'GE2',
    'Cuve carburant',
    'Débitmètre KROHNE',
  ],
  'SCCI 2': [
    'Transfo principal',
    'C1 - Général usine',
    'C2 - Administration',
    'C3 - Expédition',
    'C4 - Expédition',
    'C5 - Tank Fuel',
    'C6 - Compresseurs',
    'C7 - GE1',
    'C8 - GE2',
    'C9 - Gaz',
  ],
}

const METRICS = [
  { label: 'Tension L1-L2', unit: 'V' },
  { label: 'Tension L2-L3', unit: 'V' },
  { label: 'Tension L3-L1', unit: 'V' },
  { label: 'Puissance active totale', unit: 'kW' },
  { label: 'Puissance réactive totale', unit: 'kvar' },
  { label: 'Courant L1', unit: 'A' },
  { label: 'Courant L2', unit: 'A' },
  { label: 'Courant L3', unit: 'A' },
  { label: 'Facteur de puissance (cosφ)', unit: '' },
  { label: 'THD courant total', unit: '%' },
  { label: 'Énergie active import', unit: 'kWh' },
  { label: 'Énergie réactive import', unit: 'kvarh' },
  { label: 'Fréquence réseau', unit: 'Hz' },
  { label: 'Niveau cuve carburant', unit: '%' },
  { label: 'Débit carburant', unit: 'L/h' },
  { label: 'Volume gaz journalier', unit: 'm³' },
  { label: 'Taux de charge GE', unit: '%' },
]

const INITIAL_RULES: ThresholdRule[] = [
  {
    id: 'acc-tr1-u12',
    site: 'ACC',
    equipment: 'Transfo 1',
    metric: 'Tension L1-L2',
    unit: 'V',
    warningMin: 390,
    warningMax: 410,
    alarmMin: 380,
    alarmMax: 420,
    delay: '30 s',
    enabled: true,
  },
  {
    id: 'acc-c1-power',
    site: 'ACC',
    equipment: 'C1 - TGBT 1',
    metric: 'Puissance active totale',
    unit: 'kW',
    warningMax: 1_850,
    alarmMax: 2_050,
    delay: '60 s',
    enabled: true,
  },
  {
    id: 'acc-c3-thd',
    site: 'ACC',
    equipment: 'C3 - Usinage',
    metric: 'THD courant total',
    unit: '%',
    warningMax: 5,
    alarmMax: 8,
    delay: '120 s',
    enabled: true,
  },
  {
    id: 'scci1-c1-freq',
    site: 'SCCI 1',
    equipment: 'C1 - Général usine',
    metric: 'Fréquence réseau',
    unit: 'Hz',
    warningMin: 49.5,
    warningMax: 50.5,
    alarmMin: 49,
    alarmMax: 51,
    delay: '30 s',
    enabled: true,
  },
  {
    id: 'scci1-tr-main-u12',
    site: 'SCCI 1',
    equipment: 'Transfo principal',
    metric: 'Tension L1-L2',
    unit: 'V',
    warningMin: 390,
    warningMax: 410,
    alarmMin: 380,
    alarmMax: 420,
    delay: '30 s',
    enabled: true,
  },
  {
    id: 'scci1-c3-current-l2',
    site: 'SCCI 1',
    equipment: 'C3 - Ensachage / Expédition',
    metric: 'Courant L2',
    unit: 'A',
    warningMax: 420,
    alarmMax: 500,
    delay: '60 s',
    enabled: true,
  },
  {
    id: 'scci1-hta-thd',
    site: 'SCCI 1',
    equipment: 'Salle 6 kV HTA',
    metric: 'THD courant total',
    unit: '%',
    warningMax: 5,
    alarmMax: 8,
    delay: '120 s',
    enabled: true,
  },
  {
    id: 'scci1-ge1-load',
    site: 'SCCI 1',
    equipment: 'GE1',
    metric: 'Taux de charge GE',
    unit: '%',
    warningMax: 80,
    alarmMax: 92,
    delay: '60 s',
    enabled: true,
  },
  {
    id: 'scci1-fuel-level',
    site: 'SCCI 1',
    equipment: 'Cuve carburant',
    metric: 'Niveau cuve carburant',
    unit: '%',
    warningMin: 20,
    alarmMin: 15,
    delay: '5 min',
    enabled: true,
  },
  {
    id: 'scci2-tr-main-u12',
    site: 'SCCI 2',
    equipment: 'Transfo principal',
    metric: 'Tension L1-L2',
    unit: 'V',
    warningMin: 390,
    warningMax: 410,
    alarmMin: 380,
    alarmMax: 420,
    delay: '30 s',
    enabled: true,
  },
  {
    id: 'scci2-c1-power',
    site: 'SCCI 2',
    equipment: 'C1 - Général usine',
    metric: 'Puissance active totale',
    unit: 'kW',
    warningMax: 2_100,
    alarmMax: 2_350,
    delay: '60 s',
    enabled: true,
  },
  {
    id: 'scci2-c6-compressors',
    site: 'SCCI 2',
    equipment: 'C6 - Compresseurs',
    metric: 'Puissance active totale',
    unit: 'kW',
    warningMax: 460,
    alarmMax: 540,
    delay: '120 s',
    enabled: true,
  },
  {
    id: 'scci2-c7-ge-load',
    site: 'SCCI 2',
    equipment: 'C7 - GE1',
    metric: 'Taux de charge GE',
    unit: '%',
    warningMax: 80,
    alarmMax: 92,
    delay: '60 s',
    enabled: true,
  },
  {
    id: 'scci2-c9-gaz',
    site: 'SCCI 2',
    equipment: 'C9 - Gaz',
    metric: 'Volume gaz journalier',
    unit: 'm³',
    warningMax: 1_800,
    alarmMax: 2_200,
    delay: '15 min',
    enabled: false,
  },
]

function formatThreshold(min?: number, max?: number, unit?: string) {
  const suffix = unit ? ` ${unit}` : ''
  if (min !== undefined && max !== undefined) return `${min}${suffix} → ${max}${suffix}`
  if (min !== undefined) return `≥ ${min}${suffix}`
  if (max !== undefined) return `≤ ${max}${suffix}`
  return 'Non défini'
}

function fieldNumber(value: number | undefined) {
  return value === undefined ? '' : String(value)
}

export default function ProfilSupervisionPage() {
  const [rules, setRules] = useState(INITIAL_RULES)
  const [selectedSite, setSelectedSite] = useState('ACC')
  const [selectedEquipment, setSelectedEquipment] = useState('Transfo 1')
  const [selectedMetric, setSelectedMetric] = useState('Tension L1-L2')
  const [warningMin, setWarningMin] = useState('390')
  const [warningMax, setWarningMax] = useState('410')
  const [alarmMin, setAlarmMin] = useState('380')
  const [alarmMax, setAlarmMax] = useState('420')
  const [delay, setDelay] = useState('30 s')

  const selectedMetricUnit = METRICS.find((metric) => metric.label === selectedMetric)?.unit ?? ''
  const filteredRules = useMemo(
    () => rules.filter((rule) => rule.site === selectedSite),
    [rules, selectedSite]
  )
  const activeRules = rules.filter((rule) => rule.enabled).length
  const accRules = rules.filter((rule) => rule.site === 'ACC').length
  const scciRules = rules.filter((rule) => rule.site === 'SCCI 1' || rule.site === 'SCCI 2').length

  function toNumber(value: string) {
    if (!value.trim()) return undefined
    const parsed = Number(value.replace(',', '.'))
    return Number.isFinite(parsed) ? parsed : undefined
  }

  function saveRule() {
    const nextRule: ThresholdRule = {
      id: `${selectedSite}-${selectedEquipment}-${selectedMetric}`.toLowerCase().replaceAll(' ', '-'),
      site: selectedSite,
      equipment: selectedEquipment,
      metric: selectedMetric,
      unit: selectedMetricUnit,
      warningMin: toNumber(warningMin),
      warningMax: toNumber(warningMax),
      alarmMin: toNumber(alarmMin),
      alarmMax: toNumber(alarmMax),
      delay,
      enabled: true,
    }

    setRules((current) => {
      const exists = current.some((rule) =>
        rule.site === nextRule.site &&
        rule.equipment === nextRule.equipment &&
        rule.metric === nextRule.metric
      )

      if (exists) {
        return current.map((rule) =>
          rule.site === nextRule.site &&
          rule.equipment === nextRule.equipment &&
          rule.metric === nextRule.metric
            ? nextRule
            : rule
        )
      }

      return [nextRule, ...current]
    })
  }

  function loadRule(rule: ThresholdRule) {
    setSelectedSite(rule.site)
    setSelectedEquipment(rule.equipment)
    setSelectedMetric(rule.metric)
    setWarningMin(fieldNumber(rule.warningMin))
    setWarningMax(fieldNumber(rule.warningMax))
    setAlarmMin(fieldNumber(rule.alarmMin))
    setAlarmMax(fieldNumber(rule.alarmMax))
    setDelay(rule.delay)
  }

  function toggleRule(id: string) {
    setRules((current) =>
      current.map((rule) => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)
    )
  }

  return (
    <div className="space-y-5 p-6">
      <SectionHeader
        title="Profil de Supervision"
        subtitle="Définition des seuils d’alarme par site, équipement et métrique supervisée"
        action={
          <button
            type="button"
            onClick={saveRule}
            className="rounded-lg bg-blue-600 px-3.5 py-2 text-base font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Enregistrer le seuil
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Règles configurées', value: rules.length, tone: 'text-primary' },
          { label: 'Règles actives', value: activeRules, tone: 'text-emerald-700' },
          { label: 'Règles ACC', value: accRules, tone: 'text-amber-700' },
          { label: 'Règles SCCI 1 / 2', value: scciRules, tone: 'text-sky-700' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-base font-medium uppercase tracking-wider text-black">{item.label}</p>
            <p className={`mt-2 text-base font-bold ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[360px_1fr] gap-5">
        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-3">
            <p className="text-base font-semibold text-black">Nouvelle règle de supervision</p>
            <p className="mt-0.5 text-base text-black">Exemple prérempli: ACC · Transfo 1 · tension L1-L2</p>
          </div>

          <div className="space-y-4 p-5">
            <label className="block">
              <span className="text-base font-semibold uppercase tracking-wider text-black">Site</span>
              <select
                value={selectedSite}
                onChange={(event) => {
                  const site = event.target.value
                  setSelectedSite(site)
                  setSelectedEquipment(EQUIPMENTS[site][0])
                }}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base text-black outline-none focus:border-blue-500"
              >
                {SITES.map((site) => <option key={site}>{site}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-base font-semibold uppercase tracking-wider text-black">Équipement</span>
              <select
                value={selectedEquipment}
                onChange={(event) => setSelectedEquipment(event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base text-black outline-none focus:border-blue-500"
              >
                {EQUIPMENTS[selectedSite].map((equipment) => <option key={equipment}>{equipment}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-base font-semibold uppercase tracking-wider text-black">Métrique</span>
              <select
                value={selectedMetric}
                onChange={(event) => setSelectedMetric(event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base text-black outline-none focus:border-blue-500"
              >
                {METRICS.map((metric) => <option key={metric.label}>{metric.label}</option>)}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {[
                ['Warning min', warningMin, setWarningMin],
                ['Warning max', warningMax, setWarningMax],
                ['Alarme min', alarmMin, setAlarmMin],
                ['Alarme max', alarmMax, setAlarmMax],
              ].map(([label, value, setter]) => (
                <label key={label as string} className="block">
                  <span className="text-base font-medium text-black">{label as string}</span>
                  <div className="mt-1 flex overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-blue-500">
                    <input
                      value={value as string}
                      onChange={(event) => (setter as (next: string) => void)(event.target.value)}
                      inputMode="decimal"
                      className="min-w-0 flex-1 px-3 py-2 text-base text-black outline-none"
                    />
                    {selectedMetricUnit && (
                      <span className="border-l border-gray-200 bg-gray-50 px-2 py-2 text-base font-semibold text-black">
                        {selectedMetricUnit}
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <label className="block">
              <span className="text-base font-semibold uppercase tracking-wider text-black">Temporisation</span>
              <select
                value={delay}
                onChange={(event) => setDelay(event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base text-black outline-none focus:border-blue-500"
              >
                {['10 s', '30 s', '60 s', '120 s', '5 min', '15 min'].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
              <p className="text-base font-semibold uppercase tracking-widest text-primary">Prévisualisation</p>
              <p className="mt-2 text-base leading-relaxed text-blue-900">
                {selectedSite} · {selectedEquipment} · {selectedMetric}: warning {formatThreshold(toNumber(warningMin), toNumber(warningMax), selectedMetricUnit)}, alarme {formatThreshold(toNumber(alarmMin), toNumber(alarmMax), selectedMetricUnit)}.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
            <div>
              <p className="text-base font-semibold text-black">Seuils configurés</p>
              <p className="mt-0.5 text-base text-black">Clique sur “Modifier” pour recharger une règle dans le formulaire</p>
            </div>
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              {SITES.map((site) => (
                <button
                  key={site}
                  type="button"
                  onClick={() => setSelectedSite(site)}
                  className={`rounded-md px-3 py-1.5 text-base font-semibold transition-colors ${
                    selectedSite === site ? 'bg-white text-primary shadow-sm' : 'text-black hover:text-black'
                  }`}
                >
                  {site}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Équipement', 'Métrique', 'Warning', 'Alarme', 'Temporisation', 'État', ''].map((head) => (
                    <th key={head} className="px-5 py-3 text-left text-base font-semibold uppercase tracking-wider text-black">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="border-b border-gray-100">
                    <td className="px-5 py-3 font-medium text-black">{rule.equipment}</td>
                    <td className="px-5 py-3 text-black">{rule.metric}</td>
                    <td className="px-5 py-3 font-mono text-base text-amber-700">
                      {formatThreshold(rule.warningMin, rule.warningMax, rule.unit)}
                    </td>
                    <td className="px-5 py-3 font-mono text-base text-red-700">
                      {formatThreshold(rule.alarmMin, rule.alarmMax, rule.unit)}
                    </td>
                    <td className="px-5 py-3 text-black">{rule.delay}</td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => toggleRule(rule.id)}
                        className={`rounded-full border px-2 py-0.5 text-base font-semibold ${
                          rule.enabled
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 bg-gray-50 text-black'
                        }`}
                      >
                        {rule.enabled ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => loadRule(rule)}
                        className="text-base font-semibold text-blue-600 transition-colors hover:text-primary"
                      >
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
