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
function adicionarProdutoBy(produtosContainer, parceiroId, nomeParceiro, subtotalElement, onProdutoCriado = null) {

    const comboBox = produtosContainer.querySelector(".combo-box-produto");
    const inputProduto = comboBox ? comboBox.querySelector(".input-produto") : null;
    const dropdownProdutos = comboBox
        ? comboBox.querySelector(".dropdown-produtos")
        : document.createElement("div");

    if (!comboBox) {
        dropdownProdutos.classList.add("dropdown-produtos");
        produtosContainer.appendChild(dropdownProdutos);
    }

    dropdownProdutos.style.display = "block";

    // =====================================================
    // 🔹 FUNÇÃO DE INICIALIZAÇÃO (SEM FETCH DUPLICADO)
    // =====================================================
    function inicializarDropdown(produtos) {

        function renderizar(lista) {
            dropdownProdutos.innerHTML = "";

            lista.forEach(produto => {
                const option = document.createElement("div");
                option.textContent = produto.nome;
                option.classList.add("dropdown-item");

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

                    valorInput.addEventListener("input", aplicarValores);

                    let descontoIcon = document.createElement("span");
                    descontoIcon.textContent = "2º";
                    descontoIcon.classList.add("badge-segundo");
                    descontoIcon.title = "Aplicar desconto de segundo procedimento";

                    descontoIcon.addEventListener("click", function () {
                        aplicarDescontoSegundoProduto(
                            produtoItem,
                            parceiroId,
                            produtosContainer,
                            descontoIcon
                        );
                    });

                    const produtoCriado = {
                        parceiro_id: parceiroId,
                        parceiro: nomeParceiro,

                        produto_id: produto.id,
                        produto: produto.nome,

                        valor_venda: Number(produto.valor_venda || 0),
                        valor_repasse: Number(produto.valor_repasse || 0),
                        valor_particular: Number(produto.valor_particular || 0),

                        comissao_indicacao: 0,
                        comissao_venda: 0,
                        brindes: 0,
                        impostos: 0,
                        cartoes: 0,
                        margem_lucro: 15.0
                    };

                    if (typeof resumoOrcamento !== "undefined") {
                        resumoOrcamento.push(produtoCriado);
                    }

                    let removerProdutoBtn = document.createElement("button");
                    removerProdutoBtn.textContent = "❌";
                    removerProdutoBtn.onclick = function () {
                        produtoItem.remove();

                        if (typeof resumoOrcamento !== "undefined") {
                            resumoOrcamento = resumoOrcamento.filter(item =>
                                !(String(item.parceiro_id) === String(parceiroId) &&
                                String(item.produto_id) === String(produto.id))
                            );
                        }

                        validarDescontosMinimos(produtosContainer);
                        aplicarValores();
                        atualizarParticular();
                    };

                    produtoItem.appendChild(produtoNome);
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

                    dropdownProdutos.style.display = "none";
                    if (inputProduto) inputProduto.value = "";

                    aplicarValores();
                    atualizarParticular();
                });

                dropdownProdutos.appendChild(option);
            });

            dropdownProdutos.style.display = "block";
        }

        // 🔹 render inicial (lista completa)
        renderizar(produtos);

        // 🔹 filtro local (SEM FETCH)
        if (inputProduto) {
            inputProduto.oninput = function () {
                const termo = inputProduto.value.toLowerCase();
                renderizar(
                    produtos.filter(p =>
                        p.nome.toLowerCase().includes(termo)
                    )
                );
            };

            inputProduto.onfocus = function () {
                renderizar(produtos);
            };
        }

        // 🔹 fechar ao clicar fora
        function handleClickOutside(event) {
            if (
                (!comboBox && !dropdownProdutos.contains(event.target)) ||
                (comboBox && !comboBox.contains(event.target))
            ) {
                dropdownProdutos.style.display = "none";
                document.removeEventListener("click", handleClickOutside);
            }
        }

        setTimeout(() => {
            document.addEventListener("click", handleClickOutside);
        }, 0);
    }

    // =====================================================
    // 🔹 SE JÁ TEM CACHE → NÃO FAZ FETCH
    // =====================================================
    if (cacheProdutosPorParceiro[nomeParceiro]) {
        inicializarDropdown(cacheProdutosPorParceiro[nomeParceiro]);
        return;
    }

    // =====================================================
    // 🔹 FETCH ÚNICO POR PARCEIRO
    // =====================================================
    dropdownProdutos.innerHTML = "";
    const loadingMsg = document.createElement("div");
    loadingMsg.textContent = "Carregando produtos...";
    loadingMsg.classList.add("loading-indicator");
    dropdownProdutos.appendChild(loadingMsg);

    fetch(`/api/buscar_produtos_por_parceiro/?parceiro_nome=${encodeURIComponent(nomeParceiro)}`)
        .then(response => response.json())
        .then(data => {
            loadingMsg.remove();

            if (!data || data.length === 0) {
                alert("Nenhum produto disponível para este parceiro.");
                dropdownProdutos.style.display = "none";
                return;
            }

            // 🔹 salva cache
            cacheProdutosPorParceiro[nomeParceiro] = data;

            inicializarDropdown(data);
        })
        .catch(error => {
            console.error("Erro ao buscar produtos:", error);
            dropdownProdutos.style.display = "none";
        });
}

