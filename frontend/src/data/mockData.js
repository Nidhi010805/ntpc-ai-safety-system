// src/data/mockData.js
// HeightSafe-X — simulated backend feed.
// Production me is file ke mock data ko REST / WebSocket / MQTT
// backend responses se replace kiya ja sakta hai.

// ============================================================
// ZONES
// ============================================================

const ZONES = [
  {
    id: 'Z1',
    name: 'Boiler Deck 4',
    level: 'critical',
    x: 18,
    y: 22,
    w: 20,
    h: 16,
  },
  {
    id: 'Z2',
    name: 'Turbine Hall Roof',
    level: 'high',
    x: 46,
    y: 14,
    w: 22,
    h: 14,
  },
  {
    id: 'Z3',
    name: 'Coal Conveyor Gantry',
    level: 'elevated',
    x: 12,
    y: 52,
    w: 24,
    h: 14,
  },
  {
    id: 'Z4',
    name: 'ESP Platform B',
    level: 'safe',
    x: 44,
    y: 46,
    w: 20,
    h: 16,
  },
  {
    id: 'Z5',
    name: 'Chimney Access Ladder',
    level: 'high',
    x: 72,
    y: 20,
    w: 16,
    h: 22,
  },
  {
    id: 'Z6',
    name: 'Switchyard Gantry',
    level: 'elevated',
    x: 70,
    y: 56,
    w: 20,
    h: 16,
  },
  {
    id: 'Z7',
    name: 'Cooling Tower Rim',
    level: 'safe',
    x: 12,
    y: 74,
    w: 22,
    h: 14,
  },
  {
    id: 'Z8',
    name: 'Ash Handling Roof',
    level: 'safe',
    x: 44,
    y: 74,
    w: 20,
    h: 14,
  },
]

export const zones = ZONES

// ============================================================
// WORKER MASTER DATA
// ============================================================

const NAMES = [
  'Ramesh Yadav',
  'Suresh Kumar',
  'Anita Sharma',
  'Vikram Singh',
  'Pooja Verma',
  'Manoj Tiwari',
  'Deepak Rana',
  'Kavita Joshi',
  'Arjun Mehta',
  'Sunil Prasad',
  'Rakesh Gupta',
  'Neha Choudhary',
  'Sanjay Mishra',
  'Priya Nair',
  'Ajay Pandey',
  'Ravi Shankar',
  'Meena Kumari',
  'Vijay Chauhan',
  'Alok Srivastava',
  'Geeta Devi',
]

const PPE_ITEMS = [
  'Helmet',
  'Harness',
  'Gloves',
  'Safety Glasses',
  'Boots',
  'Hi-Vis Vest',
]

const ACTIVITIES = [
  'Climbing ladder',
  'Working at edge',
  'Welding',
  'Inspection round',
  'Cable pulling',
  'Standing by',
  'Descending',
  'Platform work',
]

// ============================================================
// SEEDED RANDOM
// ============================================================

function seededRandom(seed) {
  let s = seed

  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const rand = seededRandom(42)

function pick(arr) {
  return arr[Math.floor(rand() * arr.length)]
}

function randInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min
}

// ============================================================
// RISK
// ============================================================

function riskLevelFromScore(score) {
  if (score >= 80) return 'critical'
  if (score >= 55) return 'high'
  if (score >= 30) return 'elevated'
  return 'nominal'
}

