// ------------------------------------ SALVAR MODIFICACOES DO ORCAMENTO ----------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("salvar-orcamento").addEventListener("click", function () {
    const urlPath = window.location.pathname;
    const orcamentoId = urlPath.split('/').filter(Boolean).pop();
    const statusSelecionado = document.getElementById("status").value;

    let produtosSelecionados = [];
    document.querySelectorAll(".produto-item").forEach(item => {
        produtosSelecionados.push({
            parceiro_id: item.getAttribute("data-parceiro-id"),
            produto_id: item.getAttribute("data-id"),
            valor_venda: parseFloat(item.querySelector("input").value || 0),
            comissao_indicacao: parseFloat(item.getAttribute("comissao_indicacao") || 0),
            comissao_venda: parseFloat(item.getAttribute("comissao-venda") || 0),
            brindes: parseFloat(item.getAttribute("brindes") || 0),
            impostos: parseFloat(item.getAttribute("impostos") || 0),
            cartoes: parseFloat(item.getAttribute("cartoes") || 0),
            margem_lucro: parseFloat(item.getAttribute("margem_lucro") || 0),
        });
    });

    let procedimentosSelecionados = [];
    document.querySelectorAll(".procedimento-item").forEach(item => {
        procedimentosSelecionados.push({
            procedimento_id: item.getAttribute("data-id")
        });
    });

    //   const valorTotal = produtosSelecionados.reduce((total, proc) => total + proc.valor_venda, 0);
    const valorElemento = document.getElementById("total-geral").textContent;
    let valorStr = valorElemento.replace("Total:", "").replace("R$", "").trim();
    valorStr = valorStr.replace(/\./g, "").replace(",", ".");
    const valorTotal = parseFloat(valorStr);

    const payload = {
        orcamento_id: orcamentoId,
        status: statusSelecionado,
        valor_total: valorTotal.toFixed(2),
        produtos: produtosSelecionados,
        procedimentos: procedimentosSelecionados
    };

    fetch(`/api/atualizar_orcamento/${orcamentoId}/`, {
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
            window.location.href = "https://sistema-pulse-production.up.railway.app/";
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
            //   atualizarTotalGeral();
              aplicarValores();
          }
      });
  });
});

// =========================================== MODAIS ==========================================================
function abrirModal() {
    document.getElementById("modal-configuracao").style.display = "block";
}

function fecharModal() {
    document.getElementById("modal-configuracao").style.display = "none";
}

function abrirModalTabela() {
    document.getElementById("modal-tabela").style.display = "flex";
    // preencherTabela();
}

