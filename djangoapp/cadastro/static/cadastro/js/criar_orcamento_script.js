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

        fetch(`/buscar_pacientes/?q=${query}`)
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

// =================================================== PROCEDIMENTOS
// document.addEventListener("DOMContentLoaded", function () {
//     const inputProduto = document.getElementById("produto");
//     const dropdown = document.getElementById("sugestoes-produtos");
//     const listaProdutos = document.getElementById("produtos-list");

//     inputProduto.addEventListener("input", function () {
//         const query = inputProduto.value.trim();
//         if (query.length < 1) {
//             dropdown.innerHTML = "";
//             dropdown.style.display = "none";
//             return;
//         }

//         fetch(`/buscar_produtos/?q=${query}`)
//             .then(response => response.json())
//             .then(data => {
//                 dropdown.innerHTML = "";
//                 if (data.length === 0) {
//                     dropdown.style.display = "none";
//                     return;
//                 }

//                 data.forEach(produto => {
//                     let option = document.createElement("div");
//                     option.textContent = produto.nome;
//                     option.classList.add("dropdown-item");

//                     option.addEventListener("click", function () {
//                         inputProduto.value = produto.nome;
//                         dropdown.style.display = "none";
//                     });

//                     dropdown.appendChild(option);
//                 });

//                 dropdown.style.display = "block";
//             })
//             .catch(error => console.error("Erro ao buscar produtos:", error));
//     });

//     document.addEventListener("click", function (event) {
//         if (!inputProduto.contains(event.target) && !dropdown.contains(event.target)) {
//             dropdown.style.display = "none";
//         }
//     });

//     window.adicionarProduto = function () {
//         const nome = inputProduto.value.trim();

//         if (!nome) {
//             alert("Selecione um produto válido.");
//             return;
//         }

//         let produtoDiv = document.createElement("div");
//         produtoDiv.classList.add("produto-card");

//         let titulo = document.createElement("h5");
//         titulo.textContent = nome;

//         let parceirosContainer = document.createElement("div");
//         parceirosContainer.classList.add("parceiros-container");

//         let adicionarParceiroBtn = document.createElement("button");
//         adicionarParceiroBtn.textContent = "Adicionar Parceiro";

//         adicionarParceiroBtn.onclick = function () {
//             adicionarParceiro(parceirosContainer, titulo.textContent.trim());
//         };

//         let removerProdutoBtn = document.createElement("button");
//         removerProdutoBtn.textContent = "❌ Remover Produto";
//         removerProdutoBtn.onclick = function () {
//             produtoDiv.remove();
//         };

//         produtoDiv.appendChild(titulo);
//         produtoDiv.appendChild(parceirosContainer);
//         produtoDiv.appendChild(adicionarParceiroBtn);
//         produtoDiv.appendChild(removerProdutoBtn);

//         listaProdutos.appendChild(produtoDiv);

//         inputProduto.value = "";
//     };
// });


