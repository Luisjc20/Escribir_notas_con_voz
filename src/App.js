import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import RegistrarNota from './RegistrarNota'; // Importa RegistrarNota

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para el componente Login */}
        <Route path="/" element={<Login />} />

        {/* Ruta para el componente Dashboard */}
        <Route path="/dashboard/*" element={<Dashboard />} />

        {/* Ruta para el componente RegistrarNota */}
        <Route path="/registrar-nota" element={<RegistrarNota />} />
      </Routes>
    </Router>
  );
}

export default App;