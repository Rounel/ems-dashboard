// ── Types ───────────────────────────────────────────────────────────────────

export type SiteKey = 'scci-1' | 'scci-2' | 'acc'
export type SiteStatus = 'online' | 'warning' | 'offline'
export type AlertLevel = 'critique' | 'warning' | 'info'
export type AlertType = 'admin' | 'operationnel'
export type AlertStatus = 'active' | 'acknowledged'
export type ServiceStatus = 'operational' | 'degraded' | 'down'

export type Site = {
  id: SiteKey
  label: string
  location: string
  status: SiteStatus
  kwhToday: number
  kwhChangePct: number
  vpn: boolean
  dataStream: boolean
}

export type Alert = {
  id: string
  level: AlertLevel
  type: AlertType
  status: AlertStatus
  site: string
  message: string
  timestamp: string
}

export type EnergyMixRow = {
  site: string
  cie: number
  ge: number
  gaz: number
}

export type MonthlyEnergyRow = {
  month: string
  CIE: number
  GE: number
  Gaz: number
}

export type CostRow = {
  site: string
  cie: number
  ge: number
  gaz: number
  total: number
}

export type KpiPoint = {
  month: string
  value: number
  objectif: number
}

export type IsoCompRow = {
  site: string
  indicateur: string
  unit: string
  objectif: number
  realise: number
  delta: number
}

export type IsoAnnualPoint = {
  month: string
  objectif: number
  realise: number
}

export type ReportEntry = {
  id: string
  name: string
  period: string
  generatedAt: string
  format: 'PDF ISO 50001' | 'Excel'
  size: string
  generatedBy: string
}

export type GrafanaUser = {
  id: string
  name: string
  email: string
  role: 'Administrateur' | 'Éditeur' | 'Lecteur'
  siteScope: string[]
  lastLogin: string
  active: boolean
}

export type AlertThreshold = {
  indicateur: string
  site: string
  unit: string
  warning: number
  critical: number
}

export type InfraService = {
  id: string
  name: string
  type: 'VPN' | 'InfluxDB' | 'Cloud' | 'API'
  site: string
  status: ServiceStatus
  latencyMs: number | null
  lastChecked: string
  detail: string
}

// ── Constants ────────────────────────────────────────────────────────────────

export const MONTHS = [
  'Avr 24', 'Mai 24', 'Jun 24', 'Jul 24', 'Aoû 24', 'Sep 24',
  'Oct 24', 'Nov 24', 'Déc 24', 'Jan 25', 'Fév 25', 'Mar 25',
]

export const CHART_COLORS = {
  cie: '#3b82f6',       // blue-500
  ge: '#f59e0b',        // amber-500
  gaz: '#10b981',       // emerald-500
  scci1: '#6366f1',     // indigo-500
  scci2: '#ec4899',     // pink-500
  acc: '#14b8a6',       // teal-500
  objectif: '#9ca3af',  // gray-400
  grid: '#e2e8f0',      // slate-200 (light mode)
  tick: '#6b7280',      // gray-500 (light mode)
}

// ── Page 1 — Accueil ─────────────────────────────────────────────────────────

export const SITES: Site[] = [
  { id: 'scci-1', label: 'SCCI 1', location: 'Abidjan', status: 'online',  kwhToday: 14820, kwhChangePct:  3.1, vpn: true,  dataStream: true  },
  { id: 'scci-2', label: 'SCCI 2', location: 'Bouaké',  status: 'warning', kwhToday: 11340, kwhChangePct: -1.8, vpn: true,  dataStream: false },
  { id: 'acc',    label: 'ACC',    location: 'Abidjan', status: 'online',  kwhToday:  8920, kwhChangePct:  0.9, vpn: false, dataStream: true  },
]

