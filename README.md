# HeightSafe-X

HeightSafe-X is a responsive safety-monitoring dashboard for NTPC work-at-height operations. It brings worker risk, PPE status, camera and thermal events, plant hazards, alerts, incident history, and evacuation guidance into one interface.

> This repository currently contains the frontend prototype. It uses simulated data and is ready to be connected to a REST, WebSocket, or MQTT backend.

## Features

- Safety overview dashboard with risk trends, zone summaries, camera health, and active alerts
- Live worker monitoring and individual worker risk details
- PPE compliance tracking
- Fire and smoke, man-down, switchyard, and ash-leakage monitoring
- Interactive digital twin, risk heatmap, and predictive unsafe zones
- Evacuation-route guidance and camera/thermal monitoring
- Alerts, incident history, reports, and system-health pages
- Responsive desktop and mobile navigation

## Technology

- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- Recharts
- Lucide React icons

## Getting started

### Prerequisites

- Node.js 20 or later
- npm

### Install and run

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

### Other commands

```bash
npm run build    # create a production build in frontend/dist
npm run preview  # preview the production build locally
npm run lint     # run Oxlint
```

## Application routes

| Route | Module |
| --- | --- |
| `/login` | Login |
| `/` | Safety dashboard |
| `/monitoring` | Live worker monitoring |
| `/fire-smoke` | Fire and smoke monitoring |
| `/ppe` | PPE compliance |
| `/man-down` | Man-down detection |
| `/switchyard` | Switchyard safety |
| `/ash-leakage` | Ash-leakage monitoring |
| `/digital-twin` | Digital twin |
| `/heatmap` | Risk and hazard heatmap |
| `/predictive` | Predictive unsafe zones |
| `/evacuation` | Evacuation routes |
| `/camera` | Camera and thermal monitoring |
| `/alerts` | Real-time alerts |
| `/incidents` | Incident history |
| `/reports` | Safety reports |
| `/system-health` | System health |
| `/worker/:id` | Worker detail and risk explanation |

## Project structure

```text
heightsafe-x/
├── README.md
└── frontend/
    ├── public/             # Static icons and favicon
    └── src/
        ├── components/     # Shared layout and UI components
        ├── data/           # Simulated plant, worker, alert, and sensor data
        ├── lib/            # Shared risk-level utilities
        ├── pages/          # Route-level screens
        ├── App.jsx         # Route configuration
        └── index.css       # Design tokens and global styles
```

## Connecting a backend

The UI is currently powered by [`frontend/src/data/mockData.js`](frontend/src/data/mockData.js). Replace or wrap these exports with your backend data source while retaining the object shapes used by the pages.

For production integration:

1. Fetch initial workers, zones, alerts, incidents, and camera data from REST endpoints.
2. Subscribe to live sensor events through WebSocket or MQTT.
3. Store incoming data in React state or a dedicated state-management layer.
4. Pass the normalized data to existing screens, including risk score, PPE status, zone, camera event, and severity fields.

## Notes

- The digital twin is a 2D top-down plant view in this frontend build.
- The dashboard is a UI prototype; alert decisions and safety actions must be validated by qualified operational teams before production use.