function fecharModalTabela() {
    document.getElementById("modal-tabela").style.display = "none";
}
// ================================= ATUALIZAR VALOR GERAL DE FORMA DIFERENTE ==================================
function aplicarValores() {
    const parceiroCards = document.querySelectorAll(".parceiro-card");

    const comissao_venda = document.getElementById("comissao-venda").value;
    const comissao_indicacao = document.getElementById("comissao-indicacao").value;
    const brindes = document.getElementById("brindes").value;
    const impostos = document.getElementById("impostos").value;
    const cartoes = document.getElementById("cartoes").value;
    const margem = document.getElementById("margem_lucro").value;

    var total_repasse = 0;
    var total_particular = 0;

    parceiroCards.forEach(function(parceiroCard) {
        const produtoItems = parceiroCard.querySelectorAll(".produto-item");

        produtoItems.forEach(function(produto) {
            total_repasse = total_repasse + parseFloat(produto.getAttribute('data-valor-repasse'));
            total_particular = total_particular + parseFloat(produto.getAttribute('data-valor-particular'));

            produto.setAttribute("comissao-venda", comissao_venda);
            produto.setAttribute("comissao_indicacao", comissao_indicacao);
            produto.setAttribute("brindes", brindes);
            produto.setAttribute("impostos", impostos);
            produto.setAttribute("cartoes", cartoes);
            produto.setAttribute("margem_lucro", margem);
        });
    });

    let fixos = total_repasse + parseFloat(comissao_indicacao) + parseFloat(brindes);
    let variaveis = parseFloat(impostos) / 100 + parseFloat(cartoes) / 100 + parseFloat(margem) / 100 + parseFloat(comissao_venda) / 100;
    
    let valor_venda_total = (fixos * (1 - (parseFloat(impostos) / 100))) / (1 - variaveis)
    
    document.getElementById("total-geral").textContent = `Total: R$ ${valor_venda_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById("total-particular").textContent = `Total particular: R$ ${total_particular.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // verificarValores();

    fecharModal();
}

function recalcularMargem(novoValorVenda) {
    const parceiroCards = document.querySelectorAll(".parceiro-card");

    const comissao_venda = document.getElementById("comissao-venda").value;
    const comissao_indicacao = document.getElementById("comissao-indicacao").value;
    const brindes = document.getElementById("brindes").value;
    const impostos = document.getElementById("impostos").value;
    const cartoes = document.getElementById("cartoes").value;
    let margem = document.getElementById("margem_lucro").value;

    var total_repasse = 0;
    var total_particular = 0;

    parceiroCards.forEach(function(parceiroCard) {
        const produtoItems = parceiroCard.querySelectorAll(".produto-item");

        produtoItems.forEach(function(produto) {
            total_repasse = total_repasse + parseFloat(produto.getAttribute('data-valor-repasse'));
            total_particular = total_particular + parseFloat(produto.getAttribute('data-valor-particular'));

            produto.setAttribute("comissao-venda", comissao_venda);
            produto.setAttribute("comissao_indicacao", comissao_indicacao);
            produto.setAttribute("brindes", brindes);
            produto.setAttribute("impostos", impostos);
            produto.setAttribute("cartoes", cartoes);
            produto.setAttribute("margem_lucro", margem);
        });
    });

    let fixos = total_repasse + parseFloat(comissao_indicacao) + parseFloat(brindes);
    let impostosPerc = parseFloat(impostos) / 100;
    let cartoesPerc = parseFloat(cartoes) / 100;
    let comissaoPerc = parseFloat(comissao_venda) / 100;

    let novaMargem = (1 - (fixos * (1 - impostosPerc)) / novoValorVenda) - (impostosPerc + cartoesPerc + comissaoPerc);
    margem = (novaMargem * 100).toFixed(2);

    parceiroCards.forEach(function(parceiroCard) {
        const produtoItems = parceiroCard.querySelectorAll(".produto-item");

        produtoItems.forEach(function(produto) {
            produto.setAttribute("margem_lucro", margem);
        });
    });

    // aplicarValores();
    
    document.getElementById("margem_lucro").value = margem;
}

const editarTotalBtn = document.getElementById("editar-total");

editarTotalBtn.addEventListener("click", () => {
    const valorVendaElement = document.getElementById("total-geral");

    let valorVenda = verificarValores();

    const input = document.createElement("input");
    input.type = "number";
    input.value = valorVenda.toFixed(2);
    input.style.width = "80px";

    valorVendaElement.replaceWith(input);
    input.focus();

    let editando = false;

    function confirmarEdicao() {
        if (editando) return;
        editando = true;

        const novoValor = parseFloat(input.value);
        if (!isNaN(novoValor) && novoValor > 0) {
            valorVenda = novoValor;
            const novoH3 = document.createElement("h3");
            novoH3.id = "total-geral";
            
            novoH3.textContent = `Total: R$ ${valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            input.replaceWith(novoH3);
            recalcularMargem(novoValor);
        } else {
            alert("Valor inválido!");
            input.focus();
        }
    }

    input.addEventListener("blur", confirmarEdicao);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") confirmarEdicao();
    });
});

function verificarValores(){
    let total_geral = document.getElementById("total-geral").textContent;
    let total_particular = document.getElementById("total-particular").textContent;

    const extrairValor = (texto) => {
        const valorMatch = texto.match(/[\d.,]+/);
        if (!valorMatch) return 0;
        return parseFloat(valorMatch[0].replace(/\./g, '').replace(',', '.'));
    };

    total_geral = extrairValor(total_geral);
    total_particular = extrairValor(total_particular);

    return total_geral;
}

// -------------------------- ATUALIZAR SUBTOTAL DOS DADOS ANTIGOS -------------------------
// document.addEventListener("DOMContentLoaded", function () {
//   document.querySelectorAll(".parceiro-card").forEach(parceiroCard => {
//       let subtotalElement = parceiroCard.querySelector(".subtotal");
//       let produtosContainer = parceiroCard.querySelector(".produtos-container");

//       atualizarSubtotal(produtosContainer, subtotalElement);

//       produtosContainer.querySelectorAll("input[type='number']").forEach(input => {
//           input.addEventListener("input", function () {
//               atualizarSubtotal(produtosContainer, subtotalElement);
//           });
//       });
//   });
// });

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
        // atualizarSubtotal(produtosContainer, subtotalElement);
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
        //   atualizarSubtotal(produtosContainer, subtotalElement);
          atualizarParticular();
          aplicarValores();
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