export const TOP_ALERTS: Alert[] = [
  { id: 'a1', level: 'critique', type: 'operationnel', status: 'active',       site: 'SCCI 2', message: 'Perte de données capteur courant — T2',  timestamp: '2025-03-15T09:14:00' },
  { id: 'a2', level: 'warning',  type: 'admin',        status: 'active',       site: 'Groupe', message: 'Budget énergétique mensuel atteint à 87%',timestamp: '2025-03-15T08:30:00' },
  { id: 'a3', level: 'info',     type: 'admin',        status: 'acknowledged', site: 'SCCI 1', message: 'KPI kWh/tonne dépasse objectif de +4.2%', timestamp: '2025-03-15T07:55:00' },
]

// ── Page 2 — Mix énergétique ──────────────────────────────────────────────────

export const ENERGY_MIX: EnergyMixRow[] = [
  { site: 'SCCI 1', cie: 65, ge: 20, gaz: 15 },
  { site: 'SCCI 2', cie: 50, ge: 30, gaz: 20 },
  { site: 'ACC',    cie: 80, ge: 15, gaz:  5 },
]

export const MONTHLY_ENERGY: MonthlyEnergyRow[] = [
  { month: 'Avr 24', CIE: 148, GE: 52, Gaz: 28 },
  { month: 'Mai 24', CIE: 162, GE: 48, Gaz: 31 },
  { month: 'Jun 24', CIE: 155, GE: 61, Gaz: 25 },
  { month: 'Jul 24', CIE: 170, GE: 58, Gaz: 29 },
  { month: 'Aoû 24', CIE: 168, GE: 55, Gaz: 33 },
  { month: 'Sep 24', CIE: 158, GE: 49, Gaz: 27 },
  { month: 'Oct 24', CIE: 163, GE: 53, Gaz: 30 },
  { month: 'Nov 24', CIE: 175, GE: 60, Gaz: 35 },
  { month: 'Déc 24', CIE: 180, GE: 65, Gaz: 38 },
  { month: 'Jan 25', CIE: 172, GE: 58, Gaz: 32 },
  { month: 'Fév 25', CIE: 165, GE: 54, Gaz: 29 },
  { month: 'Mar 25', CIE: 169, GE: 57, Gaz: 31 },
]

export const ENERGY_COSTS: CostRow[] = [
  { site: 'SCCI 1', cie: 8_125_000, ge: 3_000_000, gaz: 1_375_000, total: 12_500_000 },
  { site: 'SCCI 2', cie: 4_900_000, ge: 2_940_000, gaz: 1_960_000, total:  9_800_000 },
  { site: 'ACC',    cie: 5_760_000, ge: 1_080_000, gaz:   360_000, total:  7_200_000 },
]

// ── Page 3 — KPIs ─────────────────────────────────────────────────────────────

const KWH_SCCI1  = [87.2, 85.8, 88.5, 84.9, 86.3, 83.7, 85.1, 87.8, 89.2, 86.5, 84.3, 85.7]
const KWH_SCCI2  = [94.1, 92.4, 96.2, 91.8, 93.0, 90.5, 92.1, 95.3, 97.0, 93.5, 91.2, 92.8]
const KWH_ACC    = [81.3, 80.1, 82.7, 79.5, 81.8, 78.9, 80.4, 82.1, 83.6, 81.0, 79.8, 80.9]
const L_SCCI1    = [18.2, 17.8, 19.1, 18.5, 17.9, 18.8, 19.3, 18.1, 17.6, 18.4, 19.0, 18.7]
const M3_SCCI2   = [11.8, 12.1, 11.5, 12.4, 11.9, 12.8, 11.6, 12.3, 11.2, 12.0, 11.7, 12.2]

export const KPI_KWH_TONNE: { month: string; 'SCCI 1': number; 'SCCI 2': number; ACC: number; objectif: number }[] =
  MONTHS.map((month, i) => ({ month, 'SCCI 1': KWH_SCCI1[i], 'SCCI 2': KWH_SCCI2[i], ACC: KWH_ACC[i], objectif: 82 }))

export const KPI_L_TONNE: { month: string; 'SCCI 1': number; objectif: number }[] =
  MONTHS.map((month, i) => ({ month, 'SCCI 1': L_SCCI1[i], objectif: 18.5 }))