function atualizarMargem() {
    const inputMargem = document.getElementById("margem_lucro");
    const margemExibida = document.getElementById("margem-exibida");
    const valor = parseFloat(inputMargem.value);

    margemExibida.textContent = isNaN(valor)
        ? "(Margem: 0%)"
        : `(Margem: ${valor.toFixed(2)}%)`;
}

function aplicarDescontoSegundoProduto(produtoItem, parceiroId, produtosContainer, descontoIcon) {

    const produtos = produtosContainer.querySelectorAll(".produto-item");

    if (produtos.length < 2) {
        alert("O desconto de segundo procedimento exige pelo menos dois produtos.");

        descontoIcon.classList.remove("ativo");
        produtoItem.classList.remove("desconto-ativo");
        return;
    }

    const ativando = !descontoIcon.classList.contains("ativo");

    // 🔹 Se está desligando → apenas remove deste item
    if (!ativando) {
        removerDesconto(produtoItem, descontoIcon);
        return;
    }

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

            if (typeof resumoOrcamento !== "undefined") {
                const produtoId = produtoItem.getAttribute("data-id");

                resumoOrcamento.forEach(item => {
                    if (
                        String(item.parceiro_id) === String(parceiroId) &&
                        String(item.produto_id) === String(produtoId)
                    ) {
                        item.valor_repasse = novoValor;
                    }
                });
            }

            produtoItem.setAttribute("data-desconto-percentual", desconto);

            descontoIcon.textContent = `2º -${desconto}%`;
            descontoIcon.classList.add("ativo");
            produtoItem.classList.add("desconto-ativo");

            aplicarValores();
            // atualizarParticular();
        });
}

function removerDesconto(produtoItem, descontoIcon) {
    const original = parseFloat(produtoItem.getAttribute("data-valor-repasse-original"));

    if (!isNaN(original)) {
        produtoItem.setAttribute("data-valor-repasse", original.toFixed(2));
    }

    if (typeof resumoOrcamento !== "undefined") {
        const produtoId = produtoItem.getAttribute("data-id");
        const parceiroId = produtoItem.getAttribute("data-parceiro-id");

        resumoOrcamento.forEach(item => {
            if (
                String(item.parceiro_id) === String(parceiroId) &&
                String(item.produto_id) === String(produtoId)
            ) {
                item.valor_repasse = original;
            }
        });
    }

    produtoItem.removeAttribute("data-desconto-percentual");
    descontoIcon.textContent = "2º";

    descontoIcon.classList.remove("ativo");
    produtoItem.classList.remove("desconto-ativo");
    aplicarValores();
}

function validarDescontosMinimos(produtosContainer) {
    const produtos = produtosContainer.querySelectorAll(".produto-item");

    if (produtos.length < 2) {
        produtos.forEach(item => {
            const icon = item.querySelector(".badge-segundo");
            if (icon && icon.classList.contains("ativo")) {
                removerDesconto(item, icon);
            }
        });
    }
}

function preencherTabelaResumo(dados) {
    const table = document.querySelector('.tabela-parceiros');
    const tbody = table.querySelector("tbody");

    tbody.innerHTML = "";

    let totais = {
        venda: 0,
        repasse: 0,
        particular: 0,
        comissao_indicacao: 0,
        comissao_venda: 0,
        brindes: 0
    };

    dados.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.parceiro}</td>
            <td>${item.produto}</td>
            <td>R$ ${item.valor_venda}</td>
            <td>R$ ${item.valor_repasse}</td>
            <td>R$ ${item.valor_particular}</td>
            <td>R$ ${item.comissao_indicacao}</td>
            <td>R$ ${item.comissao_venda}</td>
            <td>R$ ${item.brindes}</td>
            <td>${item.impostos}%</td>
            <td>${item.cartoes}%</td>
            <td>${item.margem_lucro}%</td>
        `;
        tbody.appendChild(tr);

        totais.venda += Number(item.valor_venda || 0);
        totais.repasse += Number(item.valor_repasse || 0);
        totais.particular += Number(item.valor_particular || 0);
        totais.comissao_indicacao += Number(item.comissao_indicacao || 0);
        totais.comissao_venda += Number(item.comissao_venda || 0);
        totais.brindes += Number(item.brindes || 0);
    });

    let tfoot = table.querySelector("tfoot");
    if (!tfoot) {
        tfoot = document.createElement("tfoot");
        table.appendChild(tfoot);
    }

    tfoot.innerHTML = `
        <tr>
            <td></td>
            <td>Total</td>
            <td>R$ ${totais.venda}</td>
            <td>R$ ${totais.repasse}</td>
            <td>R$ ${totais.particular}</td>
            <td>R$ ${totais.comissao_indicacao}</td>
            <td>R$ ${totais.comissao_venda}</td>
            <td>R$ ${totais.brindes}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>
    `;
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