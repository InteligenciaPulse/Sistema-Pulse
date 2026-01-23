// ====================================== PACIENTE
document.addEventListener("DOMContentLoaded", function () {
    const inputPaciente = document.getElementById("paciente");
    const dropdown = document.getElementById("sugestoes-pacientes");

    inputPaciente.addEventListener("input", function () {
        const query = inputPaciente.value.trim();

        if (query.length < 1) {
            dropdown.innerHTML = "";
            dropdown.style.display = "none";
            return;
        }

        dropdown.innerHTML = "<div style='padding:8px; color:gray;'>Carregando...</div>";
        dropdown.style.display = "block";
        
        fetch(`/api/buscar_pacientes/?q=${query}`)
        .then(response => response.json())
        .then(data => {
            dropdown.innerHTML = "";
            if (data.length === 0) {
                dropdown.style.display = "none";
                return;
            }

            dropdown.style.display = "block";
            data.forEach(paciente => {
                let div = document.createElement("div");
                div.dataset.id = paciente.id;
                div.innerText = paciente.nome;
                div.onclick = function () {
                    inputPaciente.value = paciente.nome;
                    inputPaciente.dataset.id = paciente.id;
                    dropdown.style.display = "none";
                };
                dropdown.appendChild(div);
            });
        }).catch(error => console.error("Erro ao buscar pacientes:", error));
    });

    document.addEventListener("click", function (event) {
        if (!inputPaciente.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = "none";
        }
    });
});

document.addEventListener("click", function(event) {
    if (!event.target.closest(".filter-paciente")) {
        document.getElementById("sugestoes-pacientes").style.display = "none";
    }
});

// -------------------------------------PARCEIROS-------------------------------------------------------
const cacheProdutosPorParceiro = {};

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
    
            // let adicionarProdutoBtn = document.createElement("button");
            // adicionarProdutoBtn.textContent = "Adicionar Produto";
    
            // adicionarProdutoBtn.onclick = function () {
            //     adicionarProdutoBy(produtosContainer, idParceiro, titulo.textContent.trim(), subtotal);
            // };
            
            // let buttonsDiv = document.createElement("div");
            // buttonsDiv.classList.add("produtos-container-buttons");
            // buttonsDiv.appendChild(adicionarProdutoBtn);

            // ----------
            let comboProduto = document.createElement("div");
            comboProduto.classList.add("combo-box-produto");

            let inputProduto = document.createElement("input");
            inputProduto.type = "text";
            inputProduto.placeholder = "Selecione o produto";
            inputProduto.classList.add("input-produto");
            inputProduto.autocomplete = "off";

            inputProduto.addEventListener("focus", function () {
                adicionarProdutoBy(produtosContainer, idParceiro, parceiroNome, subtotal);
            });

            inputProduto.addEventListener("input", function () {
                adicionarProdutoBy(produtosContainer, idParceiro, parceiroNome, subtotal);
            });

            let dropdownProdutos = document.createElement("div");
            dropdownProdutos.classList.add("dropdown-produtos");

            comboProduto.appendChild(inputProduto);
            comboProduto.appendChild(dropdownProdutos);

            produtosContainer.appendChild(comboProduto);
            // -------

            let removerParceiroBtn = document.createElement("button");
            removerParceiroBtn.textContent = "❌";
            removerParceiroBtn.onclick = function () {
                parceiroDiv.remove();
                // atualizarSubtotal();
                aplicarValores();
                atualizarParticular()
            };
    
            let headerDiv = document.createElement("div");
            headerDiv.classList.add("produtos-container-header");
            headerDiv.appendChild(removerParceiroBtn);
            headerDiv.appendChild(titulo)
            
            parceiroDiv.appendChild(headerDiv);
            // produtosContainer.appendChild(buttonsDiv);
            parceiroDiv.appendChild(produtosContainer);
            // parceiroDiv.appendChild(buttonsDiv);
            parceiroDiv.appendChild(subtotal);
    
            listaParceiros.appendChild(parceiroDiv);

            const inputParceiro = document.getElementById("input-parceiro");
            if (inputParceiro) {
                inputParceiro.value = "";
                inputParceiro.removeAttribute("data-id");
            }

            // const selectParceiro = document.getElementById("parceiro");
            // if (selectParceiro) {
            //     selectParceiro.value = "";
            // }
        }
    };

    if (subtipoSelect.value) {
        atualizarParceiros(subtipoSelect.value);
    }
});