function buildWorker(i) {
  const zone = pick(ZONES)
  const score = randInt(4, 96)

  const missingCount =
    score > 70
      ? randInt(1, 3)
      : score > 40
        ? randInt(0, 1)
        : 0

  const missing = []
  const items = [...PPE_ITEMS]

  for (let m = 0; m < missingCount; m++) {
    const idx = randInt(0, items.length - 1)
    missing.push(items.splice(idx, 1)[0])
  }

  const harnessOk =
    !missing.includes('Harness') && rand() > 0.08

  return {
    id: `NTPC-${1000 + i}`,
    name: NAMES[i % NAMES.length],

    zoneId: zone.id,
    zoneName: zone.name,

    x: zone.x + randInt(10, 80) * (zone.w / 100),
    y: zone.y + randInt(10, 80) * (zone.h / 100),

    riskScore: score,
    riskLevel: riskLevelFromScore(score),

    ppeMissing: missing,
    ppeOk: missing.length === 0,

    harnessConnected: harnessOk,

    activity: pick(ACTIVITIES),

    heightM: randInt(4, 62),
    heartRate: randInt(68, 128),

    edgeDistanceM: +(rand() * 6).toFixed(1),

    lastUpdate: `${randInt(0, 40)}s ago`,

    shift: pick([
      'A — Day',
      'B — Evening',
      'C — Night',
    ]),

    supervisor: pick([
      'R. Khanna',
      'S. Bose',
      'T. Iyer',
    ]),
  }
}

export const workers = Array.from(
  { length: 20 },
  (_, i) => buildWorker(i)
)

// ============================================================
// EXPLAINABLE RISK
// ============================================================

export function explainRisk(worker) {
  const reasons = []

  if (!worker.harnessConnected) {
    reasons.push({
      label: 'Harness not clipped to anchor point',
      weight: 38,
      severity: 'critical',
    })
  }

  if (worker.edgeDistanceM < 1.5) {
    reasons.push({
      label: `Only ${worker.edgeDistanceM} m from unprotected edge`,
      weight: 27,
      severity: 'high',
    })
  }

  if (worker.ppeMissing.length > 0) {
    reasons.push({
      label: `Missing PPE: ${worker.ppeMissing.join(', ')}`,
      weight: 12 * worker.ppeMissing.length,
      severity: 'high',
    })
  }

  if (worker.heartRate > 110) {
    reasons.push({
      label: `Elevated heart rate (${worker.heartRate} bpm) — possible fatigue`,
      weight: 14,
      severity: 'elevated',
    })
  }

  if (worker.heightM > 45) {
    reasons.push({
      label: `Working at extreme height (${worker.heightM} m)`,
      weight: 10,
      severity: 'elevated',
    })
  }

  if (reasons.length === 0) {
    reasons.push({
      label:
        'All PPE detected, harness anchored, vitals nominal',
      weight: 100,
      severity: 'safe',
    })
  }

  return reasons.sort((a, b) => b.weight - a.weight)
}

// ============================================================
// ALERTS
// ============================================================

const ALERT_TYPES = [
  {
    type: 'Harness Disconnected',
    level: 'critical',
  },
  {
    type: 'Missing Helmet',
    level: 'high',
  },
  {
    type: 'Edge Proximity Breach',
    level: 'critical',
  },
  {
    type: 'Unsafe Posture Detected',
    level: 'high',
  },
  {
    type: 'Missing Gloves',
    level: 'elevated',
  },
  {
    type: 'Gas Level Rising — CO',
    level: 'high',
  },
  {
    type: 'Prolonged Static Position',
    level: 'elevated',
  },
  {
    type: 'Camera Feed Degraded',
    level: 'nominal',
  },
  {
    type: 'Thermal Anomaly Detected',
    level: 'critical',
  },
]

export function buildAlerts(count = 14) {
  return Array.from({ length: count }, (_, i) => {
    const worker = pick(workers)
    const alert = pick(ALERT_TYPES)

    return {
      id: `AL-${8800 + i}`,

      workerId: worker.id,
      workerName: worker.name,

      zoneName: worker.zoneName,

      type: alert.type,
      level: alert.level,

      time: `${randInt(0, 58)} min ago`,

      status: pick([
        'Open',
        'Acknowledged',
        'Resolved',
        'Open',
      ]),
    }
  }).sort((a, b) => a.time.localeCompare(b.time))
}

