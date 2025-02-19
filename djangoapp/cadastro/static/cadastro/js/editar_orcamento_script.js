


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("salvar-orcamento").addEventListener("click", function () {
      const orcamentoId = this.getAttribute("data-id");

      let procedimentosSelecionados = [];
      document.querySelectorAll(".procedimento-item").forEach(item => {
          procedimentosSelecionados.push({
              parceiro_id: item.getAttribute("data-parceiro-id"),
              procedimento_id: item.getAttribute("data-id"),
              valor_venda: parseFloat(item.querySelector("input").value || 0),
          });
      });

      const valorTotal = procedimentosSelecionados.reduce((total, proc) => total + proc.valor_venda, 0);

      const payload = {
          orcamento_id: orcamentoId,
          valor_total: valorTotal.toFixed(2),
          procedimentos: procedimentosSelecionados
      };

      fetch(`/atualizar_orcamento/${orcamentoId}/`, {
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