// ---------------------------------------------- MODAL ADICIONAR PACIENTE ---------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("modal-paciente");
    var modalContent = document.querySelector(".modal-content");
    var btnAbrir = document.getElementById("novo-paciente");
    var btnFechar = document.querySelector(".close");

    if (!modal || !modalContent || !btnAbrir || !btnFechar) {
        console.error("Erro: Algum elemento do modal não foi encontrado.");
        return;
    }

    // Abrir o modal ao clicar no botão "+"
    btnAbrir.addEventListener("click", function () {
        modal.style.display = "flex"; // Usa flexbox para centralizar
    });

    // Fechar o modal ao clicar no botão "X"
    btnFechar.addEventListener("click", function () {
        modal.style.display = "none";
    });
    
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("modal-paciente").style.display = "none";
});

document.getElementById('form-adicionar-paciente').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch('/api/salvar_paciente/', {
        method: 'POST',
        headers: {
            "X-CSRFToken": getCSRFToken()
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            location.reload();
        } else {
            alert('Erro: ' + data.error);
        }
    })
    .catch(error => console.error('Erro:', error));
});

// ---------------------------------------------------------------------------------------------------------------------------

// ----------------------------------------- ORCAMENTO ------------------------------------------------------
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.getElementById("proximo-passo").addEventListener("click", function () {
    const btnFinalizar = document.getElementById("proximo-passo");

    btnFinalizar.addEventListener("click", async function () {
        if (btnFinalizar.disabled) return;

        const pacienteId = document.getElementById("paciente").dataset.id;
        const statusSelecionado = document.getElementById("status").value;
        const colunaId = getQueryParam("coluna_id");

        if (!pacienteId) {
            alert("Selecione um paciente antes de finalizar o orçamento.");
            return;
        }

        btnFinalizar.disabled = true;
        const textoOriginal = btnFinalizar.textContent;
        btnFinalizar.textContent = "Salvando... ⏳";

        try {
            const produtosSelecionados = Array.from(document.querySelectorAll(".produto-item")).map(item => ({
                parceiro_id: item.getAttribute("data-parceiro-id"),
                produto_id: item.getAttribute("data-id"),
                valor_venda: parseFloat(item.querySelector("input").value || 0),
                comissao_indicacao: parseFloat(item.getAttribute("comissao_indicacao") || 0),
                comissao_venda: parseFloat(item.getAttribute("comissao-venda") || 0),
                brindes: parseFloat(item.getAttribute("brindes") || 0),
                impostos: parseFloat(item.getAttribute("impostos") || 0),
                cartoes: parseFloat(item.getAttribute("cartoes") || 0),
                margem_lucro: parseFloat(item.getAttribute("margem_lucro") || 0),
            }));

            const procedimentosSelecionados = Array.from(document.querySelectorAll(".procedimento-item")).map(item => ({
                procedimento_id: item.getAttribute("data-id")
            }));
            
            const valorElemento = document.getElementById("total-geral").textContent;
            let valorStr = valorElemento.replace("Total:", "").replace("R$", "").trim();
            valorStr = valorStr.replace(/\./g, "").replace(",", ".");
            const valorTotal = parseFloat(valorStr);

            const tipo_orcamento = document.getElementById("classify")?.value || "";
            const responsavel = document.getElementById("parcrespon")?.value.trim() || "";
            const observacoes = document.getElementById("observacoes")?.value.trim() || "";
            const pagamento = document.getElementById("pagamento")?.value || "";
            const canal = document.getElementById("canal")?.value || "";
            const data_agendamento = document.getElementById("data_agendamento")?.value || null;
            const data_aprovacao = document.getElementById("data_aprovacao")?.value || null;

            const payload = {
                paciente_id: pacienteId,
                status: statusSelecionado,
                valor_total: valorTotal.toFixed(2),
                produtos: produtosSelecionados,
                procedimentos: procedimentosSelecionados,
                tipo_orcamento: tipo_orcamento,
                responsavel: responsavel,
                observacoes: observacoes,
                pagamento: pagamento,
                canal: canal,
                coluna_id: colunaId,
                data_agendamento: data_agendamento,
                data_aprovacao: data_aprovacao
            };
            
            const response = await fetch("/api/salvar_orcamento/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken()
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                btnFinalizar.textContent = "Salvo ✅";
                alert("Orçamento criado com sucesso!");
                window.location.href = 'https://sistema-pulse-production.up.railway.app/';
            } else {
                throw new Error(data.error || "Erro ao criar orçamento.");
            }
        } catch (error) {
            console.error("Erro ao salvar orçamento:", error);
            alert("Erro ao salvar orçamento. Tente novamente.");
            btnFinalizar.textContent = "Erro ❌";
        } finally {
            setTimeout(() => {
                btnFinalizar.disabled = false;
                btnFinalizar.textContent = textoOriginal;
            }, 2000);
        }
    });
});