export const alerts = buildAlerts(16)

// ============================================================
// INCIDENT HISTORY
// ============================================================

export function buildIncidents(count = 24) {
  const types = [
    'Harness Disconnected',
    'Fall Arrest Triggered',
    'Missing PPE',
    'Gas Exposure',
    'Near-Miss — Edge',
    'Unsafe Posture',
  ]

  return Array.from({ length: count }, (_, i) => {
    const worker = pick(workers)
    const day = randInt(1, 28)

    return {
      id: `INC-${2200 + i}`,

      workerId: worker.id,
      workerName: worker.name,

      type: pick(types),

      level: pick([
        'critical',
        'high',
        'elevated',
      ]),

      zoneName: worker.zoneName,

      date: `2026-08-${String(day).padStart(2, '0')}`,

      time: `${String(
        randInt(6, 22)
      ).padStart(2, '0')}:${String(
        randInt(0, 59)
      ).padStart(2, '0')}`,

      status: pick([
        'Closed',
        'Under Review',
        'Closed',
        'Escalated',
      ]),
    }
  }).sort((a, b) =>
    a.date > b.date ? -1 : 1
  )
}

export const incidents = buildIncidents(26)

// ============================================================
// PPE COMPUTER VISION
// ============================================================

export const sitePpeDetections = [
  {
    id: 1,
    item: 'Helmet',
    ok: true,
    confidence: 98,
    box: {
      x: 34,
      y: 8,
      w: 16,
      h: 16,
    },
  },
  {
    id: 2,
    item: 'Harness',
    ok: true,
    confidence: 91,
    box: {
      x: 30,
      y: 26,
      w: 24,
      h: 30,
    },
  },
  {
    id: 3,
    item: 'Gloves',
    ok: false,
    confidence: 86,
    box: {
      x: 22,
      y: 44,
      w: 10,
      h: 8,
    },
  },
  {
    id: 4,
    item: 'Boots',
    ok: true,
    confidence: 97,
    box: {
      x: 32,
      y: 78,
      w: 18,
      h: 10,
    },
  },
  {
    id: 5,
    item: 'Safety Glasses',
    ok: false,
    confidence: 79,
    box: {
      x: 37,
      y: 12,
      w: 8,
      h: 5,
    },
  },
]

// ============================================================
// SITE SUMMARY
// ============================================================

export function siteSummary() {
  const total = workers.length

  const atRisk = workers.filter(
    (worker) =>
      worker.riskLevel === 'critical' ||
      worker.riskLevel === 'high'
  ).length

  const safe = total - atRisk

  const ppeViolations = workers.filter(
    (worker) => !worker.ppeOk
  ).length

  const criticalAlerts = alerts.filter(
    (alert) =>
      alert.level === 'critical' &&
      alert.status === 'Open'
  ).length

  const activeAlerts = alerts.filter(
    (alert) => alert.status !== 'Resolved'
  ).length

  const avgRisk = Math.round(
    workers.reduce(
      (sum, worker) => sum + worker.riskScore,
      0
    ) / total
  )

  return {
    total,
    atRisk,
    safe,
    ppeViolations,
    criticalAlerts,
    activeAlerts,
    avgRisk,
  }
}

// ============================================================
// DASHBOARD CHARTS
// ============================================================

export const riskTrend = Array.from(
  { length: 12 },
  (_, i) => ({
    time: `${String(6 + i).padStart(2, '0')}:00`,
    risk: randInt(20, 75),
    incidents: randInt(0, 3),
  })
)

export const zoneRiskBars = ZONES.map((zone) => ({
  name: zone.name
    .split(' ')
    .slice(0, 2)
    .join(' '),

  level: zone.level,

  score:
    zone.level === 'critical'
      ? randInt(75, 95)
      : zone.level === 'high'
        ? randInt(55, 74)
        : zone.level === 'elevated'
          ? randInt(30, 54)
          : randInt(5, 29),
}))

