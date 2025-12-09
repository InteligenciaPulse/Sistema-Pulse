import React from "react";
import "../styles/Sidebar.css";

import { BarChart2, Users, Package, Settings, LayoutGrid, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className={`sidebar-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className="sidebar" onClick={(e) => e.stopPropagation()}>

        {/* Botão fechar */}
        <button className="sidebar-close-btn" onClick={onClose}>
          <X size={22} />
        </button>

        <h2 className="sidebar-title">Menu</h2>

        <nav className="sidebar-nav">

          {/* NOVO: botão para a tela Kanban */}
          <button onClick={() => navigate("/")}>
            <LayoutGrid size={18} /> Kanban
          </button>

          <button onClick={() => navigate("/relatorios")}>
            <BarChart2 size={18} /> Relatórios
          </button>

          <button onClick={() => navigate("/pacientes")}>
            <Users size={18} /> Pacientes
          </button>

          <button onClick={() => navigate("/produtos")}>
            <Package size={18} /> Produtos
          </button>

          <button onClick={() => navigate("/descontos")}>
            <Package size={18} /> Ajustar Descontos
          </button>

          <button onClick={() => navigate("/configuracoes")}>
            <Settings size={18} /> Configurações
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
