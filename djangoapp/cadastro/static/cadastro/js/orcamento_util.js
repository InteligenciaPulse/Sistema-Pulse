function getCSRFToken() {
  let csrfTokenInput = document.querySelector('[name=csrfmiddlewaretoken]');
  return csrfTokenInput ? csrfTokenInput.value : '';
}

function atualizarSubtotal(procedimentosContainer, subtotalElement) {
  let total = 0;

  procedimentosContainer.querySelectorAll("input[type='number']").forEach(input => {
      total += parseFloat(input.value) || 0;
  });

  subtotalElement.textContent = `Subtotal: ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
  atualizarTotalGeral();
}

function atualizarTotalGeral() {
  let totalGeral = 0;
  let subtotais = document.querySelectorAll(".subtotal");

  subtotais.forEach(subtotal => {
      let valorTexto = subtotal.textContent.replace("Subtotal: R$", "").trim().replace(".", "").replace(",", ".");
      let valor = parseFloat(valorTexto);
      if (!isNaN(valor)) {
          totalGeral += valor;
      }
  });

  document.getElementById("total-geral").textContent = `Total: R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// -------------------------------------- BUSCAR SUBTIPOS ---------------------------------------------
function buscarSubTipos(subtipoSelect){
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
}

// -------------------------------------- BUSCAR PARCEIRO ---------------------------------------------
function buscarParceiros(dropdown, inputParceiro, subtipoSelecionado){
  const query = inputParceiro.value.trim();
  if (query.length < 1) {
      dropdown.innerHTML = "";
      dropdown.style.display = "none";
      return;
  }

  fetch(`/buscar_parceiros_by/?q=${encodeURIComponent(query)}&subtipo=${subtipoSelecionado}`)
      .then(response => response.json())
      .then(data => {
          dropdown.innerHTML = "";
          if (data.length === 0) {
              dropdown.style.display = "none";
              return;
          }

          data.forEach(parceiro => {
              let option = document.createElement("div");
              option.textContent = parceiro.nome;
              option.classList.add("dropdown-item");
              option.setAttribute("data-id", parceiro.id);

              option.addEventListener("click", function () {
                  inputParceiro.value = parceiro.nome;
                  inputParceiro.setAttribute("data-id", parceiro.id);
                  dropdown.style.display = "none";
              });

              dropdown.appendChild(option);
          });

          dropdown.style.display = "block";
      })
      .catch(error => console.error("Erro ao buscar parceiros:", error));
}

// --------------------------------------- ADICIONAR PROCEDIMENTOS ------------------------------------
function adicionarProcedimentoBy(procedimentosContainer, parceiroId, nomeParceiro, subtotalElement) {
  fetch(`/buscar_procedimentos_por_parceiro/?parceiro_nome=${encodeURIComponent(nomeParceiro)}`)
      .then(response => response.json())
      .then(data => {
          let dropdownProcedimentos = document.createElement("div");
          dropdownProcedimentos.classList.add("dropdown-procedimentos");

          if (data.length === 0) {
              alert("Nenhum procedimento disponível para este parceiro.");
              return;
          }

          data.forEach(procedimento => {
              let option = document.createElement("div");
              option.textContent = procedimento.nome;
              option.classList.add("dropdown-item");
              option.setAttribute("data-id", procedimento.id);
              option.setAttribute("data-parceiro-id", parceiroId);

              option.addEventListener("click", function () {
                  let procedimentoItem = document.createElement("div");
                  procedimentoItem.classList.add("procedimento-item");

                  let procedimentoNome = document.createElement("span");
                  procedimentoNome.textContent = procedimento.nome;

                  let valorInput = document.createElement("input");
                  valorInput.type = "number";
                  valorInput.placeholder = "Valor R$";
                  valorInput.step = 0.01;
                  valorInput.min = 0;
                  valorInput.value = procedimento.valor_venda;

                  valorInput.addEventListener("input", function () {
                      atualizarSubtotal(procedimentosContainer, subtotalElement);
                  });

                  let removerProcedimentoBtn = document.createElement("button");
                  removerProcedimentoBtn.textContent = "❌";
                  removerProcedimentoBtn.onclick = function () {
                      procedimentoItem.remove();
                      atualizarSubtotal(procedimentosContainer, subtotalElement);
                  };
                  
                  procedimentoItem.appendChild(procedimentoNome);
                  procedimentoItem.appendChild(valorInput);
                  procedimentoItem.appendChild(removerProcedimentoBtn);
                  procedimentoItem.setAttribute("data-id", procedimento.id);
                  procedimentoItem.setAttribute("data-parceiro-id", parceiroId);

                  procedimentosContainer.appendChild(procedimentoItem);
                  dropdownProcedimentos.remove();
                  atualizarSubtotal(procedimentosContainer, subtotalElement);
              });

              dropdownProcedimentos.appendChild(option);
          });

          procedimentosContainer.appendChild(dropdownProcedimentos);
      })
      .catch(error => console.error("Erro ao buscar parceiros:", error));
}