export const KPI_M3_TONNE: { month: string; 'SCCI 2': number; objectif: number }[] =
  MONTHS.map((month, i) => ({ month, 'SCCI 2': M3_SCCI2[i], objectif: 12.0 }))

// ── Page 4 — ISO 50001 ────────────────────────────────────────────────────────

export const ISO_COMPARISON: IsoCompRow[] = [
  { site: 'SCCI 1', indicateur: 'IPÉ Électricité', unit: 'kWh/t', objectif: 82.0, realise: 85.7, delta:  3.7 },
  { site: 'SCCI 1', indicateur: 'Intensité Gaz',   unit: 'm³/t',  objectif: 12.0, realise: 11.2, delta: -0.8 },
  { site: 'SCCI 2', indicateur: 'IPÉ Électricité', unit: 'kWh/t', objectif: 88.0, realise: 92.8, delta:  4.8 },
  { site: 'SCCI 2', indicateur: 'Carburant GE',    unit: 'L/t',   objectif: 18.5, realise: 19.2, delta:  0.7 },
  { site: 'ACC',    indicateur: 'IPÉ Électricité', unit: 'kWh/t', objectif: 78.0, realise: 80.9, delta:  2.9 },
  { site: 'ACC',    indicateur: 'Part Réseau CIE', unit: '%',     objectif: 95.0, realise: 93.5, delta: -1.5 },
]

export const ISO_ANNUAL: IsoAnnualPoint[] = [
  { month: 'Avr 24', objectif: 80, realise: 78.2 },
  { month: 'Mai 24', objectif: 80, realise: 79.1 },
  { month: 'Jun 24', objectif: 80, realise: 77.5 },
  { month: 'Jul 24', objectif: 80, realise: 80.3 },
  { month: 'Aoû 24', objectif: 80, realise: 81.0 },
  { month: 'Sep 24', objectif: 80, realise: 82.4 },
  { month: 'Oct 24', objectif: 80, realise: 81.8 },
  { month: 'Nov 24', objectif: 80, realise: 83.2 },
  { month: 'Déc 24', objectif: 80, realise: 84.5 },
  { month: 'Jan 25', objectif: 82, realise: 83.9 },
  { month: 'Fév 25', objectif: 82, realise: 85.1 },
  { month: 'Mar 25', objectif: 82, realise: 86.3 },
]

// ── Page 5 — Alertes ──────────────────────────────────────────────────────────

export const ALERTS: Alert[] = [
  { id: 'a01', level: 'critique', type: 'admin',        status: 'active',       site: 'SCCI 2', message: 'Perte de données capteur courant — T2',            timestamp: '2025-03-15T09:14:00' },
  { id: 'a02', level: 'warning',  type: 'admin',        status: 'active',       site: 'Groupe', message: 'Budget énergétique mensuel atteint à 87 %',         timestamp: '2025-03-15T08:30:00' },
  { id: 'a03', level: 'info',     type: 'admin',        status: 'acknowledged', site: 'SCCI 1', message: 'KPI kWh/tonne dépasse objectif de +4.2 %',          timestamp: '2025-03-15T07:55:00' },
  { id: 'a04', level: 'critique', type: 'admin',        status: 'acknowledged', site: 'ACC',    message: 'Connexion VPN interrompue depuis 14 min',            timestamp: '2025-03-14T22:41:00' },
  { id: 'a05', level: 'warning',  type: 'admin',        status: 'active',       site: 'SCCI 2', message: 'Qualité dégradée — 3 capteurs hors ligne',           timestamp: '2025-03-13T16:02:00' },
  { id: 'a06', level: 'info',     type: 'admin',        status: 'acknowledged', site: 'SCCI 1', message: 'Rapport mensuel généré automatiquement',             timestamp: '2025-03-01T08:00:00' },
  { id: 'a07', level: 'critique', type: 'operationnel', status: 'active',       site: 'SCCI 2', message: 'Tension réseau hors plage — 246 V (seuil 250 V)',    timestamp: '2025-03-15T09:10:00' },
  { id: 'a08', level: 'warning',  type: 'operationnel', status: 'acknowledged', site: 'SCCI 1', message: 'Puissance GE au-dessus de 85 % nominale',            timestamp: '2025-03-15T06:30:00' },
  { id: 'a09', level: 'warning',  type: 'operationnel', status: 'active',       site: 'ACC',    message: 'Conso nuit +18 % vs profil standard',               timestamp: '2025-03-14T03:12:00' },
  { id: 'a10', level: 'info',     type: 'operationnel', status: 'acknowledged', site: 'SCCI 1', message: 'Démarrage GE automatique — coupure CIE détectée',    timestamp: '2025-03-13T14:55:00' },
  { id: 'a11', level: 'info',     type: 'operationnel', status: 'acknowledged', site: 'SCCI 2', message: 'Maintenance préventive chaudière planifiée J+7',     timestamp: '2025-03-12T09:00:00' },
  { id: 'a12', level: 'warning',  type: 'operationnel', status: 'active',       site: 'SCCI 2', message: 'Facteur de puissance < 0.90 depuis 2h',              timestamp: '2025-03-11T11:30:00' },
]