// =================================================== PACOTES
function adicionarPacote(container, produtosContainer, subtotalElement) {
    let dropdownPacotes = document.createElement("div");
    dropdownPacotes.classList.add("dropdown-pacotes");

    let inputPacote = document.createElement("input");
    inputPacote.type = "text";
    inputPacote.placeholder = "Digite o nome do pacote...";
    inputPacote.classList.add("input-dropdown");

    let sugestoesPacotes = document.createElement("div");
    sugestoesPacotes.classList.add("dropdown-list");

    inputPacote.addEventListener("input", function () {
        const query = inputPacote.value.trim();
        if (query.length < 1) {
            sugestoesPacotes.innerHTML = "";
            return;
        }

        fetch(`/api/buscar_pacotes/?q=${query}`)
            .then(response => response.json())
            .then(data => {
                sugestoesPacotes.innerHTML = "";
                if (data.length === 0) return;

                data.forEach(pacote => {
                    let option = document.createElement("div");
                    option.textContent = pacote.nome;
                    option.classList.add("dropdown-item");

                    option.addEventListener("click", function () {
                        adicionarPacoteAoContainer(produtosContainer, pacote, subtotalElement);
                        dropdownPacotes.remove();
                        // atualizarSubtotal(produtosContainer, subtotalElement);
                        aplicarValores();
                    });

                    sugestoesPacotes.appendChild(option);
                });
            })
            .catch(error => console.error("Erro ao buscar pacotes:", error));
    });

    dropdownPacotes.appendChild(inputPacote);
    dropdownPacotes.appendChild(sugestoesPacotes);

    container.appendChild(dropdownPacotes);
}

function adicionarPacoteAoContainer(produtosContainer, pacote, subtotalElement) {
    let pacoteItem = document.createElement("div");
    pacoteItem.classList.add("pacote-item");

    let pacoteNome = document.createElement("span");
    pacoteNome.textContent = `📦 ${pacote.nome}`;

    let valorInput = document.createElement("input");
    valorInput.type = "number";
    valorInput.placeholder = "Valor R$";
    valorInput.step = 0.01;
    valorInput.min = 0;
    valorInput.classList.add("valor-input");

    let listaProdutos = document.createElement("ul");
    listaProdutos.classList.add("lista-produtos");

    fetch(`/api/buscar_produtos_por_pacote/?pacote_nome=${encodeURIComponent(pacote.nome)}`)
        .then(response => response.json())
        .then(produtos => {
            if (produtos.length === 0) {
                let item = document.createElement("li");
                item.textContent = "Nenhum produto encontrado.";
                listaProdutos.appendChild(item);
            } else {
                produtos.forEach(proc => {
                    let item = document.createElement("li");
                    item.textContent = `${proc.nome}`;
                    listaProdutos.appendChild(item);
                });
            }
        })
        .catch(error => console.error("Erro ao buscar produtos do pacote:", error));

        let removerPacoteBtn = document.createElement("button");
        removerPacoteBtn.textContent = "❌";
        removerPacoteBtn.classList.add("remover-pacote");
        removerPacoteBtn.onclick = function () {
            pacoteItem.remove();
            // atualizarSubtotal(produtosContainer, subtotalElement);
            aplicarValores();
        };
    
        let infoContainer = document.createElement("div");
        infoContainer.classList.add("pacote-info");
        infoContainer.appendChild(pacoteNome);
        infoContainer.appendChild(valorInput);
        infoContainer.appendChild(removerPacoteBtn);
    
        pacoteItem.appendChild(infoContainer);
        pacoteItem.appendChild(listaProdutos);
    
        produtosContainer.appendChild(pacoteItem);

        valorInput.addEventListener("input", function () {
            // atualizarSubtotal(produtosContainer, subtotalElement);
            aplicarValores();
        });

        // atualizarSubtotal(produtosContainer, subtotalElement);
        aplicarValores();
}

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