// ============================================================
// CAMERA HEALTH / CCTV MASTER
// ============================================================

export const cameraHealth = [
  {
    id: 'CAM-04',
    zone: 'Boiler Deck 4',
    mode: 'Thermal',
    online: true,
    fps: 10,
    latency: 1.8,
    preset: 'BOILER-DECK',
    module: 'Fall + PPE + Thermal',
  },
  {
    id: 'CAM-11',
    zone: 'Turbine Hall Roof',
    mode: 'RGB',
    online: true,
    fps: 15,
    latency: 1.4,
    preset: 'TURBINE-ROOF',
    module: 'PPE Detection',
  },
  {
    id: 'CAM-02',
    zone: 'Chimney Access Ladder',
    mode: 'RGB',
    online: true,
    fps: 10,
    latency: 2.1,
    preset: 'LADDER',
    module: 'PPE + Harness',
  },
  {
    id: 'CAM-18',
    zone: 'Boiler Flue Duct',
    mode: 'RGB',
    online: true,
    fps: 12,
    latency: 1.9,
    preset: 'FLUE-DUCT',
    module: 'Fire / Smoke',
  },
  {
    id: 'CAM-21',
    zone: 'Ash Conveyor',
    mode: 'RGB',
    online: true,
    fps: 12,
    latency: 2.0,
    preset: 'ASH-CONVEYOR',
    module: 'Smoke / Ash',
  },
  {
    id: 'CAM-23',
    zone: '220kV Switchyard Bay',
    mode: 'RGB',
    online: true,
    fps: 15,
    latency: 1.6,
    preset: 'SWITCHYARD-BAY',
    module: 'Intrusion',
  },
  {
    id: 'CAM-24',
    zone: 'Transformer T-3',
    mode: 'RGB',
    online: true,
    fps: 15,
    latency: 1.7,
    preset: 'TRANSFORMER-T3',
    module: 'Climb Detection',
  },
  {
    id: 'CAM-26',
    zone: 'Electrical Switchyard',
    mode: 'Thermal',
    online: true,
    fps: 10,
    latency: 1.8,
    preset: 'ARC-ZONE',
    module: 'Arc Flash + Thermal',
  },
  {
    id: 'CAM-44',
    zone: 'AHP Pipeline P7',
    mode: 'RGB',
    online: true,
    fps: 10,
    latency: 2.2,
    preset: 'AHP-P7',
    module: 'Ash Leakage',
  },
  {
    id: 'CAM-41',
    zone: 'ESP Hopper H-12',
    mode: 'RGB',
    online: true,
    fps: 10,
    latency: 2.4,
    preset: 'ESP-H12',
    module: 'Ash Leakage',
  },
  {
    id: 'CAM-07',
    zone: 'Switchyard Gantry',
    mode: 'Thermal',
    online: true,
    fps: 10,
    latency: 2.0,
    preset: 'GANTRY',
    module: 'Switchyard',
  },
  {
    id: 'CAM-13',
    zone: 'Cooling Tower Rim',
    mode: 'Thermal',
    online: true,
    fps: 10,
    latency: 2.3,
    preset: 'COOLING',
    module: 'Thermal + Steam',
  },
  {
    id: 'CAM-09',
    zone: 'Coal Conveyor',
    mode: 'RGB',
    online: true,
    fps: 10,
    latency: 2.6,
    preset: 'CONVEYOR',
    module: 'Fire / Smoke',
  },
  {
    id: 'CAM-31',
    zone: 'Ash Handling Roof',
    mode: 'RGB',
    online: false,
    fps: 0,
    latency: 0,
    preset: 'AHP-ROOF',
    module: 'General Surveillance',
  },
]

// ============================================================
// MAN DOWN / FALL DETECTION
// ============================================================

