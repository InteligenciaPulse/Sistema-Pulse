import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/RelatoriosPage.css";
import { API_BASE } from '../services/api';

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

  const [loadingDownload, setLoadingDownload] = useState(false);

  const handleColumnToggle = (column) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // const gerarRelatorio = () => {
  //   console.log("Filtros:", filters);
  //   console.log("Colunas:", selectedColumns);

  //   alert("Relatório gerado! Agora você pode baixar o Excel.");
  // };

  const handleDownload = async () => {
    setLoadingDownload(true);

    try {
      const params = new URLSearchParams();
      Object.entries(selectedColumns).forEach(([key, value]) => {
        if (value === true) params.append("columns", key);
      });

      const response = await fetch(
        `${API_BASE}/relatorios/orcamentos/excel/?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Erro do backend:", text);
        alert("Erro ao gerar relatório.");
        setLoadingDownload(false);
        return;
      }

      const contentType = response.headers.get("Content-Type");
      if (!contentType.includes("application/vnd.openxmlformats-officedocument")) {
        const text = await response.text();
        console.error("O backend não retornou Excel. Recebido:", text);
        alert("Erro ao gerar Excel.");
        setLoadingDownload(false);
        return;
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "relatorio_orcamentos.xlsx";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Erro inesperado:", err);
      alert("Erro ao gerar relatório.");
    }

    setLoadingDownload(false);
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
          {/* <button className="btn gerar" onClick={gerarRelatorio}>
            Gerar Relatório
          </button> */}

          <button
            className="btn baixar"
            onClick={handleDownload}
            disabled={loadingDownload}
          >
            {loadingDownload ? "Gerando..." : "Baixar Excel"}
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