// -------------------------------------PARCEIROS-------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const selectParceiro = document.getElementById("parceiro");
    const subtipoSelect = document.getElementById("subtipo-select");
    const listaParceiros = document.getElementById("parceiros-list");

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
    
            let adicionarPacoteBtn = document.createElement("button");
            adicionarPacoteBtn.textContent = "Adicionar Pacote";
    
            adicionarPacoteBtn.onclick = function () {
                adicionarPacote(pacoteDropdownDiv, produtosContainer, subtotal);
            };
    
            let pacoteDropdownDiv = document.createElement("div");
    
            let buttonsDiv = document.createElement("div");
            buttonsDiv.classList.add("produtos-container-buttons");
            buttonsDiv.appendChild(adicionarProdutoBtn);
            buttonsDiv.appendChild(adicionarPacoteBtn);
    
            let removerParceiroBtn = document.createElement("button");
            removerParceiroBtn.textContent = "❌ Remover Parceiro";
            removerParceiroBtn.onclick = function () {
                parceiroDiv.remove();
            };
    
            let headerDiv = document.createElement("div");
            headerDiv.classList.add("produtos-container-header");
            headerDiv.appendChild(titulo)
            headerDiv.appendChild(removerParceiroBtn);
            
            parceiroDiv.appendChild(headerDiv);
            parceiroDiv.appendChild(produtosContainer);
            parceiroDiv.appendChild(buttonsDiv);
            parceiroDiv.appendChild(pacoteDropdownDiv);
            parceiroDiv.appendChild(subtotal);
    
            listaParceiros.appendChild(parceiroDiv);
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

    fetch('/salvar_paciente/', {
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
document.getElementById("proximo-passo").addEventListener("click", function () {
    const pacienteId = document.getElementById("paciente").dataset.id;
    const statusSelecionado = document.getElementById("status").value;

    if (!pacienteId) {
        alert("Selecione um paciente antes de finalizar o orçamento.");
        return;
    }

    let produtosSelecionados = [];
    document.querySelectorAll(".produto-item").forEach(item => {
        produtosSelecionados.push({
            parceiro_id: item.getAttribute("data-parceiro-id"),
            produto_id: item.getAttribute("data-id"),
            valor_venda: parseFloat(item.querySelector("input").value || 0),
            comissao: item.getAttribute("comissao"),
            brindes: item.getAttribute("brindes"),
            impostos: item.getAttribute("impostos"),
            cartoes: item.getAttribute("cartoes"),
            margem_lucro: item.getAttribute("margem_lucro"),
        });
    });

    const valorTotal = produtosSelecionados.reduce((total, proc) => total + proc.valor_venda, 0);

    const payload = {
        paciente_id: pacienteId,
        status: statusSelecionado,
        valor_total: valorTotal.toFixed(2),
        produtos: produtosSelecionados,
    };

    fetch("/salvar_orcamento/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Orçamento criado com sucesso!");
            window.location.href = `/visualizar-orcamento-html/${data.orcamento_id}/`;
        } else {
            alert("Erro ao criar orçamento: " + data.error);
        }
    })
    .catch(error => console.error("Erro ao salvar orçamento:", error));
});

// ----------------------------------------------------------------------------------------------------------

// =================================================== PARCEIROS POR PROCEDIMENTO
// function adicionarParceiro(parceirosContainer, nomeProduto) {
//     fetch(`/buscar_parceiros_por_produto/?produto_nome=${encodeURIComponent(nomeProduto)}`)
//         .then(response => response.json())
//         .then(data => {
//             let dropdownParceiros = document.createElement("div");
//             dropdownParceiros.classList.add("dropdown-parceiros");

//             if (data.length === 0) {
//                 alert("Nenhum parceiro disponível para este produto.");
//                 return;
//             }

//             data.forEach(parceiro => {
//                 let option = document.createElement("div");
//                 option.textContent = parceiro.nome;
//                 option.classList.add("dropdown-item");

//                 option.addEventListener("click", function () {
//                     let parceiroItem = document.createElement("div");
//                     parceiroItem.classList.add("parceiro-item");

//                     let parceiroNome = document.createElement("span");
//                     parceiroNome.textContent = parceiro.nome;

//                     // Criar select de subtipo do parceiro
//                     // let subtipoSelect = document.createElement("select");
//                     // subtipoSelect.classList.add("subtipo-select");

//                     // parceiro.subtipos.forEach(subtipo => {
//                     //     let option = document.createElement("option");
//                     //     option.value = subtipo.id;
//                     //     option.textContent = subtipo.nome;
//                     //     subtipoSelect.appendChild(option);
//                     // });

//                     let valorInput = document.createElement("input");
//                     valorInput.type = "number";
//                     valorInput.placeholder = "Valor R$";
//                     valorInput.step = 0.01;
//                     valorInput.min = 0;
//                     valorInput.value = parceiro.valor_venda;

//                     let removerParceiroBtn = document.createElement("button");
//                     removerParceiroBtn.textContent = "❌";
//                     removerParceiroBtn.onclick = function () {
//                         parceiroItem.remove();
//                     };

//                     parceiroItem.appendChild(parceiroNome);
//                     // parceiroItem.appendChild(subtipoSelect);
//                     parceiroItem.appendChild(valorInput);
//                     parceiroItem.appendChild(removerParceiroBtn);