export const manDownTracks = [
  {
    id: 'TRK-201',
    cameraId: 'CAM-04',
    workerId: 'NTPC-1001',
    state: 'FALLEN',
    confidence: 96,
    durationSec: 9.4,
  },
  {
    id: 'TRK-117',
    cameraId: 'CAM-11',
    workerId: 'NTPC-1007',
    state: 'STANDING',
    confidence: 98,
    durationSec: 0,
  },
]

// ============================================================
// FIRE / SMOKE EVENTS
// ============================================================

export const fireSmokeEvents = [
  {
    id: 'FS-001',
    cameraId: 'CAM-18',
    zone: 'Boiler Flue Duct',
    detected: true,
    type: 'Black Smoke',
    confidence: 94,
    durationSec: 18,
    severity: 'critical',
  },
  {
    id: 'FS-002',
    cameraId: 'CAM-21',
    zone: 'Ash Conveyor',
    detected: true,
    type: 'Grey / Ash',
    confidence: 89,
    durationSec: 11,
    severity: 'high',
  },
  {
    id: 'FS-003',
    cameraId: 'CAM-13',
    zone: 'Cooling Tower Rim',
    detected: false,
    type: 'White Steam',
    confidence: 97,
    durationSec: 35,
    severity: 'safe',
  },
]

// ============================================================
// SWITCHYARD EVENTS
// ============================================================

export const switchyardEvents = [
  {
    id: 'SW-001',
    cameraId: 'CAM-23',
    zone: '220kV Switchyard Bay',
    object: 'Person',
    intrusion: true,
    climb: false,
    arcFlash: false,
    severity: 'critical',
  },
  {
    id: 'SW-002',
    cameraId: 'CAM-24',
    zone: 'Transformer T-3',
    object: 'Person',
    intrusion: false,
    climb: true,
    arcFlash: false,
    severity: 'high',
  },
  {
    id: 'SW-003',
    cameraId: 'CAM-26',
    zone: 'Electrical Switchyard',
    object: 'Electrical anomaly',
    intrusion: false,
    climb: false,
    arcFlash: true,
    severity: 'critical',
  },
  {
    id: 'SW-004',
    cameraId: 'CAM-07',
    zone: 'Switchyard Gantry',
    object: 'Animal',
    intrusion: true,
    climb: false,
    arcFlash: false,
    severity: 'high',
  },
]

// ============================================================
// ASH LEAK EVENTS
// ============================================================

export const ashLeakEvents = [
  {
    id: 'ASH-001',
    cameraId: 'CAM-44',
    location: 'AHP Pipeline P7 Junction',
    areaM2: 4.2,
    confidence: 93,
    severity: 'high',
  },
  {
    id: 'ASH-002',
    cameraId: 'CAM-41',
    location: 'ESP Hopper H-12',
    areaM2: 1.7,
    confidence: 88,
    severity: 'elevated',
  },
]

// ============================================================
// REPORTS
// ============================================================

export const reportRuns = [
  {
    id: 'RPT-01',
    title: 'Daily Safety Summary',
    period: '27 Aug 2026',
    generated: '12:05',
    status: 'Ready',
  },
  {
    id: 'RPT-02',
    title: 'PPE Compliance Report',
    period: 'Shift A',
    generated: '11:40',
    status: 'Ready',
  },
  {
    id: 'RPT-03',
    title: 'Incident & Closure Report',
    period: '20–27 Aug 2026',
    generated: '09:30',
    status: 'Ready',
  },
  {
    id: 'RPT-04',
    title: 'AI Module Performance',
    period: 'Last 7 days',
    generated: 'Pending',
    status: 'Queued',
  },
]
// ============================================================
// CAMERA AI DETECTIONS
// ============================================================

