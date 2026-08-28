import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import LiveMonitoring from './pages/LiveMonitoring'
import FireSmoke from './pages/FireSmoke'
import PpeCompliance from './pages/PpeCompliance'
import ManDown from './pages/ManDown'
import SwitchyardSafety from './pages/SwitchyardSafety'
import AshLeakage from './pages/AshLeakage'
import DigitalTwin from './pages/DigitalTwin'
import RiskHeatmap from './pages/RiskHeatmap'
import PredictiveZones from './pages/PredictiveZones'
import Evacuation from './pages/Evacuation'
import CameraThermal from './pages/CameraThermal'
import Alerts from './pages/Alerts'
import IncidentHistory from './pages/IncidentHistory'
import Reports from './pages/Reports'
import SystemHealth from './pages/SystemHealth'
import WorkerDetail from './pages/WorkerDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/monitoring" element={<LiveMonitoring />} />
        <Route path="/fire-smoke" element={<FireSmoke />} />
        <Route path="/ppe" element={<PpeCompliance />} />
        <Route path="/man-down" element={<ManDown />} />
        <Route path="/switchyard" element={<SwitchyardSafety />} />
        <Route path="/ash-leakage" element={<AshLeakage />} />
        <Route path="/digital-twin" element={<DigitalTwin />} />
        <Route path="/heatmap" element={<RiskHeatmap />} />
        <Route path="/predictive" element={<PredictiveZones />} />
        <Route path="/evacuation" element={<Evacuation />} />
        <Route path="/camera" element={<CameraThermal />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/incidents" element={<IncidentHistory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/system-health" element={<SystemHealth />} />
        <Route path="/worker/:id" element={<WorkerDetail />} />
      </Route>
    </Routes>
  )
}
