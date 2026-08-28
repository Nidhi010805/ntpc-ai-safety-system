# HeightSafe‑X — Frontend

A predictive work-at-height safety console for NTPC, built to spec from the
project's frontend plan. This folder is the **frontend only** — it renders
whatever the AI/sensor backend sends; it does not train models or run sensors.

## Stack
- React 19 + Vite
- Tailwind CSS v4 (design tokens in `src/index.css`)
- React Router v7 for navigation
- Recharts for charts
- lucide-react for icons

## Getting started
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
```

## Structure
```
src/
├── components/     Sidebar, Topbar, Layout, Panel, StatusBadge, RiskGauge, StatCard
├── pages/          One file per route (see below)
├── data/           mockData.js — simulated backend feed (swap for real API/WebSocket/MQTT)
├── lib/            levels.js — shared risk-level -> color/label config
└── index.css       Design tokens (colors, fonts) + global styles
```

## Pages / routes
| Route          | Page               | Matches plan section |
|----------------|---------------------|------------------------|
| /login         | Login                | Login |
| /              | Dashboard             | Main Safety Dashboard |
| /monitoring    | Live Worker Monitoring | Live Worker Monitoring |
| /ppe           | PPE Compliance         | PPE Compliance Visualization |
| /digital-twin  | Digital Twin           | 3D Digital Twin (2D top-down twin; swap in React Three Fiber for full 3D) |
| /heatmap       | Risk Heatmap           | Risk & Hazard Heatmap |
| /predictive    | Predictive Zones       | Predictive Unsafe-Zone Visualization |
| /evacuation    | Evacuation             | Safe Route & Evacuation Guidance |
| /camera        | Camera / Thermal       | Camera/Thermal Monitoring |
| /alerts        | Alerts                 | Real-Time Safety Alerts |
| /incidents     | Incident History       | Incident & Alert History |
| /worker/:id    | Worker Detail          | Worker Detail + Explainable AI Panel |

## Connecting to the real backend
Everything currently reads from `src/data/mockData.js`. To go live:
1. Replace the exported arrays/functions with REST calls (fetch/axios) on mount.
2. For live updates, open a WebSocket or MQTT client (e.g. `mqtt.js`) and update
   the same state shape the components already expect (`workers`, `zones`, `alerts`, `incidents`).
3. Keep the shape of each object (see `mockData.js`) the same, or update the
   components that read from it — they were kept close to what the plan's
   AI outputs look like (risk score, PPE list, harness boolean, zone id, etc.).

## Notes
- Color palette and type system live in `src/index.css` under `@theme`.
- All pages are responsive from small mobile widths up through wide desktop.
- The 3D Digital Twin page ships as a 2D top-down interactive site view for
  this build; the plan's React Three Fiber 3D scene can be dropped into
  `src/pages/DigitalTwin.jsx` without touching the rest of the app.