export const cameraDetections = {
  'CAM-04': [
    {
      id: 'DET-FALL-01',
      label: 'FALLEN PERSON',
      type: 'fallen',
      confidence: 96,
      severity: 'critical',

      x: 31,
      y: 48,
      w: 30,
      h: 27,

      details:
        'Fall persisted for 9.4 seconds',

      trackId: 'TRK-201',

      ppe: {
        helmet: true,
        gloves: true,
        boots: true,
        harness: true,
      },
    },

    {
      id: 'DET-HELMET-01',
      label: 'HELMET MISSING',
      type: 'ppe',
      confidence: 93,
      severity: 'high',

      x: 68,
      y: 22,
      w: 14,
      h: 45,

      details: 'Helmet not detected',

      trackId: 'TRK-202',

      ppe: {
        helmet: false,
        gloves: true,
        boots: true,
        harness: true,
      },
    },
  ],

  'CAM-11': [
    {
      id: 'DET-PPE-01',
      label: 'PPE VIOLATION',
      type: 'ppe',
      confidence: 92,
      severity: 'high',

      x: 18,
      y: 17,
      w: 23,
      h: 65,

      details:
        'Gloves + safety glasses missing',

      trackId: 'TRK-117',

      ppe: {
        helmet: true,
        gloves: false,
        boots: true,
        harness: true,
        safetyGlasses: false,
      },
    },

    {
      id: 'DET-SAFE-01',
      label: 'PERSON · PPE OK',
      type: 'safe',
      confidence: 98,
      severity: 'safe',

      x: 59,
      y: 20,
      w: 21,
      h: 62,

      details:
        'Required PPE detected',

      trackId: 'TRK-118',

      ppe: {
        helmet: true,
        gloves: true,
        boots: true,
        harness: true,
        safetyGlasses: true,
      },
    },
  ],

  'CAM-02': [
    {
      id: 'DET-HARNESS-01',
      label: 'HARNESS MISSING',
      type: 'ppe',
      confidence: 95,
      severity: 'critical',

      x: 43,
      y: 18,
      w: 24,
      h: 68,

      details:
        'Worker inside height-work zone',

      trackId: 'TRK-311',

      ppe: {
        helmet: true,
        gloves: true,
        boots: true,
        harness: false,
      },
    },
  ],

  'CAM-18': [
    {
      id: 'DET-SMOKE-01',
      label: 'BLACK SMOKE',
      type: 'smoke',
      confidence: 94,
      severity: 'critical',

      x: 47,
      y: 20,
      w: 35,
      h: 42,

      details:
        'Dense plume · 18 sec persistence',

      smokeType: 'Black Smoke',
      opacityBand: 'Dense',
      durationSec: 18,
    },
  ],

  'CAM-21': [
    {
      id: 'DET-SMOKE-02',
      label: 'GREY / ASH',
      type: 'smoke',
      confidence: 89,
      severity: 'high',

      x: 38,
      y: 24,
      w: 36,
      h: 38,

      details:
        'Moderate ash plume · 11 sec persistence',

      smokeType: 'Grey / Ash',
      opacityBand: 'Moderate',
      durationSec: 11,
    },
  ],

  'CAM-23': [
    {
      id: 'DET-INTRUSION-01',
      label: 'RESTRICTED ZONE',
      type: 'intrusion',
      confidence: 97,
      severity: 'critical',

      x: 54,
      y: 28,
      w: 19,
      h: 54,

      details:
        'Person inside 220kV restricted bay',

      object: 'Person',

      intrusion: true,
      climb: false,
      arcFlash: false,
    },
  ],

  'CAM-24': [
    {
      id: 'DET-CLIMB-01',
      label: 'CLIMB DETECTED',
      type: 'intrusion',
      confidence: 90,
      severity: 'high',

      x: 42,
      y: 18,
      w: 18,
      h: 62,

      details:
        'Unauthorized climbing near Transformer T-3',

      object: 'Person',

      intrusion: false,
      climb: true,
      arcFlash: false,
    },
  ],

  'CAM-26': [
    {
      id: 'DET-ARC-01',
      label: 'ARC FLASH ANOMALY',
      type: 'thermal',
      confidence: 86,
      severity: 'critical',

      x: 46,
      y: 34,
      w: 30,
      h: 30,

      details:
        'Electrical flash pattern detected',

      intrusion: false,
      climb: false,
      arcFlash: true,
    },
  ],

  'CAM-44': [
    {
      id: 'DET-ASH-01',
      label: 'ASH LEAKAGE',
      type: 'ash',
      confidence: 93,
      severity: 'high',

      x: 32,
      y: 58,
      w: 42,
      h: 23,

      details:
        'Estimated spillage area: 4.2 m²',

      areaM2: 4.2,

      location:
        'AHP Pipeline P7 Junction',
    },
  ],

  'CAM-41': [
    {
      id: 'DET-ASH-02',
      label: 'DRY ASH SPILLAGE',
      type: 'ash',
      confidence: 88,
      severity: 'elevated',

      x: 26,
      y: 62,
      w: 38,
      h: 20,

      details:
        'Estimated spillage area: 1.7 m²',

      areaM2: 1.7,

      location:
        'ESP Hopper H-12',
    },
  ],

  'CAM-07': [
    {
      id: 'DET-SW-01',
      label: 'ANIMAL INTRUSION',
      type: 'intrusion',
      confidence: 92,
      severity: 'high',

      x: 61,
      y: 55,
      w: 22,
      h: 22,

      details:
        'Restricted switchyard area',

      object: 'Animal',

      intrusion: true,
      climb: false,
      arcFlash: false,
    },
  ],

  'CAM-13': [
    {
      id: 'DET-THERMAL-01',
      label: 'THERMAL HOTSPOT',
      type: 'thermal',
      confidence: 91,
      severity: 'high',

      x: 30,
      y: 36,
      w: 28,
      h: 33,

      details:
        'Surface temperature 68°C',

      temperatureC: 68,
    },

    {
      id: 'DET-STEAM-01',
      label: 'WHITE STEAM',
      type: 'smoke',
      confidence: 97,
      severity: 'safe',

      x: 57,
      y: 17,
      w: 28,
      h: 34,

      details:
        'Classified as steam · no smoke alarm',

      smokeType: 'White Steam',
      opacityBand: 'Light',
      durationSec: 35,
    },
  ],

  'CAM-09': [],
  'CAM-31': [],
}