// ------------------------------------------ MODAL CONFIG -----------------------------------------------------
function abrirModal() {
    document.getElementById("modal-configuracao").style.display = "block";
}

function fecharModal() {
    document.getElementById("modal-configuracao").style.display = "none";
}

document.getElementById("classify").addEventListener("change", function () {
    aplicarValores();
});

function aplicarValores() {
    const tipo = document.getElementById("classify").value;
    console.log(tipo);

    if (tipo === "Consulta / Exame" || tipo === "Procedimento") {
        let produtosSelecionados = [];
        var total_particular = 0;

        document.querySelectorAll(".produto-item").forEach(item => {
            produtosSelecionados.push({
                valor_venda: parseFloat(item.querySelector("input").value || 0),
                total_particular: total_particular + parseFloat(item.getAttribute('data-valor-particular'))
            });
        });

        const valorTotal = produtosSelecionados.reduce((total, p) => total + p.valor_venda, 0);

        document.getElementById("total-geral").textContent = `Total: R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        document.getElementById("total-particular").textContent = `Total particular: R$ ${total_particular.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        fecharModal();
        return;
    } else {
    
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
                // produto.setAttribute("valor_venda", margem);
            });
        });

        let fixos = total_repasse + parseFloat(comissao_indicacao) + parseFloat(brindes);
        let variaveis = parseFloat(impostos) / 100 + parseFloat(cartoes) / 100 + parseFloat(margem) / 100 + parseFloat(comissao_venda) / 100;
        
        // let valor_venda_total = fixos / (1 - variaveis);
        let valor_venda_total = (fixos * (1 - (parseFloat(impostos) / 100))) / (1 - variaveis)
        
        // let custo_total = fixos + valor_venda_total * parseFloat(impostos) / 100 + valor_venda_total * parseFloat(cartoes) / 100;

        document.getElementById("total-geral").textContent = `Total: R$ ${valor_venda_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        document.getElementById("total-particular").textContent = `Total particular: R$ ${total_particular.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // verificarValores();

        fecharModal();
    }
    atualizarMargem();
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
            // produto.setAttribute("valor_venda", margem);
        });
    });

    let fixos = total_repasse + parseFloat(comissao_indicacao) + parseFloat(brindes);
    let impostosPerc = parseFloat(impostos) / 100;
    let cartoesPerc = parseFloat(cartoes) / 100;
    let comissaoPerc = parseFloat(comissao_venda) / 100;

    let novaMargem = (1 - (fixos * (1 - impostosPerc)) / novoValorVenda) - (impostosPerc + cartoesPerc + comissaoPerc);
    margem = (novaMargem * 100).toFixed(2);

    // aplicarValores();

    parceiroCards.forEach(function(parceiroCard) {
        const produtoItems = parceiroCard.querySelectorAll(".produto-item");

        produtoItems.forEach(function(produto) {
            produto.setAttribute("margem_lucro", margem);
        });
    });
    
    document.getElementById("margem_lucro").value = margem;
    atualizarMargem();
}

