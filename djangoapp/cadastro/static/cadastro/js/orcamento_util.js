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
//   document.getElementById("total-particular").textContent = `Total particular: R$ ${valor_venda_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; 
}

function atualizarParticular() {
    let total = 0;

    const parceirosList = document.getElementById('parceiro-list');
    const produtoItems = parceirosList.querySelectorAll(".produto-item");
    
    produtoItems.forEach(function(produto) {
        total += parseFloat(produto.getAttribute('data-valor-particular')) || 0;
    });

    document.getElementById("total-particular").textContent = `Total particular: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; 
}

function toNumber(value) {
    if (!value || value === "None" || value === "null" || value === "NaN") {
        return 0;
    }
    value = value.replace(",", ".");
    return Number(value) || 0;
}

// -------------------------------------- BUSCAR SUBTIPOS ---------------------------------------------
function buscarSubTipos(subtipoSelect){
  fetch("/api/buscar_subtipos/")
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
// function buscarParceiros(dropdown, inputParceiro, subtipoSelecionado){
//   const query = inputParceiro.value.trim();
//   if (query.length < 1) {
//       dropdown.innerHTML = "";
//       dropdown.style.display = "none";
//       return;
//   }

//   fetch(`/api/buscar_parceiros_by/?q=${encodeURIComponent(query)}&subtipo=${subtipoSelecionado}`)
//       .then(response => response.json())
//       .then(data => {
//           dropdown.innerHTML = "";
//           if (data.length === 0) {
//               dropdown.style.display = "none";
//               return;
//           }

//           data.forEach(parceiro => {
//               let option = document.createElement("div");
//               option.textContent = parceiro.nome;
//               option.classList.add("dropdown-item");
//               option.setAttribute("data-id", parceiro.id);

//               option.addEventListener("click", function () {
//                   inputParceiro.value = parceiro.nome;
//                   inputParceiro.setAttribute("data-id", parceiro.id);
//                   dropdown.style.display = "none";
//               });

//               dropdown.appendChild(option);
//           });

//           dropdown.style.display = "block";
//       })
//       .catch(error => console.error("Erro ao buscar parceiros:", error));
// }
function filtrarParceiros() {
    const input = document.getElementById("input-parceiro");
    const dropdown = document.getElementById("dropdown-parceiro");
    const select = document.getElementById("parceiro");
    const subtipoSelecionado = document.getElementById("subtipo-select").value;

    const termo = input.value.toLowerCase();
    dropdown.innerHTML = "";

    const options = Array.from(select.options).filter(opt => opt.value);

    const filtrados = options.filter(opt => {
        const nome = opt.text.toLowerCase();
        const subtipo = opt.dataset.subtipo;

        const matchNome = nome.includes(termo);
        const matchSubtipo = !subtipoSelecionado || subtipo === subtipoSelecionado;

        return matchNome && matchSubtipo;
    });

    if (!filtrados.length) {
        dropdown.style.display = "none";
        return;
    }

    filtrados.forEach(opt => {
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.textContent = opt.text;
        item.dataset.id = opt.value;

        item.addEventListener("click", () => {
            selecionarParceiro(opt);
        });

        dropdown.appendChild(item);
    });

    dropdown.style.display = "block";
}

function selecionarParceiro(option) {
    const input = document.getElementById("input-parceiro");
    const select = document.getElementById("parceiro");
    const dropdown = document.getElementById("dropdown-parceiro");

    input.value = option.text;
    select.value = option.value;

    dropdown.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    const inputParceiro = document.getElementById("input-parceiro");

    if (!inputParceiro) return; // proteção

    inputParceiro.addEventListener("input", filtrarParceiros);
    inputParceiro.addEventListener("focus", filtrarParceiros);

    const subtipoSelect = document.getElementById("subtipo-select");
    if (subtipoSelect) {
        subtipoSelect.addEventListener("change", filtrarParceiros);
    }
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".combo-box")) {
        document.getElementById("dropdown-parceiro").style.display = "none";
    }
});


// --------------------------------------- ADICIONAR PRODUTOS ------------------------------------
function adicionarProdutoBy(produtosContainer, parceiroId, nomeParceiro, subtotalElement) {
    const comboBox = produtosContainer.querySelector(".combo-box-produto");
    const inputProduto = comboBox ? comboBox.querySelector(".input-produto") : null;
    
    const dropdownProdutos = comboBox
        ? comboBox.querySelector(".dropdown-produtos")
        : document.createElement("div");

    if (!comboBox) {
        dropdownProdutos.classList.add("dropdown-produtos");
        produtosContainer.appendChild(dropdownProdutos);
    }

    dropdownProdutos.innerHTML = "";

    const loadingMsg = document.createElement("div");
    loadingMsg.textContent = "Carregando produtos...";
    loadingMsg.classList.add("loading-indicator");
    produtosContainer.appendChild(loadingMsg);

    fetch(`/api/buscar_produtos_por_parceiro/?parceiro_nome=${encodeURIComponent(nomeParceiro)}`)
        .then(response => response.json())
        .then(data => {
            loadingMsg.remove();
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

                    valorInput.disabled = true;

                    valorInput.addEventListener("input", function () {
                        // atualizarSubtotal(produtosContainer, subtotalElement);
                        aplicarValores()
                    });

                    let descontoIcon = document.createElement("span");
                    descontoIcon.innerHTML = "💲";
                    descontoIcon.title = "Aplicar/Remover desconto";
                    descontoIcon.classList.add("desconto-icon");

                    descontoIcon.addEventListener("click", function () {
                        const jaAtivo = descontoIcon.classList.contains("ativo");

                        if (jaAtivo) {
                            descontoIcon.classList.remove("ativo");
                            produtoItem.classList.remove("desconto-ativo");
                        } else {
                            descontoIcon.classList.add("ativo");
                            produtoItem.classList.add("desconto-ativo");
                        }
                        
                        aplicarDescontoSegundoProduto(
                            produtoItem,
                            parceiroId,
                            produtosContainer,
                            descontoIcon
                        );
                    });

                    let removerProdutoBtn = document.createElement("button");
                    removerProdutoBtn.textContent = "❌";
                    removerProdutoBtn.onclick = function () {
                        produtoItem.remove();
                        // atualizarSubtotal(produtosContainer, subtotalElement);
                        aplicarValores()
                        atualizarParticular();
                    };
                    
                    produtoItem.appendChild(produtoNome);
                    //   produtoItem.appendChild(produtoConfig);
                    produtoItem.appendChild(valorInput);

                    produtoItem.appendChild(descontoIcon);

                    produtoItem.appendChild(removerProdutoBtn);
                    produtoItem.setAttribute("data-id", produto.id);
                    produtoItem.setAttribute("data-parceiro-id", parceiroId);
                    produtoItem.setAttribute("data-valor-particular", produto.valor_particular);
                    produtoItem.setAttribute("data-valor-repasse", produto.valor_repasse);
                    produtoItem.setAttribute("data-valor-repasse-original", produto.valor_repasse);
                    produtoItem.setAttribute("margem_lucro", 15.00);

                    produtosContainer.appendChild(produtoItem);
                    dropdownProdutos.remove();
                    // atualizarSubtotal(produtosContainer, subtotalElement);
                    aplicarValores();
                    atualizarParticular();
                });

                dropdownProdutos.appendChild(option);
            });

            produtosContainer.appendChild(dropdownProdutos);

            function handleClickOutside(event) {
                if (!dropdownProdutos.contains(event.target)) {
                    dropdownProdutos.remove();
                    document.removeEventListener("click", handleClickOutside);
                }
            }
                
            setTimeout(() => {
                document.addEventListener("click", handleClickOutside);
            }, 0);
        })
        .catch(error => console.error("Erro ao buscar parceiros:", error));
}

function atualizarMargem() {
    const inputMargem = document.getElementById("margem_lucro");
    const margemExibida = document.getElementById("margem-exibida");
    const valor = parseFloat(inputMargem.value);

    margemExibida.textContent = isNaN(valor)
        ? "(Margem: 0%)"
        : `(Margem: ${valor.toFixed(2)}%)`;
}

function aplicarDescontoSegundoProduto(
    produtoItem,
    parceiroId,
    produtosContainer,
    descontoIcon
) {

    const produtos = produtosContainer.querySelectorAll(".produto-item");

    // Regra: mínimo 2 produtos
    if (produtos.length < 2) {
        alert("O desconto só pode ser aplicado se houver dois ou mais produtos deste parceiro.");

        descontoIcon.classList.remove("ativo");
        produtoItem.classList.remove("desconto-ativo");
        return;
    }

    const descontoAtivo = descontoIcon.classList.contains("ativo");

    // Se o usuário está desativando → só remover
    if (!descontoAtivo) {
        removerDesconto(produtoItem, descontoIcon);
        // aplicarValores();
        // atualizarParticular();
        return;
    }

    // REMOVER O DESCONTO DOS OUTROS ITENS IMEDIATAMENTE
    produtos.forEach(item => {
        if (item !== produtoItem) {
            const icon = item.querySelector(".desconto-icon");
            if (icon && icon.classList.contains("ativo")) {
                removerDesconto(item, icon);
            }
        }
    });

    aplicarDesconto(produtoItem, parceiroId, descontoIcon);
}


function aplicarDesconto(produtoItem, parceiroId, descontoIcon) {
    let repasseOriginal = parseFloat(produtoItem.getAttribute("data-valor-repasse-original"));

    fetch(`/api/parceiro/${parceiroId}/desconto/`)
        .then(r => r.json())
        .then(data => {
            const desconto = parseFloat(data.desconto || 0);

            const novoValor = repasseOriginal * (1 - desconto / 100);
            produtoItem.setAttribute("data-valor-repasse", novoValor.toFixed(2));

            descontoIcon.classList.add("ativo");

            aplicarValores();
            // atualizarParticular();
        });
}

function removerDesconto(produtoItem, descontoIcon) {
    const original = parseFloat(produtoItem.getAttribute("data-valor-repasse-original"));

    if (!isNaN(original)) {
        produtoItem.setAttribute("data-valor-repasse", original.toFixed(2));
    }

    descontoIcon.classList.remove("ativo");
    produtoItem.classList.remove("desconto-ativo");
    aplicarValores();
}


// ---------------------------------------- BUSCAR STATUS --------------------------------------------------
// document.addEventListener("DOMContentLoaded", function () {
//     fetch("/buscar_status/")
//         .then(response => response.json())
//         .then(data => {
//             const statusSelect = document.getElementById("status");
//             statusSelect.innerHTML = "";
            
//             data.status.forEach(status => {
//                 let option = document.createElement("option");
//                 option.value = status.id;
//                 option.textContent = status.nome;
//                 statusSelect.appendChild(option);
//             });

//             if (statusSelect.hasAttribute("data-status-atual")) {
//                 selecionarStatusAtual();
//             }
//         })
//         .catch(error => console.error("Erro ao carregar status:", error));
// });

// -------------------------------------- BUSCAR ESPECIALIDADES ---------------------------------------------
// function buscarEspecialidades(specialtySelect){
//     fetch("/buscar_especialidades/")
//     .then(response => response.json())
//     .then(especialidades => {
//       especialidades.forEach(especialidade => {
//           let option = document.createElement("option");
//           option.value = especialidade.id;
//           option.textContent = especialidade.nome;
//           specialtySelect.appendChild(option);
//       });
//     })
//     .catch(error => console.error("Erro ao buscar especialidades:", error));
//   }

  // -------------------------------------- BUSCAR PROCEDIMENTOS ---------------------------------------------
function buscarProcedimentos(dropdown, inputProcedimentos, especialidadeSelecionada){
    const query = inputProcedimentos.value.trim();
    if (query.length < 1) {
        dropdown.innerHTML = "";
        dropdown.style.display = "none";
        return;
    }
  
    fetch(`/api/buscar_procedimentos_by/?q=${encodeURIComponent(query)}&especialidade=${especialidadeSelecionada}`)
        .then(response => response.json())
        .then(data => {
            dropdown.innerHTML = "";
            if (data.length === 0) {
                dropdown.style.display = "none";
                return;
            }
  
            data.forEach(procedimento => {
                let option = document.createElement("div");
                option.textContent = procedimento.nome;
                option.classList.add("dropdown-item");
                option.setAttribute("data-id", procedimento.id);
  
                option.addEventListener("click", function () {
                    inputProcedimentos.value = procedimento.nome;
                    inputProcedimentos.setAttribute("data-id", procedimento.id);
                    dropdown.style.display = "none";
                });
  
                dropdown.appendChild(option);
            });
  
            dropdown.style.display = "block";
        })
        .catch(error => console.error("Erro ao buscar prcoedimentos:", error));
  }