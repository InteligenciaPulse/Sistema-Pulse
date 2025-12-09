// src/App.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KanbanPage from './pages/KanbanPage';
import CriarOrcamento from "./pages/CriarOrcamento";
import RelatoriosPage from "./pages/RelatoriosPage";
import DescontosPage from "./pages/DescontosPage";

function App() {
  useEffect(() => {
    axios.get('/api/csrf/');
  }, []);

  const [visibleFields, setVisibleFields] = useState({
    valor_total: true,
    paciente: true,
    data_criacao: true,
    // anotacao: false,
    status: true,
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<KanbanPage visibleFields={visibleFields} setVisibleFields={setVisibleFields}/>} />
        <Route path='/create' element={<CriarOrcamento />}/>
        <Route path="/relatorios" element={<RelatoriosPage />} />
        <Route path="/descontos" element={<DescontosPage />} />
      </Routes>
    </Router>
  );
}

export default App;