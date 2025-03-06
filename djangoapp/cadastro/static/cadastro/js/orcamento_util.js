function getCSRFToken() {
  let csrfTokenInput = document.querySelector('[name=csrfmiddlewaretoken]');
  return csrfTokenInput ? csrfTokenInput.value : '';
}

function atualizarSubtotal(produtosContainer, subtotalElement) {
  let total = 0;

  produtosContainer.querySelectorAll("input[type='number']").forEach(input => {
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
function adicionarProdutoBy(produtosContainer, parceiroId, nomeParceiro, subtotalElement) {
  fetch(`/buscar_produtos_por_parceiro/?parceiro_nome=${encodeURIComponent(nomeParceiro)}`)
      .then(response => response.json())
      .then(data => {
          let dropdownProdutos = document.createElement("div");
          dropdownProdutos.classList.add("dropdown-produtos");

          if (data.length === 0) {
              alert("Nenhum produto disponível para este parceiro.");
              return;
          }

          data.forEach(produto => {
              let option = document.createElement("div");
              option.textContent = produto.nome;
              option.classList.add("dropdown-item");
              option.setAttribute("data-id", produto.id);
              option.setAttribute("data-parceiro-id", parceiroId);

              option.addEventListener("click", function () {
                  let produtoItem = document.createElement("div");
                  produtoItem.classList.add("produto-item");

                  let produtoNome = document.createElement("span");
                  produtoNome.textContent = produto.nome;

                  let valorInput = document.createElement("input");
                  valorInput.type = "number";
                  valorInput.placeholder = "Valor R$";
                  valorInput.step = 0.01;
                  valorInput.min = 0;
                  valorInput.value = produto.valor_venda;

                  valorInput.addEventListener("input", function () {
                      atualizarSubtotal(produtosContainer, subtotalElement);
                  });

                  let removerProdutoBtn = document.createElement("button");
                  removerProdutoBtn.textContent = "❌";
                  removerProdutoBtn.onclick = function () {
                      produtoItem.remove();
                      atualizarSubtotal(produtosContainer, subtotalElement);
                  };
                  
                  produtoItem.appendChild(produtoNome);
                  produtoItem.appendChild(valorInput);
                  produtoItem.appendChild(removerProdutoBtn);
                  produtoItem.setAttribute("data-id", produto.id);
                  produtoItem.setAttribute("data-parceiro-id", parceiroId);

                  produtosContainer.appendChild(produtoItem);
                  dropdownProdutos.remove();
                  atualizarSubtotal(produtosContainer, subtotalElement);
              });

              dropdownProdutos.appendChild(option);
          });

          produtosContainer.appendChild(dropdownProdutos);
      })
      .catch(error => console.error("Erro ao buscar parceiros:", error));
}

// ---------------------------------------- BUSCAR STATUS --------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    fetch("/buscar_status/")
        .then(response => response.json())
        .then(data => {
            const statusSelect = document.getElementById("status");
            statusSelect.innerHTML = "";
            
            data.status.forEach(status => {
                let option = document.createElement("option");
                option.value = status.id;
                option.textContent = status.nome;
                statusSelect.appendChild(option);
            });

            if (statusSelect.hasAttribute("data-status-atual")) {
                selecionarStatusAtual();
            }
        })
        .catch(error => console.error("Erro ao carregar status:", error));
});