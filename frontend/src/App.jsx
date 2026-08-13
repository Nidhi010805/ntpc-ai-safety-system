<<<<<<< HEAD
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <div className="flex-1">
        <Navbar />
        <Dashboard />
      </div>

=======
import React from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';

function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Header />
        <div className="dashboard-scroll-area">
          <Dashboard />
        </div>
      </main>
>>>>>>> 27338845b2b4659db0d9f3aecb3a63a79a936a68
    </div>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 27338845b2b4659db0d9f3aecb3a63a79a936a68
