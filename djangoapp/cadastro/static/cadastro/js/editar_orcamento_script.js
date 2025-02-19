document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("salvar-edicao").addEventListener("click", function () {
      const orcamentoId = window.location.pathname.split("/").pop();
      const parceiros = [];

      document.querySelectorAll(".parceiro-card").forEach(parceiroDiv => {
          const parceiroId = parceiroDiv.getAttribute("data-parceiro-id");
          const procedimentos = [];

          parceiroDiv.querySelectorAll(".procedimento-item").forEach(proc => {
              procedimentos.push({
                  procedimento_id: proc.getAttribute("data-id"),
                  valor_venda: parseFloat(proc.querySelector(".valor-venda").value)
              });
          });

          parceiros.push({
              parceiro_id: parceiroId,
              procedimentos: procedimentos
          });
      });

      const valorTotal = parceiros.reduce((total, p) => total + p.procedimentos.reduce((sum, proc) => sum + proc.valor_venda, 0), 0);

      const payload = {
          orcamento_id: orcamentoId,
          valor_total: valorTotal.toFixed(2),
          parceiros: parceiros
      };

      fetch(`/atualizar_orcamento/`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCSRFToken()
          },
          body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
          if (data.message) {
              alert("Orçamento atualizado com sucesso!");
              window.location.href = "/historico/";
          } else {
              alert("Erro ao atualizar orçamento: " + data.error);
          }
      })
      .catch(error => console.error("Erro ao atualizar orçamento:", error));
  });
});