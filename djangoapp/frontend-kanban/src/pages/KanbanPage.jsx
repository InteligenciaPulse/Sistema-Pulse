import React, { useState } from 'react';
import KanbanBoard from '../components/Kanban/KanbanBoard';
import Sidebar from '../components/Sidebar';
import '../styles/Kanban/KanbanPage.css';

import { Menu } from "lucide-react";

const KanbanPage = ({ visibleFields, setVisibleFields }) => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="kanban-page-container">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <header className="navbar">
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={26} />
        </button>

        <h1>Sistema Pulse</h1>
      </header>

      <main className="content">
        <KanbanBoard visibleFields={visibleFields} />
      </main>

      <footer>
        &copy; 2025 Sistema Pulse - Todos os direitos reservados.
      </footer>

    </div>
  );
};

export default KanbanPage;
