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