export type ZoneItem = {
  icon: string
  text: string
  full?: boolean
  tag?: string
}

export type Zone = {
  letter: string
  bgColor: string
  textColor: string
  name: string
  source: string
  items: ZoneItem[]
}

export type Widget = {
  label: string
  type: string
  icon: string
}

export type SiteTab = {
  id: string
  label: string
  icon: string
  alertDot?: boolean
  zones: Zone[]
  widgets: Widget[]
}

export type SiteAccent = 'blue' | 'emerald' | 'amber'

export type SiteConfig = {
  slug: string
  name: string
  location: string
  accent: SiteAccent
  tabs: SiteTab[]
}

// ── SCCI 1 ────────────────────────────────────────────────────────────────────

const SCCI1: SiteConfig = {
  slug: 'scci-1',
  name: 'SCCI 1',
  location: 'Ligne 1 — Cimenterie',
  accent: 'blue',
  tabs: [
    {
      id: 'bilan',
      label: 'Bilan global',
      icon: 'gauge',
      zones: [
        {
          letter: 'A', bgColor: '#E6F1FB', textColor: '#0C447C',
          name: 'Vue consolidée C1+C2 — temps réel',
          source: 'InfluxDB · DIRIS A40',
          items: [
            { icon: 'bolt',         text: 'Puissance active totale usine (kW) — temps réel' },
            { icon: 'activity',     text: 'Courbe de charge 24h — C1+C2 superposées' },
            { icon: 'calendar',     text: 'Énergie J / S / M / A — tous compteurs' },
            { icon: 'percentage',   text: 'Ratio TGBT1 / TGBT2' },
            { icon: 'wave-sine',    text: 'cos φ global usine · THD moyen' },
            { icon: 'arrows-diff',  text: 'Déséquilibre inter-phases global' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Répartition par zone',
          source: 'InfluxDB',
          items: [
            { icon: 'chart-pie',    text: 'Donut : part % de chaque zone dans le bilan total' },
            { icon: 'chart-bar',    text: 'Histogramme comparatif zones J-7' },
            { icon: 'trending-up',  text: 'Top consommateur du jour (zone + kWh)', full: true },
          ],
        },
      ],
      widgets: [
        { label: 'Puissance',   type: 'Gauge temps réel',  icon: 'bolt' },
        { label: 'Courbe 24h',  type: 'Time series',        icon: 'chart-line' },
        { label: 'Énergie J/S/M', type: 'Stat cards',      icon: 'hash' },
        { label: 'Répartition', type: 'Donut + barres',     icon: 'chart-pie' },
      ],
    },
    {
      id: 'zones',
      label: 'Zones',
      icon: 'building-factory',
      zones: [
        {
          letter: 'A', bgColor: '#E6F1FB', textColor: '#0C447C',
          name: 'Administration — C2 (4 compteurs DIRIS A40/A440)',
          source: 'InfluxDB · C2',
          items: [
            { icon: 'bolt',       text: 'Puissance active/réactive par phase' },
            { icon: 'wave-sine',  text: 'cos φ, THD, tensions par phase' },
            { icon: 'calendar',   text: 'Énergie 30 jours — bureaux, clim, éclairage' },
            { icon: 'percentage', text: 'Part % Administration / bilan global', tag: 'SCCI 1' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Ensachage / Expédition — C3',
          source: 'InfluxDB · C3',
          items: [
            { icon: 'bolt',         text: 'Puissance + énergie · historique mensuel' },
            { icon: 'alert',        text: 'Détection anomalies consommation' },
            { icon: 'arrows-diff',  text: 'Déséquilibre inter-phases départ', tag: 'SCCI 1' },
          ],
        },
        {
          letter: 'C', bgColor: '#FAEEDA', textColor: '#633806',
          name: 'Broyage + Matière 1ère + Salle 6 kV HTA',
          source: 'InfluxDB · HTA',
          items: [
            { icon: 'engine',       text: 'Broyeur Grinding Plant, MCC — courbe de charge vs contractuelle' },
            { icon: 'layers',       text: 'Matière 1ère — kWh/tonne calcaire · détection surconso' },
            { icon: 'bolt',         text: 'Salle 6 kV : moteurs broyeur A/B, ventilo A/B — 4 compteurs MV/LV' },
            { icon: 'activity',     text: 'Déséquilibre inter-phases HTA · qualité réseau', full: true, tag: 'SCCI 1' },
          ],
        },
      ],
      widgets: [
        { label: 'Admin C2',    type: 'Courbes phases',  icon: 'wave-sine' },
        { label: 'Expédition',  type: 'Time series',     icon: 'truck' },
        { label: 'Broyage HTA', type: 'Puissance MV',    icon: 'engine' },
        { label: 'Répartition', type: 'Donut zones',     icon: 'chart-pie' },
      ],
    },
    {
      id: 'ge-carburant',
      label: 'GE & Carburant',
      icon: 'battery-charging',
      zones: [
        {
          letter: 'A', bgColor: '#E6F1FB', textColor: '#0C447C',
          name: 'Groupes électrogènes — GE1 / GE2',
          source: 'InfluxDB · GE',
          items: [
            { icon: 'bolt',       text: 'Puissance GE1 · énergie produite' },
            { icon: 'percentage', text: 'Taux de charge GE (% de 800 kVA)' },
            { icon: 'activity',   text: 'Détection basculement CIE → GE automatique' },
            { icon: 'history',    text: 'Historique des basculements (log horodaté)', tag: 'SCCI 1' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Supervision carburant — VEGAPULS 31 + KROHNE',
          source: 'InfluxDB · jauges',
          items: [
            { icon: 'droplet',      text: 'Niveau cuve temps réel — jauge animée (%)' },
            { icon: 'activity',     text: 'Débit instantané (L/h) — débitmètre KROHNE Coriolis' },
            { icon: 'calendar',     text: 'Consommation horaire / journalière / mensuelle' },
            { icon: 'trending-up',  text: 'Tendance 30 jours · ratio L/tonne ciment' },
            { icon: 'bell',         text: 'Alerte niveau cuve < 15%', tag: 'SCCI 1' },
          ],
        },
      ],
      widgets: [
        { label: 'Puissance GE',  type: 'Gauge kW',       icon: 'bolt' },
        { label: 'Basculements',  type: 'Log événements', icon: 'activity' },
        { label: 'Niveau cuve',   type: 'Jauge animée',   icon: 'droplet' },
        { label: 'Conso carbu.',  type: 'Time series',    icon: 'chart-line' },
      ],
    },
    {
      id: 'kpis',
      label: 'KPIs process',
      icon: 'chart-dots',
      zones: [
        {
          letter: 'A', bgColor: '#E6F1FB', textColor: '#0C447C',
          name: 'Intensité énergétique — croisé ERP/SQL',
          source: 'InfluxDB + ERP/SQL',
          items: [
            { icon: 'bolt',       text: 'kWh / tonne ciment produite — J/S/M' },
            { icon: 'droplet',    text: 'L carburant / tonne ciment — SCCI 1', tag: 'SCCI 1' },
            { icon: 'percentage', text: '% énergie Administration (C2/C1×100)' },
            { icon: 'clock',      text: 'kWh / heure de fonctionnement' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Objectif vs réalisé ISO 50001',
          source: 'InfluxDB + ERP/SQL',
          items: [
            { icon: 'target',         text: 'Objectif kWh/tonne groupe (ligne de référence)' },
            { icon: 'trending-down',  text: 'Écart % vs objectif avec flèche tendance' },
            { icon: 'chart-line',     text: 'Courbe tendance 12 mois glissants' },
            { icon: 'calendar',       text: "Écart prévisionnel fin d'année", full: true },
          ],
        },
        {
          letter: 'C', bgColor: '#FAEEDA', textColor: '#633806',
          name: 'Ratios & PUE process',
          source: 'InfluxDB',
          items: [
            { icon: 'percentage', text: 'PUE Process = énergie process / énergie totale' },
            { icon: 'chart-pie',  text: 'Ratio process / tertiaire (Administration)' },
          ],
        },
      ],
      widgets: [
        { label: 'kWh/tonne',   type: 'Stat + tendance',   icon: 'hash' },
        { label: 'L/tonne',     type: 'Stat + tendance',   icon: 'droplet' },
        { label: 'vs objectif', type: 'Barre ±',            icon: 'target' },
        { label: 'Tendance',    type: 'Courbe 12 mois',    icon: 'chart-line' },
      ],
    },
    {
      id: 'alertes',
      label: 'Alertes',
      icon: 'bell',
      alertDot: true,
      zones: [
        {
          letter: 'A', bgColor: '#FCEBEB', textColor: '#A32D2D',
          name: 'Alertes actives — temps réel',
          source: 'Alertmanager',
          items: [
            { icon: 'bolt',       text: 'Puissance souscrite CIE > 90% (C1 ou C2)' },
            { icon: 'wave-sine',  text: 'cos φ < 0,90 sur un départ' },
            { icon: 'activity',   text: 'THD > 5%' },
            { icon: 'arrows-diff',text: 'Déséquilibre courant phases > 10%' },
            { icon: 'droplet',    text: 'Niveau cuve carburant < 15%', tag: 'SCCI 1' },
            { icon: 'wifi-off',   text: 'Perte communication compteur (watchdog Telegraf)' },
          ],
        },
        {
          letter: 'B', bgColor: '#FAEEDA', textColor: '#633806',
          name: 'Journal & acquittement — 30 jours',
          source: 'Alertmanager · 30 j',
          items: [
            { icon: 'list',   text: 'Journal horodaté tous dépassements 30 jours' },
            { icon: 'filter', text: 'Filtre par type / sévérité / compteur' },
            { icon: 'check',  text: 'Bouton acknowledge opérateur' },
            { icon: 'mail',   text: 'Canaux : email / SMS / webhook Teams', full: true },
          ],
        },
      ],
      widgets: [
        { label: 'Actives',   type: 'Liste colorée',   icon: 'bell' },
        { label: 'Sévérité',  type: 'Compteurs',       icon: 'hash' },
        { label: 'Journal',   type: 'Table filtrable', icon: 'list' },
        { label: 'Canaux',    type: 'Statut notif.',   icon: 'mail' },
      ],
    },
    {
      id: 'rapport',
      label: 'Rapport',
      icon: 'file-export',
      zones: [
        {
          letter: 'A', bgColor: '#E1F5EE', textColor: '#085041',
          name: 'Génération rapport mensuel ISO 50001',
          source: 'InfluxDB + ERP/SQL → PDF',
          items: [
            { icon: 'calendar',     text: 'Sélecteur de mois — génération à la demande' },
            { icon: 'file-export',  text: 'Export PDF : bilan par zone fonctionnelle' },
            { icon: 'table',        text: 'Export Excel : données brutes + KPIs' },
            { icon: 'mail',         text: 'Envoi automatique email responsable énergie site' },
          ],
        },
        {
          letter: 'B', bgColor: '#E6F1FB', textColor: '#0C447C',
          name: 'Contenu du rapport',
          source: 'Synthèse',
          items: [
            { icon: 'chart-bar',    text: 'Bilan énergétique mensuel par zone (C1→GE)' },
            { icon: 'trophy',       text: 'Performance ISO 50001 : objectif vs réalisé' },
            { icon: 'trending-up',  text: 'Évolution 12 mois glissants' },
            { icon: 'alert',        text: 'Synthèse alertes du mois', full: true },
          ],
        },
        {
          letter: 'C', bgColor: '#FAEEDA', textColor: '#633806',
          name: 'Historique 24 mois',
          source: 'Stockage cloud EMS',
          items: [
            { icon: 'archive',  text: 'Liste rapports générés — 24 derniers mois' },
            { icon: 'download', text: 'Téléchargement PDF / Excel à tout moment' },
          ],
        },
      ],
      widgets: [
        { label: 'Génération', type: 'Formulaire',    icon: 'file-export' },
        { label: 'Aperçu',     type: 'Preview inline', icon: 'eye' },
        { label: 'Envoi',      type: 'Statut email',  icon: 'mail' },
        { label: 'Historique', type: 'Liste DL',      icon: 'archive' },
      ],
    },
  ],
}

// ── SCCI 2 ────────────────────────────────────────────────────────────────────

const SCCI2: SiteConfig = {
  slug: 'scci-2',
  name: 'SCCI 2',
  location: 'Ligne 2 — Cimenterie',
  accent: 'emerald',
  tabs: [
    {
      id: 'bilan',
      label: 'Bilan global',
      icon: 'gauge',
      zones: [
        {
          letter: 'A', bgColor: '#E1F5EE', textColor: '#085041',
          name: 'Vue consolidée C1 — bilan général usine',
          source: 'InfluxDB · DIRIS A40 C1',
          items: [
            { icon: 'bolt',         text: 'Puissance totale temps réel (kW) — aval TR 2500 kVA CIE' },
            { icon: 'activity',     text: 'Courbe de charge 24h' },
            { icon: 'calendar',     text: 'Énergie J / S / M / A' },
            { icon: 'wave-sine',    text: 'cos φ global · THD moyen' },
            { icon: 'arrows-diff',  text: 'Déséquilibre inter-phases' },
            { icon: 'replace',      text: 'Remplacement vue WinCC/Profibus (énergie seule)', full: true, tag: 'SCCI 2' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Répartition par zone fonctionnelle',
          source: 'InfluxDB C1→C9',
          items: [
            { icon: 'chart-pie', text: 'Donut : part % C2/C3/C4/C5/C6 dans bilan C1' },
            { icon: 'chart-bar', text: 'Histogramme comparatif zones J-7' },
          ],
        },
      ],
      widgets: [
        { label: 'Puissance',     type: 'Gauge kW TR',  icon: 'bolt' },
        { label: 'Courbe 24h',    type: 'Time series',  icon: 'chart-line' },
        { label: 'Énergie J/S/M', type: 'Stat cards',  icon: 'hash' },
        { label: 'Répartition',   type: 'Donut',        icon: 'chart-pie' },
      ],
    },
    {
      id: 'zones',
      label: 'Zones',
      icon: 'building-factory',
      zones: [
        {
          letter: 'A', bgColor: '#E1F5EE', textColor: '#085041',
          name: 'Administration — C2',
          source: 'InfluxDB · C2',
          items: [
            { icon: 'bolt',       text: 'Puissance + énergie bâtiment admin' },
            { icon: 'wave-sine',  text: 'cos φ · historique 30 jours' },
            { icon: 'percentage', text: 'Ratio kWh admin / kWh total usine', tag: 'SCCI 2' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Expédition — C3 + C4',
          source: 'InfluxDB · C3 C4',
          items: [
            { icon: 'chart-line',   text: 'Courbes superposées C3 + C4 (puissance + énergie)' },
            { icon: 'arrows-diff',  text: 'Détection déséquilibre inter-départs' },
            { icon: 'calendar',     text: 'Historique mensuel consommation expédition ciment', tag: 'SCCI 2' },
          ],
        },
        {
          letter: 'C', bgColor: '#FAEEDA', textColor: '#633806',
          name: 'Utilités process — C5 (Tank Fuel) + C6 (Compresseurs)',
          source: 'InfluxDB · C5 C6',
          items: [
            { icon: 'bolt',       text: 'Puissances instantanées C5 + C6' },
            { icon: 'sigma',      text: 'Énergies cumulées C5 + C6' },
            { icon: 'percentage', text: 'Ratio kWh utilités / kWh total usine' },
            { icon: 'bell',       text: 'Alerte dépassement seuil horaire compresseurs C6', tag: 'SCCI 2' },
          ],
        },
      ],
      widgets: [
        { label: 'Admin C2',      type: 'Courbe + stat',    icon: 'armchair' },
        { label: 'Expé. C3+C4',   type: 'Dual time series', icon: 'truck' },
        { label: 'Utilités C5+C6',type: 'Puissances',       icon: 'wind' },
        { label: 'Ratios',        type: 'Donut zones',      icon: 'chart-pie' },
      ],
    },
    {
      id: 'ge-gaz',
      label: 'GE & Gaz',
      icon: 'battery-charging',
      zones: [
        {
          letter: 'A', bgColor: '#E1F5EE', textColor: '#085041',
          name: 'Groupes électrogènes — C7 (GE1) + C8 (GE2)',
          source: 'InfluxDB · C7 C8',
          items: [
            { icon: 'bolt',       text: 'Puissance GE1 + GE2 — taux de charge (% 800 kVA)' },
            { icon: 'activity',   text: 'Détection basculement CIE → GE automatique' },
            { icon: 'exchange',   text: 'Comparaison rendement GE1 vs GE2' },
            { icon: 'history',    text: 'Historique des basculements horodatés', tag: 'SCCI 2' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Gaz — C9 (M-Bus Elster BK-G25 / Itron Gallus 2000)',
          source: 'InfluxDB · C9 M-Bus',
          items: [
            { icon: 'flame',        text: 'Consommation m³/h — débit instantané' },
            { icon: 'calendar',     text: 'Énergie gaz cumulée J / S / M' },
            { icon: 'trending-up',  text: 'Tendance mensuelle · ratio m³ gaz / kWh électricité' },
            { icon: 'bell',         text: 'Alerte dépassement seuil journalier C9', tag: 'SCCI 2' },
          ],
        },
      ],
      widgets: [
        { label: 'GE1/GE2',      type: 'Gauge taux charge', icon: 'bolt' },
        { label: 'Basculements', type: 'Log événements',    icon: 'activity' },
        { label: 'Débit gaz',    type: 'Gauge m³/h',        icon: 'flame' },
        { label: 'Conso gaz',    type: 'Time series',       icon: 'chart-line' },
      ],
    },
    {
      id: 'kpis',
      label: 'KPIs énergie',
      icon: 'chart-dots',
      zones: [
        {
          letter: 'A', bgColor: '#E1F5EE', textColor: '#085041',
          name: 'Indicateurs croisés ERP/SQL',
          source: 'InfluxDB + ERP/SQL',
          items: [
            { icon: 'bolt',       text: 'kWh / tonne ciment produite (C1 / tonnage ERP)' },
            { icon: 'flame',      text: 'm³ gaz / tonne ciment (C9 / tonnage ERP)', tag: 'SCCI 2' },
            { icon: 'bolt',       text: 'kWh Expédition / tonne expédiée (C3+C4 / tonnage ERP)' },
            { icon: 'wind',       text: 'kWh Compression / tonne produite (C6 / tonnage ERP)' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Suivi objectifs ISO 50001',
          source: 'InfluxDB + ERP/SQL',
          items: [
            { icon: 'target',     text: 'Objectif vs réalisé — courbe 12 mois' },
            { icon: 'percentage', text: 'PUE Process = (C3+C4+C6) / C1 × 100' },
            { icon: 'percentage', text: 'Part GE = (C7+C8) / C1 × 100 (taux recours GE)' },
            { icon: 'percentage', text: '% énergie Admin = C2/C1 × 100' },
          ],
        },
      ],
      widgets: [
        { label: 'kWh/tonne',   type: 'Stat + flèche',      icon: 'bolt' },
        { label: 'm³ gaz/t',    type: 'Stat + flèche',      icon: 'flame' },
        { label: 'vs objectif', type: 'Barre ±',             icon: 'target' },
        { label: 'PUE/ratios',  type: 'Jauges circulaires', icon: 'circle-dot' },
      ],
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: 'tools',
      zones: [
        {
          letter: 'A', bgColor: '#FAEEDA', textColor: '#633806',
          name: 'Qualité électrique — déséquilibre & harmoniques',
          source: 'InfluxDB · DIRIS A40',
          items: [
            { icon: 'arrows-diff',  text: 'Déséquilibre courant inter-phases par départ' },
            { icon: 'wave-sine',    text: 'Historique cos φ par départ — 30 jours' },
            { icon: 'activity',     text: 'THD tension/courant par compteur' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Détection anomalies & comparaison PAC3200 / DIRIS',
          source: 'WinCC + InfluxDB',
          items: [
            { icon: 'alert',        text: 'Surconsommation anormale — écart vs baseline' },
            { icon: 'trending-down',text: 'Chute tension détectée' },
            { icon: 'replace',      text: 'Vue comparée PAC3200 (WinCC historique) vs DIRIS A40 (temps réel)', full: true, tag: 'SCCI 2' },
          ],
        },
      ],
      widgets: [
        { label: 'Déséquilibre', type: 'Bar par phase',   icon: 'arrows-diff' },
        { label: 'cos φ',        type: 'Courbe 30j',       icon: 'wave-sine' },
        { label: 'THD',          type: 'Gauge %',          icon: 'activity' },
        { label: 'Anomalies',    type: 'Liste détection', icon: 'alert' },
      ],
    },
    {
      id: 'alertes',
      label: 'Alertes',
      icon: 'bell',
      alertDot: true,
      zones: [
        {
          letter: 'A', bgColor: '#FCEBEB', textColor: '#A32D2D',
          name: 'Alertes opérationnelles actives',
          source: 'Alertmanager',
          items: [
            { icon: 'bolt',       text: 'Puissance souscrite CIE > 90% (C1)' },
            { icon: 'wave-sine',  text: 'cos φ < 0,85 sur un départ' },
            { icon: 'activity',   text: 'THD > 5%' },
            { icon: 'arrows-diff',text: 'Déséquilibre phases > 10%' },
            { icon: 'flame',      text: 'Consommation gaz C9 > seuil journalier', tag: 'SCCI 2' },
            { icon: 'wind',       text: 'Compresseurs C6 > seuil horaire', tag: 'SCCI 2' },
            { icon: 'activity',   text: 'Basculement GE/CIE (C7/C8)' },
            { icon: 'wifi-off',   text: 'Perte communication compteur (Telegraf watchdog)' },
          ],
        },
        {
          letter: 'B', bgColor: '#FAEEDA', textColor: '#633806',
          name: 'Journal acquittement opérateur',
          source: 'Alertmanager · 30j',
          items: [
            { icon: 'list',  text: 'Journal horodaté 30 jours' },
            { icon: 'check', text: 'Acquittement opérateur par alerte' },
            { icon: 'mail',  text: 'Email / SMS / webhook Teams–Slack' },
          ],
        },
      ],
      widgets: [
        { label: 'Actives',  type: 'Liste sévérité',  icon: 'bell' },
        { label: 'Seuils',   type: 'Config params',   icon: 'sliders' },
        { label: 'Journal',  type: 'Table filtrable', icon: 'list' },
        { label: 'Notifs',   type: 'Canaux statut',   icon: 'mail' },
      ],
    },
    {
      id: 'rapport',
      label: 'Rapport',
      icon: 'file-export',
      zones: [
        {
          letter: 'A', bgColor: '#E1F5EE', textColor: '#085041',
          name: 'Rapport mensuel ISO 50001',
          source: 'PDF · Excel',
          items: [
            { icon: 'calendar',    text: 'Sélecteur de mois' },
            { icon: 'file-export', text: 'Export PDF — bilan zones : Admin, Expédition, Utilités, GE, Gaz' },
            { icon: 'mail',        text: 'Envoi email responsable énergie SCCI 2', tag: 'SCCI 2' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Historique',
          source: 'Cloud EMS',
          items: [
            { icon: 'archive', text: 'Rapports 24 mois — téléchargement PDF/Excel' },
            { icon: 'clock',   text: 'Date heure génération et envoi' },
          ],
        },
      ],
      widgets: [
        { label: 'Génération', type: 'Formulaire',    icon: 'file-export' },
        { label: 'Zones',      type: 'Preview PDF',   icon: 'eye' },
        { label: 'Email',      type: 'Statut envoi',  icon: 'mail' },
        { label: 'Historique', type: 'Liste DL',      icon: 'archive' },
      ],
    },
  ],
}

// ── ACC ───────────────────────────────────────────────────────────────────────

const ACC: SiteConfig = {
  slug: 'acc',
  name: 'ACC',
  location: 'Atelier de Conditionnement Cacao',
  accent: 'amber',
  tabs: [
    {
      id: 'bilan',
      label: 'Bilan global',
      icon: 'gauge',
      zones: [
        {
          letter: 'A', bgColor: '#FAEEDA', textColor: '#8B5500',
          name: 'Vue consolidée C1+C2 — TGBT 1 & 2',
          source: 'InfluxDB · DIRIS A40',
          items: [
            { icon: 'bolt',       text: 'Puissance totale temps réel C1 (TGBT 1) + C2 (TGBT 2)' },
            { icon: 'activity',   text: 'Courbe de charge 24h — C1+C2 superposées' },
            { icon: 'calendar',   text: 'Énergie J / S / M / A' },
            { icon: 'wave-sine',  text: 'cos φ global · THD moyen' },
            { icon: 'percentage', text: 'Ratio TGBT1 / TGBT2', tag: 'ACC' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Répartition par zone',
          source: 'InfluxDB C1→C6',
          items: [
            { icon: 'chart-pie', text: 'Donut : part % Usinage / Séchoir / Admin / Compresseurs' },
            { icon: 'chart-bar', text: 'Histogramme comparatif zones J-7' },
          ],
        },
      ],
      widgets: [
        { label: 'Puissance',     type: 'Gauge kW',       icon: 'bolt' },
        { label: 'Courbe 24h',    type: 'Time series',    icon: 'chart-line' },
        { label: 'Énergie J/S/M', type: 'Stat cards',    icon: 'hash' },
        { label: 'Répartition',   type: 'Donut TGBT1/2', icon: 'chart-pie' },
      ],
    },
    {
      id: 'zones',
      label: 'Zones',
      icon: 'building-factory',
      zones: [
        {
          letter: 'A', bgColor: '#FAEEDA', textColor: '#8B5500',
          name: 'Usinage fèves — C3 (TGBT 1, NS 160H)',
          source: 'InfluxDB · C3',
          items: [
            { icon: 'bolt',   text: 'Puissance + énergie atelier usinage' },
            { icon: 'percentage', text: 'kWh Usinage / tonne usinée ERP' },
            { icon: 'alert',  text: 'Détection surconsommation anormale', tag: 'ACC' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Séchoir thermique — C4 (TGBT 1, NS 100H)',
          source: 'InfluxDB · C4',
          items: [
            { icon: 'sun',      text: 'Énergie C4 (électrique séchoir)' },
            { icon: 'flame',    text: 'Croisé avec gaz C6 → kWh séchoir / tonne séchée' },
            { icon: 'calendar', text: 'Historique 30 jours', tag: 'ACC' },
          ],
        },
        {
          letter: 'C', bgColor: '#E6F1FB', textColor: '#0C447C',
          name: 'Administration — C5 (TGBT 1, NS 100H)',
          source: 'InfluxDB · C5',
          items: [
            { icon: 'armchair',   text: 'Puissance + énergie bâtiment admin' },
            { icon: 'percentage', text: '% énergie Admin = C5 / (C1+C2) × 100' },
            { icon: 'calendar',   text: 'Historique 30 jours', tag: 'ACC' },
          ],
        },
      ],
      widgets: [
        { label: 'Usinage C3',  type: 'Time series',  icon: 'bolt' },
        { label: 'Séchoir C4',  type: 'Stat + gaz',   icon: 'sun' },
        { label: 'Admin C5',    type: 'Courbe + stat', icon: 'armchair' },
        { label: 'Ratios',      type: 'kWh/t croisés',icon: 'percentage' },
      ],
    },
    {
      id: 'gaz-sechoir',
      label: 'Gaz — Séchoir',
      icon: 'flame',
      zones: [
        {
          letter: 'A', bgColor: '#FAEEDA', textColor: '#8B5500',
          name: 'Compteur gaz C6 — Séchoir (M-Bus / impulsion)',
          source: 'InfluxDB · C6',
          items: [
            { icon: 'flame',      text: 'Volume gaz m³/h — débit instantané' },
            { icon: 'calendar',   text: 'Énergie gaz cumulée J / S / M' },
            { icon: 'percentage', text: 'm³ gaz / tonne séchée ERP' },
            { icon: 'bell',       text: 'Alerte dépassement seuil journalier gaz C6', tag: 'ACC' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Croisement gaz + énergie séchoir',
          source: 'InfluxDB + ERP/SQL',
          items: [
            { icon: 'chart-line', text: 'Courbe superposée : kWh C4 + m³ gaz C6' },
            { icon: 'target',     text: 'Ratio thermique/électrique séchoir' },
          ],
        },
      ],
      widgets: [
        { label: 'Débit gaz',  type: 'Gauge m³/h',   icon: 'flame' },
        { label: 'Conso gaz',  type: 'Time series',  icon: 'chart-line' },
        { label: 'm³/tonne',   type: 'Stat + flèche',icon: 'percentage' },
        { label: 'Alerte',     type: 'Seuil config', icon: 'bell' },
      ],
    },
    {
      id: 'kpis',
      label: 'KPIs process',
      icon: 'chart-dots',
      zones: [
        {
          letter: 'A', bgColor: '#FAEEDA', textColor: '#8B5500',
          name: 'KPIs énergie croisés ERP/SQL',
          source: 'InfluxDB + ERP/SQL',
          items: [
            { icon: 'bolt',   text: 'kWh / tonne cacao traité = (C1+C2) / tonnage ERP' },
            { icon: 'sun',    text: 'kWh Séchoir / tonne séchée = C4 / tonnage séché' },
            { icon: 'bolt',   text: 'kWh Usinage / tonne usinée = C3 / tonnage usiné' },
            { icon: 'flame',  text: 'm³ gaz / tonne séchée = C6 / tonnage séché', tag: 'ACC' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Objectifs & PUE',
          source: 'InfluxDB + ERP/SQL',
          items: [
            { icon: 'percentage', text: '% énergie Admin = C5/(C1+C2) × 100' },
            { icon: 'percentage', text: 'PUE Process = énergie process / énergie totale' },
            { icon: 'target',     text: 'Objectif vs réalisé ISO 50001' },
          ],
        },
      ],
      widgets: [
        { label: 'kWh/t cacao', type: 'Stat + flèche',    icon: 'bolt' },
        { label: 'm³/t séchée', type: 'Stat + flèche',    icon: 'flame' },
        { label: 'vs objectif', type: 'Barre ±',           icon: 'target' },
        { label: 'PUE',         type: 'Jauge circulaire', icon: 'circle-dot' },
      ],
    },
    {
      id: 'alertes',
      label: 'Alertes',
      icon: 'bell',
      alertDot: true,
      zones: [
        {
          letter: 'A', bgColor: '#FCEBEB', textColor: '#A32D2D',
          name: 'Alertes opérationnelles actives',
          source: 'Alertmanager',
          items: [
            { icon: 'bolt',       text: 'Puissance souscrite CIE > 90% (C1 ou C2)' },
            { icon: 'wave-sine',  text: 'cos φ < 0,85 sur un départ' },
            { icon: 'activity',   text: 'THD > 5%' },
            { icon: 'flame',      text: 'Consommation gaz C6 > seuil journalier', tag: 'ACC' },
            { icon: 'bolt',       text: 'Consommation anormale Usinage C3', tag: 'ACC' },
            { icon: 'wifi-off',   text: 'Perte communication compteur (watchdog Telegraf)' },
          ],
        },
        {
          letter: 'B', bgColor: '#FAEEDA', textColor: '#633806',
          name: 'Journal & acquittement',
          source: 'Alertmanager · 30j',
          items: [
            { icon: 'list',  text: 'Journal horodaté 30 jours' },
            { icon: 'check', text: 'Acquittement opérateur' },
            { icon: 'mail',  text: 'Email / SMS / webhook' },
          ],
        },
      ],
      widgets: [
        { label: 'Actives',  type: 'Liste sévérité', icon: 'bell' },
        { label: 'Seuils',   type: 'Config',         icon: 'sliders' },
        { label: 'Journal',  type: 'Table 30j',      icon: 'list' },
        { label: 'Notifs',   type: 'Canaux',         icon: 'mail' },
      ],
    },
    {
      id: 'rapport',
      label: 'Rapport',
      icon: 'file-export',
      zones: [
        {
          letter: 'A', bgColor: '#FAEEDA', textColor: '#8B5500',
          name: 'Rapport mensuel ISO 50001',
          source: 'PDF · Excel',
          items: [
            { icon: 'calendar',    text: 'Sélecteur de mois' },
            { icon: 'file-export', text: 'Export PDF — bilan : Usinage, Séchoir, Admin, Gaz' },
            { icon: 'mail',        text: 'Envoi email responsable énergie ACC', tag: 'ACC' },
          ],
        },
        {
          letter: 'B', bgColor: '#EAF3DE', textColor: '#27500A',
          name: 'Historique',
          source: 'Cloud EMS',
          items: [
            { icon: 'archive', text: '24 mois — téléchargement PDF/Excel' },
          ],
        },
      ],
      widgets: [
        { label: 'Génération', type: 'Formulaire',  icon: 'file-export' },
        { label: 'Zones',      type: 'Preview PDF', icon: 'eye' },
        { label: 'Email',      type: 'Statut',      icon: 'mail' },
        { label: 'Historique', type: 'Liste DL',    icon: 'archive' },
      ],
    },
  ],
}

export const SITES: SiteConfig[] = [SCCI1, SCCI2, ACC]
