import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/RelatoriosPage.css";

import { Menu } from "lucide-react";

const RelatoriosPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState({
    orcamento: true,
    tipo_do_orcamento: true,
    pagamento: true,
    canal: true,
    status: true,
    paciente: true,
    responsavel: true,
    procedimentos: true,
    observaoes: true,
    parceiros: true,
    produtos: true,
    produto_repasse: true,
    produto_particular: true,
    produto_venda: true,
    comissao_indicacao: true,
    comissao_venda: true,
    brindes: true,
    impostos: true,
    cartoes: true,
    margem_lucro: true,
    valor_total: true,
    data_criacao: true,
  });

  const [filters, setFilters] = useState({
    data_inicio: "",
    data_fim: "",
    status: "",
    responsavel: "",
  });

  const handleColumnToggle = (column) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const gerarRelatorio = () => {
    console.log("Filtros:", filters);
    console.log("Colunas:", selectedColumns);

    alert("Relatório gerado! Agora você pode baixar o Excel.");
  };

  const baixarExcel = () => {
    alert("Baixando Excel...");
    // aqui você futuramente chamará: GET /api/relatorio?colunas=X&filtros=Y
  };

  return (
    <div className="relatorios-container">

      {/* sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header className="navbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={26} />
        </button>
        <h1>Relatórios</h1>
      </header>

      <main className="relatorios-content">

        <section className="relatorio-section">
          <h2>Selecionar Colunas</h2>

          <div className="checkbox-grid">

            {Object.keys(selectedColumns).map((col) => (
              <label key={col} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={selectedColumns[col]}
                  onChange={() => handleColumnToggle(col)}
                />
                {col.replace("_", " ").toUpperCase()}
              </label>
            ))}

          </div>
        </section>

        <section className="relatorio-section">
          <h2>Filtros</h2>

          <div className="form-grid">
            <label>
              Data Início:
              <input
                type="date"
                value={filters.data_inicio}
                onChange={(e) =>
                  setFilters({ ...filters, data_inicio: e.target.value })
                }
              />
            </label>

            <label>
              Data Fim:
              <input
                type="date"
                value={filters.data_fim}
                onChange={(e) =>
                  setFilters({ ...filters, data_fim: e.target.value })
                }
              />
            </label>

            <label>
              Status:
              <input
                type="text"
                placeholder="Ex: Aprovado"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              />
            </label>

            <label>
              Responsável:
              <input
                type="text"
                placeholder="Nome do responsável"
                value={filters.responsavel}
                onChange={(e) =>
                  setFilters({ ...filters, responsavel: e.target.value })
                }
              />
            </label>
          </div>
        </section>

        <div className="buttons-row">
          <button className="btn gerar" onClick={gerarRelatorio}>
            Gerar Relatório
          </button>

          <button className="btn baixar" onClick={baixarExcel}>
            Baixar Excel
          </button>
        </div>

      </main>

      <footer>
        &copy; 2025 Sistema Pulse - Todos os direitos reservados.
      </footer>

    </div>
  );
};

export default RelatoriosPage;