// ── Page 6 — Rapports ────────────────────────────────────────────────────────

export const REPORT_HISTORY: ReportEntry[] = [
  { id: 'r01', name: 'Rapport Groupe — Fév 2025', period: 'Fév 2025', generatedAt: '2025-03-01 08:00', format: 'PDF ISO 50001', size: '2.4 Mo', generatedBy: 'Auto' },
  { id: 'r02', name: 'Export données — Fév 2025', period: 'Fév 2025', generatedAt: '2025-03-01 08:01', format: 'Excel',         size: '1.1 Mo', generatedBy: 'Auto' },
  { id: 'r03', name: 'Rapport Groupe — Jan 2025', period: 'Jan 2025', generatedAt: '2025-02-01 08:00', format: 'PDF ISO 50001', size: '2.3 Mo', generatedBy: 'Auto' },
  { id: 'r04', name: 'Export données — Jan 2025', period: 'Jan 2025', generatedAt: '2025-02-01 08:01', format: 'Excel',         size: '1.0 Mo', generatedBy: 'Auto' },
  { id: 'r05', name: 'Rapport Groupe — Déc 2024', period: 'Déc 2024', generatedAt: '2025-01-01 08:00', format: 'PDF ISO 50001', size: '2.5 Mo', generatedBy: 'Auto' },
  { id: 'r06', name: 'Export données — Déc 2024', period: 'Déc 2024', generatedAt: '2025-01-01 08:01', format: 'Excel',         size: '1.2 Mo', generatedBy: 'Auto' },
  { id: 'r07', name: 'Rapport Groupe — Nov 2024', period: 'Nov 2024', generatedAt: '2024-12-01 08:00', format: 'PDF ISO 50001', size: '2.2 Mo', generatedBy: 'Admin' },
  { id: 'r08', name: 'Export données — Nov 2024', period: 'Nov 2024', generatedAt: '2024-12-01 08:01', format: 'Excel',         size: '0.9 Mo', generatedBy: 'Admin' },
  { id: 'r09', name: 'Rapport Groupe — Oct 2024', period: 'Oct 2024', generatedAt: '2024-11-01 08:00', format: 'PDF ISO 50001', size: '2.1 Mo', generatedBy: 'Auto' },
  { id: 'r10', name: 'Export données — Oct 2024', period: 'Oct 2024', generatedAt: '2024-11-01 08:01', format: 'Excel',         size: '1.0 Mo', generatedBy: 'Auto' },
]

// ── Page 7a — Admin Accès ────────────────────────────────────────────────────