//                     parceirosContainer.appendChild(parceiroItem);
//                     dropdownParceiros.remove();
//                 });

//                 dropdownParceiros.appendChild(option);
//             });

//             parceirosContainer.appendChild(dropdownParceiros);
//         })
//         .catch(error => console.error("Erro ao buscar parceiros:", error));
// }

// document.addEventListener("click", function(event) {
//     if (!event.target.closest(".dropdown-parceiros")) {
//         document.getElementById("dropdown-item").style.display = "none";
//     }
// });

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

        fetch(`/buscar_pacotes/?q=${query}`)
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
                        atualizarSubtotal(produtosContainer, subtotalElement);
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

    fetch(`/buscar_produtos_por_pacote/?pacote_nome=${encodeURIComponent(pacote.nome)}`)
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
            atualizarSubtotal(produtosContainer, subtotalElement);
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
            atualizarSubtotal(produtosContainer, subtotalElement);
        });

        atualizarSubtotal(produtosContainer, subtotalElement);
}

// document.addEventListener("DOMContentLoaded", function () {
//     const inputPacote = document.getElementById("pacote");
//     const dropdown = document.getElementById("sugestoes-pacotes");
//     const listaPacotes = document.getElementById("pacotes-list");

//     inputPacote.addEventListener("input", function () {
//         const query = inputPacote.value.trim();
//         if (query.length < 1) {
//             dropdown.innerHTML = "";
//             dropdown.style.display = "none";
//             return;
//         }

//         fetch(`/buscar_pacotes/?q=${query}`)
//             .then(response => response.json())
//             .then(data => {
//                 dropdown.innerHTML = "";
//                 if (data.length === 0) {
//                     dropdown.style.display = "none";
//                     return;
//                 }

//                 data.forEach(pacote => {
//                     let option = document.createElement("div");
//                     option.textContent = pacote.nome;
//                     option.classList.add("dropdown-item");

//                     option.addEventListener("click", function () {
//                         inputPacote.value = pacote.nome;
//                         dropdown.style.display = "none";
//                     });

//                     dropdown.appendChild(option);
//                 });

//                 dropdown.style.display = "block";
//             })
//             .catch(error => console.error("Erro ao buscar pacotes:", error));
//     });

//     document.addEventListener("click", function (event) {
//         if (!inputPacote.contains(event.target) && !dropdown.contains(event.target)) {
//             dropdown.style.display = "none";
//         }
//     });

//     window.adicionarPacote = function () {
//         const nomePacote = inputPacote.value.trim();
    
//         if (!nomePacote) {
//             alert("Selecione um pacote válido.");
//             return;
//         }
    
//         let pacoteDiv = document.createElement("div");
//         pacoteDiv.classList.add("pacote-card");
    
//         let titulo = document.createElement("h5");
//         titulo.textContent = nomePacote;
    
//         let produtosContainer = document.createElement("div");
//         produtosContainer.classList.add("produtos-container");
    
//         // Buscar produtos associados ao pacote
//         fetch(`/buscar_produtos_por_pacote/?pacote_nome=${encodeURIComponent(nomePacote)}`)
//             .then(response => response.json())
//             .then(produtos => {
//                 if (produtos.length === 0) {
//                     let emptyMessage = document.createElement("p");
//                     emptyMessage.textContent = "Nenhum produto associado.";
//                     produtosContainer.appendChild(emptyMessage);
//                 } else {
//                     produtos.forEach(proc => {
//                         let produtoItem = document.createElement("div");
//                         produtoItem.classList.add("produto-item");
//                         produtoItem.textContent = proc.nome;
//                         produtosContainer.appendChild(produtoItem);
//                     });
//                 }
//             })
//             .catch(error => console.error("Erro ao buscar produtos do pacote:", error));
    
//         let parceirosPacoteContainer = document.createElement("div");
//         parceirosPacoteContainer.classList.add("parceirosPacote-container");
    
//         let adicionarParceiroPacoteBtn = document.createElement("button");
//         adicionarParceiroPacoteBtn.textContent = "Adicionar Parceiro";
//         adicionarParceiroPacoteBtn.onclick = function () {
//             adicionarParceiroPacote(parceirosPacoteContainer);
//         };
    
