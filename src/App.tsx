import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import PartsList from './pages/PartsList';
import PartDetail from './pages/PartDetail';
import MovementsList from './pages/MovementsList';
import Settings from './pages/Settings';
import QuoteGenerator from './pages/QuoteGenerator';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/parts" element={<PartsList />} />
          <Route path="/parts/:id" element={<PartDetail />} />
          <Route path="/movements" element={<MovementsList />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/quotes" element={<QuoteGenerator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;