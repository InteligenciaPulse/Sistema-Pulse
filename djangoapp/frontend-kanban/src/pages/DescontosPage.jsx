import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/DescontosPage.css";
import { API_BASE } from '../services/api';

function DescontosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [parceiros, setParceiros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/parceiros/`)
      .then((r) => r.json())
      .then((data) => {
        setParceiros(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Salvar desconto individual
  function salvarDesconto(id, novoDesconto) {
    fetch(`${API_BASE}/parceiro/${id}/atualizar_desconto/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ desconto: novoDesconto }),
    })
      .then((r) => r.json())
      .then((resp) => {
        if (resp.status === "ok") {
          alert("Desconto atualizado!");
        } else {
          alert("Erro ao salvar desconto.");
        }
      });
  }

  return (
    <div className="descontos-container">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <header className="navbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
        <h1>Ajuste de Descontos</h1>
      </header>

      <main className="descontos-content">

        {loading ? (
          <p>Carregando parceiros...</p>
        ) : (
          parceiros.map((p) => (
            <div key={p.id} className="desconto-row">
              <span className="desconto-nome">{p.nome}</span>

              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                defaultValue={p.desconto}
                onChange={(e) => {
                  const updated = [...parceiros];
                  const index = updated.findIndex((x) => x.id === p.id);
                  updated[index].desconto = e.target.value;
                  setParceiros(updated);
                }}
              />

              <button
                className="btn-salvar"
                onClick={() => salvarDesconto(p.id, p.desconto)}
              >
                Salvar
              </button>
            </div>
          ))
        )}

      </main>

      <footer>
        &copy; 2025 Sistema Pulse - Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default DescontosPage;