//         let removerPacoteBtn = document.createElement("button");
//         removerPacoteBtn.textContent = "❌ Remover Pacote";
//         removerPacoteBtn.onclick = function () {
//             pacoteDiv.remove();
//         };
    
//         pacoteDiv.appendChild(titulo);
//         pacoteDiv.appendChild(produtosContainer);
//         pacoteDiv.appendChild(parceirosPacoteContainer);
//         pacoteDiv.appendChild(adicionarParceiroPacoteBtn);
//         pacoteDiv.appendChild(removerPacoteBtn);
    
//         listaPacotes.appendChild(pacoteDiv);
    
//         inputPacote.value = "";
//     };
// });

// document.addEventListener("click", function(event) {
//     if (!event.target.closest(".filter-pacote")) {
//         document.getElementById("sugestoes-pacotes").style.display = "none";
//     }
// });

// // =================================================== PARCEIROS POR PACOTE
// function adicionarParceiroPacote(parceirosPacoteContainer) {
//     fetch(`/buscar_parceiros/`) // Remove o parâmetro de busca, retorna todos os parceiros
//         .then(response => response.json())
//         .then(data => {
//             let dropdownParceiros = document.createElement("div");
//             dropdownParceiros.classList.add("dropdown-parceiros");

//             if (!data || data.length === 0) {
//                 alert("Nenhum parceiro disponível.");
//                 return;
//             }

//             // Criar opções de parceiros
//             data.forEach(parceiro => {
//                 let option = document.createElement("div");
//                 option.textContent = parceiro.nome;
//                 option.classList.add("dropdown-item");

//                 option.addEventListener("click", function () {
//                     let parceiroItem = document.createElement("div");
//                     parceiroItem.classList.add("parceiro-item");

//                     let parceiroNome = document.createElement("span");
//                     parceiroNome.textContent = parceiro.nome;

//                     // Input de valor
//                     let valorInput = document.createElement("input");
//                     valorInput.type = "number";
//                     valorInput.placeholder = "Valor R$";
//                     valorInput.step = 0.01;
//                     valorInput.min = 0;
//                     valorInput.value = parceiro.valor_venda || ""; // Evita undefined

//                     let removerParceiroBtn = document.createElement("button");
//                     removerParceiroBtn.textContent = "❌";
//                     removerParceiroBtn.onclick = function () {
//                         parceiroItem.remove();
//                     };

//                     parceiroItem.appendChild(parceiroNome);
//                     parceiroItem.appendChild(valorInput);
//                     parceiroItem.appendChild(removerParceiroBtn);

//                     parceirosPacoteContainer.appendChild(parceiroItem);
//                     dropdownParceiros.remove(); // Fecha dropdown ao selecionar
//                 });

//                 dropdownParceiros.appendChild(option);
//             });

//             // Remover dropdown existente antes de adicionar um novo
//             let oldDropdown = document.querySelector(".dropdown-parceiros");
//             if (oldDropdown) {
//                 oldDropdown.remove();
//             }

//             parceirosPacoteContainer.appendChild(dropdownParceiros);
//         })
//         .catch(error => console.error("Erro ao buscar parceiros:", error));

//     // Fechar dropdown ao clicar fora
//     document.addEventListener("click", function (event) {
//         if (!parceirosPacoteContainer.contains(event.target)) {
//             let dropdown = document.querySelector(".dropdown-parceiros");
//             if (dropdown) {
//                 dropdown.remove();
//             }
//         }
//     }, { once: true }); // Para remover o event listener após um clique
// }

