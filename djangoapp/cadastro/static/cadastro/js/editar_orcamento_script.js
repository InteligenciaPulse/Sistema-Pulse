// ------------------------------------ SALVAR MODIFICACOES DO ORCAMENTO ----------------------------------------
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

// -------------------------------------PARCEIROS-------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const inputParceiro = document.getElementById("parceiro");
  const parceiroSubtypeDiv = document.getElementById("parceiro-subtype");
  const dropdown = document.getElementById("sugestoes-parceiros");
  const listaParceiros = document.getElementById("parceiro-list");

  const subtipoSelect = document.createElement("select");
  subtipoSelect.id = "subtipo-select";
  subtipoSelect.innerHTML = `<option value="">Selecione um Subtipo</option>`;
  parceiroSubtypeDiv.appendChild(subtipoSelect);

  fetch("/buscar_subtipos/")
      .then(response => response.json())
      .then(subtipos => {
          subtipos.forEach(subtipo => {
              let option = document.createElement("option");
              option.value = subtipo.id;
              option.textContent = subtipo.nome;
              subtipoSelect.appendChild(option);
          });
      })
      .catch(error => console.error("Erro ao buscar subtipos:", error));

  inputParceiro.addEventListener("input", function () {
      buscarParceiros(dropdown, inputParceiro, subtipoSelect.value);
  });

  inputParceiro.addEventListener("focus", function () {
      buscarParceiros(dropdown, inputParceiro, subtipoSelect.value);
  });

  subtipoSelect.addEventListener("change", function () {
      buscarParceiros(dropdown, inputParceiro, subtipoSelect.value);
  });

  document.addEventListener("click", function (event) {
      if (!inputParceiro.contains(event.target) && !dropdown.contains(event.target)) {
          dropdown.style.display = "none";
      }
  });

  window.adicionarParceiro = function () {
      const nome = inputParceiro.value.trim();
      const idParceiro = inputParceiro.getAttribute("data-id");

      if (!nome || !idParceiro) {
          alert("Selecione um parceiro válido.");
          return;
      }

      let parceiroDiv = document.createElement("div");
      parceiroDiv.classList.add("parceiro-card");
      parceiroDiv.setAttribute("data-id", idParceiro);

      let titulo = document.createElement("h5");
      titulo.textContent = nome;

      let subtotal = document.createElement("p");
      subtotal.classList.add("subtotal");
      subtotal.textContent = "Subtotal: R$ 0.00";
      
      let procedimentosContainer = document.createElement("div");
      procedimentosContainer.classList.add("procedimentos-container");

      let adicionarProcedimentoBtn = document.createElement("button");
      adicionarProcedimentoBtn.textContent = "Adicionar Procedimento";

      adicionarProcedimentoBtn.onclick = function () {
          adicionarProcedimentoBy(procedimentosContainer, idParceiro, titulo.textContent.trim(), subtotal);
      };

      let adicionarPacoteBtn = document.createElement("button");
      adicionarPacoteBtn.textContent = "Adicionar Pacote";

      adicionarPacoteBtn.onclick = function () {
          adicionarPacote(pacoteDropdownDiv, procedimentosContainer, subtotal);
      };

      let pacoteDropdownDiv = document.createElement("div");

      let buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("procedimentos-container-buttons");
      buttonsDiv.appendChild(adicionarProcedimentoBtn);
      buttonsDiv.appendChild(adicionarPacoteBtn);

      let removerParceiroBtn = document.createElement("button");
      removerParceiroBtn.textContent = "❌ Remover Parceiro";
      removerParceiroBtn.onclick = function () {
          parceiroDiv.remove();
      };

      let headerDiv = document.createElement("div");
      headerDiv.classList.add("procedimentos-container-header");
      headerDiv.appendChild(titulo)
      headerDiv.appendChild(removerParceiroBtn);
      
      parceiroDiv.appendChild(headerDiv);
      parceiroDiv.appendChild(procedimentosContainer);
      parceiroDiv.appendChild(buttonsDiv);
      parceiroDiv.appendChild(pacoteDropdownDiv);
      parceiroDiv.appendChild(subtotal);

      listaParceiros.appendChild(parceiroDiv);

      inputParceiro.value = "";
      inputParceiro.removeAttribute("data-id");
  };
});

document.addEventListener("click", function(event) {
  if (!event.target.closest(".filter-parceiro")) {
      document.getElementById("sugestoes-parceiros").style.display = "none";
  }
});
