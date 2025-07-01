// src/pages/KanbanPage.jsx

import React from 'react';
import KanbanBoard from '../components/KanbanBoard';
import CardSettings from '../components/CardSettings';

const KanbanPage = ({ visibleFields, setVisibleFields }) => {
  return (
    <div>
      <CardSettings
        visibleFields={visibleFields}
        setVisibleFields={setVisibleFields}
      />

      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '10px' }}>Kanban de Orçamentos</h2>
        <KanbanBoard visibleFields={visibleFields} />
      </div>
    </div>
  );
};

export default KanbanPage;
