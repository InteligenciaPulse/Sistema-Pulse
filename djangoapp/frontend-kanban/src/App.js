// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KanbanPage from './pages/KanbanPage';
// import CriarOrcamento from './pages/CriarOrcamento';
// import EditarOrcamento from './pages/EditarOrcamento';
// import Historico from './pages/Historico';
// import Login from './pages/Login';

function App() {
  const [visibleFields, setVisibleFields] = useState({
    valor_total: true,
    paciente: true,
    data_criacao: true,
    anotacao: false,
    status: false,
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<KanbanPage visibleFields={visibleFields} setVisibleFields={setVisibleFields}/>} />
        {/* <Route path="/orcamentos/criar" element={<CriarOrcamento />} />
        <Route path="/editar_orcamento/:id" element={<EditarOrcamento />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