// --------------------------------------------- PROCEDIMENTOS -------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const inputProcedimentos = document.getElementById("procedimentos");
    const procedimentosSpecialtyDiv = document.getElementById("procedimentos-specialty");
    const dropdown = document.getElementById("sugestoes-procedimentos");
    const listaProcedimentos = document.getElementById("procedimentos-list");

    const specialtySelect = document.getElementById("specialty-select");
    // specialtySelect.id = "specialty-select";
    // specialtySelect.innerHTML = `<option value="">Especialidade</option>`;
    // procedimentosSpecialtyDiv.appendChild(specialtySelect);

    // buscarEspecialidades(specialtySelect);

    inputProcedimentos.addEventListener("input", function () {
        buscarProcedimentos(dropdown, inputProcedimentos, specialtySelect.value);
    });

    inputProcedimentos.addEventListener("focus", function () {
        buscarProcedimentos(dropdown, inputProcedimentos, specialtySelect.value);
    });

    specialtySelect.addEventListener("change", function () {
        buscarProcedimentos(dropdown, inputProcedimentos, specialtySelect.value);
    });

    document.addEventListener("click", function (event) {
        if (!inputProcedimentos.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = "none";
        }
    });

    window.adicionarProcedimentos = function () {
        const nome = inputProcedimentos.value.trim();
        const idProcedimento = inputProcedimentos.getAttribute("data-id");

        if (!nome || !idProcedimento) {
            alert("Selecione um procedimento válido.");
            return;
        }

        let listaProcedimentos = document.getElementById("procedimentos-list");

        let procedimentoItem = document.createElement("li");
        procedimentoItem.classList.add("procedimento-item");

        let titulo = document.createElement("span");
        titulo.textContent = nome;

        let removerBtn = document.createElement("button");
        removerBtn.textContent = "❌";
        removerBtn.onclick = function () {
            procedimentoItem.remove();
        };

        procedimentoItem.appendChild(titulo);
        procedimentoItem.appendChild(removerBtn);

        listaProcedimentos.appendChild(procedimentoItem);

        inputProcedimentos.value = "";
        inputProcedimentos.removeAttribute("data-id");
    };
});

document.addEventListener("click", function(event) {
    if (!event.target.closest(".filter-procedimentos")) {
        document.getElementById("sugestoes-procedimentos").style.display = "none";
    }
});

// ------------------------------------------ MODAL CONFIG -----------------------------------------------------
function abrirModal() {
    document.getElementById("modal-configuracao").style.display = "block";
}

function fecharModal() {
    document.getElementById("modal-configuracao").style.display = "none";
}

