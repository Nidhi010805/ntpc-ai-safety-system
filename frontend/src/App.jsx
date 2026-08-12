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
    </div>
  );
}

export default App;
