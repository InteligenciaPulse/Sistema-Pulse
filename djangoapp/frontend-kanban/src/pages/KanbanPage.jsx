// src/pages/KanbanPage.jsx

// import React, { useState } from 'react';
import KanbanBoard from '../components/KanbanBoard';
// import CardSettingsModal from '../components/CardSettings';
import './KanbanPage.css';

const KanbanPage = ({ visibleFields, setVisibleFields }) => {
  // const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="kanban-page-container">
      <header className="navbar">
        <h1>Sistema Pulse</h1>
      </header>

      <main className="content">
        <div className="kanban-header">
          {/* <CardSettingsModal visibleFields={visibleFields} setVisibleFields={setVisibleFields} /> */}
          {/* <button className="settings-btn" onClick={() => setSettingsOpen(true)}>
            ⚙️ Exibir Campos
          </button> */}
        </div>

        <KanbanBoard visibleFields={visibleFields} />

        {/* {settingsOpen && (
          <CardSettingsModal
            visibleFields={visibleFields}
            setVisibleFields={setVisibleFields}
            onClose={() => setSettingsOpen(false)}
          />
        )} */}
      </main>

      <footer>
        &copy; 2025 Sistema Pulse - Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default KanbanPage;
