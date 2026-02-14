// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from "./components/auth/PrivateRoute";
import { AuthProvider } from "./components/auth/AuthContext";
import Login from './pages/Login';
import KanbanPage from './pages/KanbanPage';
import CriarOrcamento from "./pages/CriarOrcamento";
import RelatoriosPage from "./pages/RelatoriosPage";
import DescontosPage from "./pages/DescontosPage";

function App() {
  const [visibleFields, setVisibleFields] = useState({
    valor_total: true,
    paciente: true,
    data_criacao: true,
    status: true,
  });

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={ <PrivateRoute>
              <KanbanPage
                visibleFields={visibleFields}
                setVisibleFields={setVisibleFields}
              />
            </PrivateRoute>
            }
          />

          <Route path="/create" element={<PrivateRoute> <CriarOrcamento /> </PrivateRoute>} />
          <Route path="/relatorios" element={<PrivateRoute> <RelatoriosPage /> </PrivateRoute>} />
          <Route path="/descontos" element={<PrivateRoute> <DescontosPage /> </PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