// valorVendaSpan.textContent = valorVenda.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
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

    // if (total_geral > total_particular) {
    //     console.log("O total geral é maior que o total particular.");
    //     return "geral > particular";
    // } else if (total_geral < total_particular) {
    //     console.log("O total particular é maior que o total geral.");
    //     return "particular > geral";
    // } else {
    //     console.log("Os totais são iguais.");
    //     return "iguais";
    // }
}
// -------------------------------------------------------------------------------------------------------------
function mostrarCarregando() {
  const overlay = document.getElementById("loading-overlay");
  overlay.style.display = "flex";
}

function ocultarCarregando() {
  const overlay = document.getElementById("loading-overlay");
  overlay.style.display = "none";
}

function abrirModalTabela() {
    document.getElementById("modal-tabela").style.display = "flex";
    preencherTabela();
}

function fecharModalTabela() {
    document.getElementById("modal-tabela").style.display = "none";
}

function preencherTabela() {
    var vendaTotal = 0;
    var repasseTotal = 0;
    var particularTotal = 0;
    var comissaoResumo = 0;
    var brindesResumo = 0;
    var impostosResumo = 0;
    var cartoesResumo = 0;
    var margemResumo = 0;
    const table = document.querySelector('.tabela-parceiros')
    const tbody = document.querySelector(".tabela-parceiros tbody");
    tbody.innerHTML = "";

    const parceiroCards = document.querySelectorAll(".parceiro-card");

    parceiroCards.forEach(function(parceiro) {
        const parceiroNome = parceiro.querySelector(".produtos-container-header h5").textContent;

        let produtos = [];
        const produtoContainer = parceiro.querySelector(".produtos-container");
        const produtoItems = produtoContainer.querySelectorAll(".produto-item");

        produtoItems.forEach(function(produto) {
            const produtoNome = produto.querySelector("span").textContent;
            const valorVenda = produto.querySelector("input").value;
            const valorRepasse = produto.getAttribute("data-valor-repasse");
            const valorParticular = produto.getAttribute("data-valor-particular");
            const comissao = produto.getAttribute("comissao");
            const brindes = produto.getAttribute("brindes");
            const impostos = produto.getAttribute("impostos");
            const cartoes = produto.getAttribute("cartoes");
            const margem_lucro = produto.getAttribute("margem_lucro");

            let produtoData = {
                nome: produtoNome,
                valor_venda: valorVenda,
                valor_repasse: valorRepasse,
                valor_particular: valorParticular,
                comissao: comissao,
                brindes: brindes,
                impostos: impostos,
                cartoes: cartoes,
                margem_lucro: margem_lucro
            };
    
            produtos.push(produtoData);
        });
        
        
        produtos.forEach(function(produto) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <td>${parceiroNome}</td>
            <td>${produto.nome}</td>
            <td>R$ ${produto.valor_venda}</td>
            <td>R$ ${produto.valor_repasse}</td>
            <td>R$ ${produto.valor_particular}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            `;
            tbody.appendChild(tr);
        });
        
        produtos.forEach(function(produto){
            comissaoResumo = produto.comissao;
            brindesResumo = produto.brindes;
            impostosResumo = produto.impostos;
            cartoesResumo = produto.cartoes;
            margemResumo = produto.margem_lucro;
            vendaTotal += parseFloat(produto.valor_venda);
            repasseTotal += parseFloat(produto.valor_repasse);
            particularTotal += parseFloat(produto.valor_particular);
        });
    });

    let tfoot = table.querySelector("tfoot");

    if (!tfoot) {
        tfoot = document.createElement("tfoot");
        table.appendChild(tfoot);
    }
    
    tfoot.innerHTML = "";
    tfoot.innerHTML = `
    <td></td>
    <td>Total</td>
    <td>R$ ${vendaTotal}</td>
    <td>R$ ${repasseTotal}</td>
    <td>R$ ${particularTotal}</td>
    <td>R$ ${comissaoResumo}</td>
    <td>R$ ${brindesResumo}</td>
    <td>${impostosResumo}%</td>
    <td>${cartoesResumo}%</td>
    <td>${margemResumo}%</td>
    `;
    table.appendChild(tfoot);
}