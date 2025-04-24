// ------------------------------------ SALVAR MODIFICACOES DO ORCAMENTO ----------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("salvar-orcamento").addEventListener("click", function () {
      const orcamentoId = this.getAttribute("data-id");
      const statusSelecionado = document.getElementById("status").value;

      let produtosSelecionados = [];
      document.querySelectorAll(".produto-item").forEach(item => {
          produtosSelecionados.push({
              parceiro_id: item.getAttribute("data-parceiro-id"),
              produto_id: item.getAttribute("data-id"),
              valor_venda: parseFloat(item.querySelector("input").value || 0),
          });
      });

      const valorTotal = produtosSelecionados.reduce((total, proc) => total + proc.valor_venda, 0);

      const payload = {
          orcamento_id: orcamentoId,
          status: statusSelecionado,
          valor_total: valorTotal.toFixed(2),
          produtos: produtosSelecionados
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
    const selectParceiro = document.getElementById("parceiro");
    const subtipoSelect = document.getElementById("subtipo-select");
    const listaParceiros = document.getElementById("parceiro-list");

    function atualizarParceiros(subtipoId) {
        const options = selectParceiro.querySelectorAll('option');
        options.forEach(option => {
            if (option.value) {
                option.style.display = "none";
            }
        });

        if(subtipoId) {
            selectParceiro.value = "";

            const parceiroOptions = selectParceiro.querySelectorAll(`option[data-subtipo="${subtipoId}"]`);
            parceiroOptions.forEach(option => {
                option.style.display = "block";
            });
        } else {
            options.forEach(option => {
                if (option.value) {
                    option.style.display = "block";
                }
            });
        }
    }

    subtipoSelect.addEventListener("change", function () {
        atualizarParceiros(subtipoSelect.value);
    });

    window.adicionarParceiro = function () {
        const idParceiro = selectParceiro.value;

        if (!idParceiro) {
            alert("Selecione um parceiro válido.");
            return;
        } else {
            const parceiroNome = selectParceiro.options[selectParceiro.selectedIndex].text;

            let parceiroDiv = document.createElement("div");
            parceiroDiv.classList.add("parceiro-card");
            parceiroDiv.setAttribute("data-id", idParceiro);

            let titulo = document.createElement("h5");
            titulo.textContent = parceiroNome;

            let subtotal = document.createElement("p");
            subtotal.classList.add("subtotal");
            subtotal.textContent = "Subtotal: R$ 0.00";
            
            let produtosContainer = document.createElement("div");
            produtosContainer.classList.add("produtos-container");
    
            let adicionarProdutoBtn = document.createElement("button");
            adicionarProdutoBtn.textContent = "Adicionar Produto";
    
            adicionarProdutoBtn.onclick = function () {
                adicionarProdutoBy(produtosContainer, idParceiro, titulo.textContent.trim(), subtotal);
            };
    
            let buttonsDiv = document.createElement("div");
            buttonsDiv.classList.add("produtos-container-buttons");
            buttonsDiv.appendChild(adicionarProdutoBtn);
    
            let removerParceiroBtn = document.createElement("button");
            removerParceiroBtn.textContent = "❌";
            removerParceiroBtn.onclick = function () {
                parceiroDiv.remove();
            };
    
            let headerDiv = document.createElement("div");
            headerDiv.classList.add("produtos-container-header");
            headerDiv.appendChild(removerParceiroBtn);
            headerDiv.appendChild(titulo)
            
            parceiroDiv.appendChild(headerDiv);
            produtosContainer.appendChild(buttonsDiv);
            parceiroDiv.appendChild(produtosContainer);
            // parceiroDiv.appendChild(buttonsDiv);
            parceiroDiv.appendChild(subtotal);
    
            listaParceiros.appendChild(parceiroDiv);
        }
    };

    if (subtipoSelect.value) {
        atualizarParceiros(subtipoSelect.value);
    }
});

// -------------------------- REMOVER PARCEIROS QUE JA ESTAVAM NO ORCAMENTO -------------------------
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".remover-parceiro-btn").forEach(button => {
      button.addEventListener("click", function () {
          let parceiroCard = this.closest(".parceiro-card");
          if (parceiroCard) {
              parceiroCard.remove();
              atualizarTotalGeral();
          }
      });
  });
});