export const GRAFANA_USERS: GrafanaUser[] = [
  { id: 'u1', name: 'Koné Mamadou',    email: 'kone.m@ems.local',      role: 'Administrateur', siteScope: ['SCCI 1', 'SCCI 2', 'ACC'], lastLogin: '2025-03-15 07:30', active: true  },
  { id: 'u2', name: 'Bamba Aminata',   email: 'bamba.a@ems.local',     role: 'Éditeur',        siteScope: ['SCCI 1', 'ACC'],           lastLogin: '2025-03-15 08:10', active: true  },
  { id: 'u3', name: 'Coulibaly Ibra',  email: 'coulibaly.i@ems.local', role: 'Éditeur',        siteScope: ['SCCI 2'],                  lastLogin: '2025-03-14 16:45', active: true  },
  { id: 'u4', name: 'Traoré Fatouma', email: 'traore.f@ems.local',    role: 'Lecteur',         siteScope: ['SCCI 1', 'SCCI 2', 'ACC'], lastLogin: '2025-03-10 09:00', active: true  },
  { id: 'u5', name: 'Diallo Pierre',   email: 'diallo.p@ems.local',    role: 'Lecteur',         siteScope: ['ACC'],                     lastLogin: '2025-02-28 14:20', active: false },
]

export const ALERT_THRESHOLDS: AlertThreshold[] = [
  { indicateur: 'kWh/tonne',     site: 'SCCI 1', unit: 'kWh/t', warning: 88,  critical: 95  },
  { indicateur: 'kWh/tonne',     site: 'SCCI 2', unit: 'kWh/t', warning: 95,  critical: 102 },
  { indicateur: 'kWh/tonne',     site: 'ACC',    unit: 'kWh/t', warning: 84,  critical: 90  },
  { indicateur: 'L carburant/t', site: 'SCCI 1', unit: 'L/t',   warning: 20,  critical: 24  },
  { indicateur: 'm³ gaz/tonne',  site: 'SCCI 2', unit: 'm³/t',  warning: 13,  critical: 16  },
  { indicateur: 'Budget mensuel',site: 'Groupe', unit: '%',      warning: 85,  critical: 100 },
]

// ── Page 7b — Infrastructure ─────────────────────────────────────────────────

export const INFRA_SERVICES: InfraService[] = [
  { id: 's1', name: 'VPN SCCI 1',      type: 'VPN',     site: 'SCCI 1', status: 'operational', latencyMs: 18,  lastChecked: '09:15', detail: 'OpenVPN — tunnel stable' },
  { id: 's2', name: 'VPN SCCI 2',      type: 'VPN',     site: 'SCCI 2', status: 'operational', latencyMs: 42,  lastChecked: '09:15', detail: 'OpenVPN — tunnel stable' },
  { id: 's3', name: 'VPN ACC',         type: 'VPN',     site: 'ACC',    status: 'degraded',    latencyMs: 215, lastChecked: '09:15', detail: 'Latence élevée — pkt loss 3 %' },
  { id: 's4', name: 'InfluxDB SCCI 1', type: 'InfluxDB',site: 'SCCI 1', status: 'operational', latencyMs: null,lastChecked: '09:15', detail: '14 820 points/jour — OK' },
  { id: 's5', name: 'InfluxDB SCCI 2', type: 'InfluxDB',site: 'SCCI 2', status: 'degraded',    latencyMs: null,lastChecked: '09:14', detail: 'Flux interrompu depuis 14 min' },
  { id: 's6', name: 'InfluxDB ACC',    type: 'InfluxDB',site: 'ACC',    status: 'operational', latencyMs: null,lastChecked: '09:15', detail: '8 920 points/jour — OK' },
  { id: 's7', name: 'API Cloud',       type: 'API',     site: 'Groupe', status: 'operational', latencyMs: 95,  lastChecked: '09:15', detail: 'REST endpoint — 200 OK' },
  { id: 's8', name: 'Serveur Cloud',   type: 'Cloud',   site: 'Groupe', status: 'operational', latencyMs: null,lastChecked: '09:15', detail: 'CPU 23 % — RAM 41 % — Disk 67 %' },
]