// ============================================================
// CAMERA HELPERS
// ============================================================

export function getCameraDetections(cameraId) {
  return cameraDetections[cameraId] || []
}

export function getCameraById(cameraId) {
  return (
    cameraHealth.find(
      (camera) => camera.id === cameraId
    ) || null
  )
}

export function getCriticalCameraDetections() {
  return Object.entries(
    cameraDetections
  ).flatMap(([cameraId, detections]) =>
    detections
      .filter(
        (detection) =>
          detection.severity === 'critical'
      )
      .map((detection) => ({
        cameraId,
        ...detection,
      }))
  )
}

export function cameraAnalyticsSummary() {
  const all = Object.values(
    cameraDetections
  ).flat()

  return {
    totalDetections: all.length,

    critical: all.filter(
      (detection) =>
        detection.severity === 'critical'
    ).length,

    ppeViolations: all.filter(
      (detection) =>
        detection.type === 'ppe' &&
        detection.severity !== 'safe'
    ).length,

    fallenPersons: all.filter(
      (detection) =>
        detection.type === 'fallen'
    ).length,

    smokeEvents: all.filter(
      (detection) =>
        detection.type === 'smoke' &&
        detection.severity !== 'safe'
    ).length,

    intrusions: all.filter(
      (detection) =>
        detection.type === 'intrusion'
    ).length,

    ashLeaks: all.filter(
      (detection) =>
        detection.type === 'ash'
    ).length,

    thermalAnomalies: all.filter(
      (detection) =>
        detection.type === 'thermal'
    ).length,
  }
}