function aplicarValores() {
    const produtosContainer = document.querySelector('.produtos-container');
    const subTotalElement = document.querySelector('.subtotal');

    const comissao = document.getElementById("comissao").value;
    const brindes = document.getElementById("brindes").value;
    const impostos = document.getElementById("impostos").value;
    const cartoes = document.getElementById("cartoes").value;
    const margemLucro = document.getElementById("margem_lucro").value;

    // console.log(`Comissão: ${comissao}%`);
    // console.log(`Brindes: ${brindes}%`);
    // console.log(`Impostos: ${impostos}%`);
    // console.log(`Cartões: ${cartoes}%`);
    // console.log(`Margem de Lucro: ${margemLucro}%`);

    const parceiroCards = document.querySelectorAll(".parceiro-card");

    parceiroCards.forEach(function(parceiroCard) {
        const produtoItems = parceiroCard.querySelectorAll(".produto-item");
        const subTotalElement = parceiroCard.querySelector('.subtotal');
        const produtosContainer = parceiroCard.querySelector('.produtos-container');

        produtoItems.forEach(function(produto) {
            const input = produto.querySelector('input');
            const alertaElemento = produto.querySelector('.alert-margem');
            const tooltip = produto.querySelector('.tooltip');

            let valor_particular = parseFloat(produto.getAttribute('data-valor-particular'));
            let valor_repasse = parseFloat(produto.getAttribute('data-valor-repasse'));

            let custo_comissao = valor_repasse * parseFloat(comissao) / 100;
            let custo_brindes = valor_repasse * parseFloat(brindes) / 100;
            let custo_impostos = valor_repasse * parseFloat(impostos) / 100; 
            let custo_cartoes = valor_repasse * parseFloat(cartoes) / 100;

            let custo_total = valor_repasse + custo_comissao + custo_brindes + custo_impostos + custo_cartoes;

            if(custo_total >= valor_particular){
                let margem_lucro_maxima = (valor_particular - custo_total) * 100 / valor_particular;
                // let custo_maximo_por_valor = (valor_particular - valor_repasse) / 4 / valor_particular;

                if (alertaElemento) {
                    alertaElemento.textContent = '🛑';

                    if (tooltip) {
                        tooltip.textContent = `Custos excedem o valor máximo!\nMargem de lucro disponível de ${margem_lucro_maxima.toFixed(2)}%\nFoi aplicado custos de 0%.`;
                    }
                } else {
                    let alertElement = document.createElement('i');
                    alertElement.textContent = '🛑';
                    alertElement.classList.add('alert-margem');
                    produto.insertBefore(alertElement, produto.firstChild);

                    if (!tooltip) {
                        const alertaElemento = produto.querySelector('.alert-margem');
                        const nextSibling = alertaElemento.nextElementSibling;

                        let tooltipElement = document.createElement('div');
                        tooltipElement.classList.add('tooltip');
                        tooltipElement.textContent = `Custos excedem o valor máximo!\nMargem de lucro disponível de ${margem_lucro_maxima.toFixed(2)}%\nFoi aplicado custos de 0%.`;
                        produto.insertBefore(tooltipElement, nextSibling);
                    }
                }

                produto.setAttribute("comissao", 0);
                produto.setAttribute("brindes", 0);
                produto.setAttribute("impostos", 0);
                produto.setAttribute("cartoes", 0);
                produto.setAttribute("margem_lucro", 0);

                input.value = valor_repasse.toFixed(2);
            } else {
                let margem_lucro_maxima = (valor_particular - custo_total) * 100 / valor_particular;
    
                if(margemLucro > margem_lucro_maxima){
                    if (alertaElemento) {
                        alertaElemento.textContent = '⚠️';
    
                        if (tooltip) {
                            tooltip.textContent = `A margem de lucro definida (${margemLucro}%) é maior do que a margem máxima permitida (${margem_lucro_maxima.toFixed(2)}%).\nFoi utilizada a margem máxima disponível.`;
                        }
                    } else {
                        let alertElement = document.createElement('i');
                        alertElement.textContent = '⚠️';
                        alertElement.classList.add('alert-margem');
                        produto.insertBefore(alertElement, produto.firstChild);

                        if (!tooltip) {
                            const alertaElemento = produto.querySelector('.alert-margem');
                            const nextSibling = alertaElemento.nextElementSibling;

                            let tooltipElement = document.createElement('div');
                            tooltipElement.classList.add('tooltip');
                            tooltipElement.textContent = `A margem de lucro definida (${margemLucro}%) é maior do que a margem máxima permitida (${margem_lucro_maxima.toFixed(2)}%).\nFoi utilizada a margem máxima disponível.`;
                            produto.insertBefore(tooltipElement, nextSibling);
                        }
                    }

                    input.value = (custo_total + (valor_repasse * margem_lucro_maxima / 100)).toFixed(2);

                    produto.setAttribute("margem_lucro", margem_lucro_maxima);
                } else {
                    if (alertaElemento) {
                        alertaElemento.remove();
                    }

                    if (tooltip) {
                        tooltip.remove();
                    }

                    input.value = (custo_total + (valor_repasse * margemLucro / 100)).toFixed(2);
                    produto.setAttribute("margem_lucro", margemLucro);
                }

                produto.setAttribute("comissao", comissao);
                produto.setAttribute("brindes", brindes);
                produto.setAttribute("impostos", impostos);
                produto.setAttribute("cartoes", cartoes);
            }
        });
        
        atualizarSubtotal(produtosContainer, subTotalElement);
    });
    
    fecharModal();
}
// -------------------------------------------------------------------------------------------------------------

function abrirModalTabela() {
    document.getElementById("modal-tabela").style.display = "flex";
    preencherTabela();
}

function fecharModalTabela() {
    document.getElementById("modal-tabela").style.display = "none";
}

function preencherTabela() {
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
                <td>${produto.comissao}%</td>
                <td>${produto.brindes}%</td>
                <td>${produto.impostos}%</td>
                <td>${produto.cartoes}%</td>
                <td>${produto.margem_lucro}%</td>
            `;
            tbody.appendChild(tr);
        });

    });
}