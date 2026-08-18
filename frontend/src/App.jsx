import "./App.css";

import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LiveMonitoring from "./pages/LiveMonitoring";
import Settings from "./pages/Settings";
import FireSmoke from "./pages/FireSmoke";
import AshLeakage from "./pages/AshLeakage";
import Switchyard from "./pages/Switchyard";

function App() {
  const location = useLocation();

  const isLoginPage =
    location.pathname === "/login";

  return (
    <div className="min-h-screen bg-[#0f1418]">
      {/* Login page par sidebar nahi dikhega */}
      {!isLoginPage && <Sidebar />}

      <Routes>
        {/* First Page */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Dashboard */}

        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* Live Monitoring */}

        <Route
          path="/live-monitoring"
          element={<LiveMonitoring />}
        />
        <Route
  path="/settings"
  element={<Settings />}
/>

        {/* Other Pages */}

        <Route
          path="/alerts"
          element={
            <ComingSoon title="Alerts" />
          }
        />

        <Route
          path="/ppe-detection"
          element={
            <ComingSoon title="PPE Detection" />
          }
        />

        <Route
          path="/fire-safety"
          element={<FireSmoke />}
        />

        <Route
          path="/harness-monitoring"
          element={
            <ComingSoon title="Harness Monitoring" />
          }
        />

        <Route
          path="/switchyard-safety"
          element={<Switchyard />}
        />

        <Route
          path="/ash-handling"
          element={<AshLeakage />}
        />

        <Route
          path="/fallen-person"
          element={
            <ComingSoon title="Fallen Person" />
          }
        />

        <Route
          path="/zone-map"
          element={
            <ComingSoon title="Zone Map" />
          }
        />

        <Route
          path="/analytics"
          element={
            <ComingSoon title="Analytics" />
          }
        />

        <Route
          path="/reports"
          element={
            <ComingSoon title="Reports" />
          }
        />

        <Route
          path="/cameras"
          element={
            <ComingSoon title="Cameras" />
          }
        />

        <Route
          path="/settings"
          element={
            <ComingSoon title="Settings" />
          }
        />

        {/* Invalid URL */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
      </Routes>
    </div>
  );
}

function ComingSoon({ title }) {
  return (
    <main className="min-h-screen bg-[#0f1418] px-4 pb-6 pt-24 text-[#dee3e8] md:ml-[240px] md:px-6">
      <h1 className="text-2xl font-bold">
        {title}
      </h1>

      <p className="mt-2 text-sm text-[#bdc8d1]">
        This page is under development.
      </p>
    </main>
  );
}

export default App;
