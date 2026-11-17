# HeightSafe-X

HeightSafe-X is a responsive industrial safety-monitoring dashboard designed for work-at-height operations and industrial plant environments. It provides a centralized interface for monitoring worker safety, PPE compliance, fire and smoke events, camera activity, plant hazards, alerts, incident history, and evacuation guidance.

The project combines a React-based frontend with a FastAPI backend for supported monitoring workflows. It is designed to integrate computer vision models and real-time safety data into a unified monitoring platform.

## Features

### Safety Monitoring Dashboard
- Safety overview dashboard with risk trends, zone summaries, camera health, and active alerts.
- Worker monitoring and individual worker risk details.
- PPE compliance tracking and detection results.
- Fire and smoke monitoring.
- Alerts, incident history, reports, and system-health pages.

### Industrial Safety Modules
- Man-down detection.
- Switchyard safety monitoring.
- Ash-leakage monitoring.
- Interactive digital twin and risk heatmap.
- Predictive unsafe-zone visualization.
- Evacuation-route guidance.
- Camera and thermal monitoring.

### PPE Detection
- Upload video footage for PPE compliance analysis.
- Create and track PPE detection jobs.
- Process uploaded videos through a separate model worker.
- Retrieve detection results and annotated videos.
- Display PPE compliance information and violation details.

### Fire and Smoke Detection
- Dedicated fire and smoke monitoring interface.
- Backend integration for video-processing workflows.
- Detection status and monitoring results.

## Technology Stack

### Frontend
- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- Recharts
- Lucide React Icons

### Backend
- Python
- FastAPI
- Uvicorn
- REST APIs
- Background job processing

### Computer Vision and Processing
- Computer vision model integration
- Video-based inference
- PPE detection and compliance analysis
- Annotated video generation
- Worker-based processing architecture

## Getting Started

### Prerequisites
- Node.js 20 or later
- npm
- Python 3.10 or later
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd heightsafe-x
```

### 2. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally:

`http://localhost:5173`

### 3. Run the Backend

Open another terminal:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8001
```

The backend will normally be available at:

`http://localhost:8001`

API documentation:

`http://localhost:8001/docs`

### 4. Configure the Frontend API

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8001
```

Restart the Vite development server after changing environment variables.

## Application Routes

| Route | Module |
|---|---|
| `/login` | Login |
| `/` | Safety Dashboard |
| `/monitoring` | Live Worker Monitoring |
| `/fire-smoke` | Fire and Smoke Monitoring |
| `/ppe` | PPE Compliance |
| `/man-down` | Man-Down Detection |
| `/switchyard` | Switchyard Safety |
| `/ash-leakage` | Ash-Leakage Monitoring |
| `/digital-twin` | Digital Twin |
| `/heatmap` | Risk and Hazard Heatmap |
| `/predictive` | Predictive Unsafe Zones |
| `/evacuation` | Evacuation Routes |
| `/camera` | Camera and Thermal Monitoring |
| `/alerts` | Real-Time Alerts |
| `/incidents` | Incident History |
| `/reports` | Safety Reports |
| `/system-health` | System Health |
| `/worker/:id` | Worker Details and Risk Explanation |

## PPE Detection Workflow

The PPE module follows a job-based processing architecture.

1. A user uploads a video through the PPE Compliance page.
2. The FastAPI backend stores the uploaded video and creates a detection job.
3. The job is added to the processing queue.
4. A separate PPE worker polls the backend for pending jobs.
5. The worker downloads the input video and runs the configured detection model.
6. The worker uploads the detection results and annotated video.
7. The backend updates the job status.
8. The frontend retrieves the completed results and displays the detection summary.

The worker can run on a separate machine and communicate with the backend through an accessible API endpoint.

### PPE API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/ppe/health` | Check PPE service health |
| POST | `/api/ppe/jobs` | Upload video and create a job |
| GET | `/api/ppe/jobs` | Retrieve PPE jobs |
| GET | `/api/ppe/jobs/{job_id}` | Retrieve job status |
| GET | `/api/ppe/jobs/{job_id}/results` | Retrieve detection results |
| GET | `/api/ppe/jobs/{job_id}/video` | Retrieve annotated video |
| POST | `/api/ppe/worker/heartbeat` | Worker health update |
| GET | `/api/ppe/worker/jobs/next` | Fetch the next pending job |
| GET | `/api/ppe/worker/jobs/{job_id}/input` | Download input video |
| POST | `/api/ppe/worker/jobs/{job_id}/progress` | Update processing progress |
| POST | `/api/ppe/worker/jobs/{job_id}/upload-video` | Upload annotated video |
| POST | `/api/ppe/worker/jobs/{job_id}/complete` | Mark job as completed |
| POST | `/api/ppe/worker/jobs/{job_id}/fail` | Mark job as failed |

## Project Structure

```text
heightsafe-x/
│
├── README.md
│
├── backend/
│   ├── app.py
│   ├── routes/
│   ├── services/
│   ├── ppe_worker/
│   └── requirements.txt
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── data/
    │   ├── lib/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   └── index.css
    ├── .env
    └── package.json
```

## Other Frontend Commands

Run these commands from the `frontend` directory:

```bash
npm run build
npm run preview
npm run lint
```

- `npm run build` creates a production build in `frontend/dist`.
- `npm run preview` previews the production build locally.
- `npm run lint` runs Oxlint.

## Backend Integration

HeightSafe-X uses a backend-driven architecture to connect its frontend modules with safety-monitoring services.

The frontend communicates with the backend through REST APIs. Supported monitoring workflows retrieve job status, detection results, and processed video data from the backend.

### Integration Architecture

1. The frontend sends requests to the backend APIs.
2. The backend handles requests and manages processing jobs.
3. Computer vision workers process uploaded video footage.
4. Processing results are sent back to the backend.
5. The frontend retrieves and displays the latest available results.

### Real-Time Communication

The architecture supports integration with:
- REST APIs for data retrieval and processing requests.
- WebSocket for real-time updates.
- MQTT for sensor and IoT communication.

Additional monitoring services can be integrated through the same architecture.

### Data and Safety

- Backend responses are used to populate connected monitoring interfaces.
- Detection results are displayed according to the data returned by the configured processing service.
- Worker authentication tokens and environment variables must be configured securely.
- API credentials and `.env` files must never be committed to GitHub.
## Deployment and Network Communication

- The frontend and backend can run independently.
- The backend can be exposed through a secure HTTPS endpoint for remote worker communication.
- A separate model-processing machine can connect to the backend using the exposed API endpoint.
- Worker authentication tokens and environment variables must be configured securely.
- Do not commit `.env` files, API tokens, or model credentials to GitHub.

## Notes

- The digital twin currently uses a 2D top-down plant representation.
- Some dashboard modules continue to use simulated data and require further backend integration.
- PPE processing depends on the availability of the configured model worker.
- Fire and Smoke and PPE are separate monitoring workflows.
- This project is intended as a safety-monitoring and decision-support platform. Detection results, alert decisions, and operational safety actions must be validated by qualified personnel before production deployment.