// -------------------------- ATUALIZAR SUBTOTAL DOS DADOS ANTIGOS -------------------------
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".parceiro-card").forEach(parceiroCard => {
      let subtotalElement = parceiroCard.querySelector(".subtotal");
      let produtosContainer = parceiroCard.querySelector(".produtos-container");

      atualizarSubtotal(produtosContainer, subtotalElement);

      produtosContainer.querySelectorAll("input[type='number']").forEach(input => {
          input.addEventListener("input", function () {
              atualizarSubtotal(produtosContainer, subtotalElement);
          });
      });
  });
});

// -------------------- ADICIONAR PRODUTOS AOS PARCEIROS QUE JA ESTAVAM NO ORCAMENTO ----------------------
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".adicionar-produto-btn").forEach(button => {
      button.addEventListener("click", function () {
        let parceiroCard = this.closest(".parceiro-card");
        let subtotalElement = parceiroCard.querySelector(".subtotal");
        let titulo = parceiroCard.querySelector(".parceiro-title");
        let produtosContainer = parceiroCard.querySelector(".produtos-container");
        let idParceiro = parceiroCard.getAttribute("data-parceiro-id");

        adicionarProdutoBy(produtosContainer, idParceiro, titulo.textContent.trim(), subtotalElement);
        atualizarSubtotal(produtosContainer, subtotalElement);
        console.log('ADICIONOU');
        atualizarParticular();
      });
  });
});

// -------------------- REMOVER PRODUTOS QUE JA ESTAVAM NO ORCAMENTO ----------------------
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".remover-produto-btn").forEach(button => {
      button.addEventListener("click", function () {
        let parceiroCard = this.closest(".parceiro-card");
        let subtotalElement = parceiroCard.querySelector(".subtotal");
        let produtosContainer = parceiroCard.querySelector(".produtos-container");
        let produtoItem = this.closest(".produto-item");

        if (produtoItem) {
          produtoItem.remove();
          atualizarSubtotal(produtosContainer, subtotalElement);
          console.log('REMOVEU');
          atualizarParticular();
        }
      });
  });
});

// --------------------------------------------- PROCEDIMENTOS -------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const specialtySelect = document.getElementById("specialty-select");
    const selectProcedimento = document.getElementById("procedimentos-select");

    function atualizarProcedimentos(specialtyId) {
        const options = selectProcedimento.querySelectorAll('option');
        options.forEach(option => {
            if (option.value) {
                option.style.display = "none";
            }
        });

        if(specialtyId) {
            selectProcedimento.value = "";

            const procedimentoOptions = selectProcedimento.querySelectorAll(`option[data-specialty="${specialtyId}"]`);
            procedimentoOptions.forEach(option => {
                option.style.display = "block";
            });
        } else {
            options.forEach(option => {
                if (option.value) {
                    option.style.display = "block";
                }
            });
        }
    }

    specialtySelect.addEventListener("change", function () {
        atualizarProcedimentos(specialtySelect.value);
    });

    window.adicionarProcedimentos = function () {
        const idProcedimento = selectProcedimento.value;
        const nome = selectProcedimento.options[selectProcedimento.selectedIndex].text;

        if (!nome || !idProcedimento) {
            alert("Selecione um procedimento válido.");
            return;
        }

        let listaProcedimentos = document.getElementById("procedimentos-list");

        let procedimentoItem = document.createElement("li");
        procedimentoItem.classList.add("procedimento-item");

        let titulo = document.createElement("span");
        titulo.textContent = nome;
        procedimentoItem.setAttribute('data-id', idProcedimento);

        let removerBtn = document.createElement("button");
        removerBtn.textContent = "❌";
        removerBtn.onclick = function () {
            procedimentoItem.remove();
        };

        procedimentoItem.appendChild(titulo);
        procedimentoItem.appendChild(removerBtn);

        listaProcedimentos.appendChild(procedimentoItem);
    };
});

// ------------------------REMOVER PROCEDIMENTOS QUE JÁ ESTAVAM ADICIONADOS----------------------------------
document.getElementById("procedimentos-list").addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
        const li = event.target.closest(".procedimento-item");
        if (li) {
            li.remove();
        }
    }
});
// ----------------------------------------------------------------------------------------------------------