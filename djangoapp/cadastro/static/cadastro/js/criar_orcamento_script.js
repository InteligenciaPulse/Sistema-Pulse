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
                div.innerText = paciente.nome;
                div.onclick = function () {
                    document.getElementById("paciente").value = paciente.nome;
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
document.addEventListener("DOMContentLoaded", function () {
    const inputProcedimento = document.getElementById("procedimento");
    const dropdown = document.getElementById("sugestoes-procedimentos");
    const listaProcedimentos = document.getElementById("procedimentos-list");

    inputProcedimento.addEventListener("input", function () {
        const query = inputProcedimento.value.trim();
        if (query.length < 1) {
            dropdown.innerHTML = "";
            dropdown.style.display = "none";
            return;
        }

        fetch(`/buscar_procedimentos/?q=${query}`)
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

                    option.addEventListener("click", function () {
                        inputProcedimento.value = procedimento.nome;
                        dropdown.style.display = "none";
                    });

                    dropdown.appendChild(option);
                });

                dropdown.style.display = "block";
            })
            .catch(error => console.error("Erro ao buscar procedimentos:", error));
    });

    document.addEventListener("click", function (event) {
        if (!inputProcedimento.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = "none";
        }
    });

    window.adicionarProcedimento = function () {
        const nome = inputProcedimento.value.trim();

        if (!nome) {
            alert("Selecione um procedimento válido.");
            return;
        }

        let procedimentoDiv = document.createElement("div");
        procedimentoDiv.classList.add("procedimento-card");

        let titulo = document.createElement("h5");
        titulo.textContent = nome;

        let parceirosContainer = document.createElement("div");
        parceirosContainer.classList.add("parceiros-container");

        let adicionarParceiroBtn = document.createElement("button");
        adicionarParceiroBtn.textContent = "Adicionar Parceiro";

        adicionarParceiroBtn.onclick = function () {
            adicionarParceiro(parceirosContainer, titulo.textContent.trim());
        };

        let removerProcedimentoBtn = document.createElement("button");
        removerProcedimentoBtn.textContent = "❌ Remover Procedimento";
        removerProcedimentoBtn.onclick = function () {
            procedimentoDiv.remove();
        };

        procedimentoDiv.appendChild(titulo);
        procedimentoDiv.appendChild(parceirosContainer);
        procedimentoDiv.appendChild(adicionarParceiroBtn);
        procedimentoDiv.appendChild(removerProcedimentoBtn);

        listaProcedimentos.appendChild(procedimentoDiv);

        inputProcedimento.value = "";
    };
});

// document.addEventListener("click", function(event) {
//     if (!event.target.closest(".filter-procedimento")) {
//         document.getElementById("sugestoes-procedimentos").style.display = "none";
//     }
// });


// -------------------------------------PARCEIROS-------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const inputParceiro = document.getElementById("parceiro");
    const parceiroSubtypeDiv = document.getElementById("parceiro-subtype");
    const dropdown = document.getElementById("sugestoes-parceiros");
    const listaParceiros = document.getElementById("parceiros-list");

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

    function buscarParceiros(){
        const query = inputParceiro.value.trim();
        const subtipoSelecionado = subtipoSelect.value;
        
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

                    option.addEventListener("click", function () {
                        inputParceiro.value = parceiro.nome;
                        dropdown.style.display = "none";
                    });

                    dropdown.appendChild(option);
                });

                dropdown.style.display = "block";
            })
            .catch(error => console.error("Erro ao buscar parceiros:", error));
    }

    inputParceiro.addEventListener("input", buscarParceiros);
    inputParceiro.addEventListener("focus", buscarParceiros);
    subtipoSelect.addEventListener("change", buscarParceiros);

    document.addEventListener("click", function (event) {
        if (!inputParceiro.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = "none";
        }
    });

    window.adicionarParceiro = function () {
        const nome = inputParceiro.value.trim();

        if (!nome) {
            alert("Selecione um parceiro válido.");
            return;
        }

        let parceiroDiv = document.createElement("div");
        parceiroDiv.classList.add("parceiro-card");

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
            adicionarProcedimentoBy(procedimentosContainer, titulo.textContent.trim(), subtotal);
        };

        let adicionarPacoteBtn = document.createElement("button");
        adicionarPacoteBtn.textContent = "Adicionar Pacote";

        adicionarPacoteBtn.onclick = function () {
            // adicionarPacote(procedimentosContainer, titulo.textContent.trim(), subtotal);
            console.log("clique!");
        };

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
        
        // parceiroDiv.appendChild(titulo);
        parceiroDiv.appendChild(headerDiv);
        parceiroDiv.appendChild(procedimentosContainer);
        // parceiroDiv.appendChild(adicionarProcedimentoBtn);
        // parceiroDiv.appendChild(adicionarPacoteBtn);
        parceiroDiv.appendChild(buttonsDiv);
        parceiroDiv.appendChild(subtotal);

        listaParceiros.appendChild(parceiroDiv);

        inputParceiro.value = "";
    };
});

document.addEventListener("click", function(event) {
    if (!event.target.closest(".filter-parceiro")) {
        document.getElementById("sugestoes-parceiros").style.display = "none";
    }
});

// ¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬
function adicionarProcedimentoBy(procedimentosContainer, nomeParceiro, subtotalElement) {
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

// document.addEventListener("click", function(event) {
//     if (!event.target.closest(".dropdown-procedimentos")) {
//         document.getElementById("dropdown-item").style.display = "none";
//     }
// });

function atualizarSubtotal(procedimentosContainer, subtotalElement) {
    let total = 0;

    procedimentosContainer.querySelectorAll("input[type='number']").forEach(input => {
        total += parseFloat(input.value) || 0;
    });

    subtotalElement.textContent = `Subtotal: ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
}
// --------------------------------------------------------------------------------------------

// =================================================== PARCEIROS POR PROCEDIMENTO
function adicionarParceiro(parceirosContainer, nomeProcedimento) {
    fetch(`/buscar_parceiros_por_procedimento/?procedimento_nome=${encodeURIComponent(nomeProcedimento)}`)
        .then(response => response.json())
        .then(data => {
            let dropdownParceiros = document.createElement("div");
            dropdownParceiros.classList.add("dropdown-parceiros");

            if (data.length === 0) {
                alert("Nenhum parceiro disponível para este procedimento.");
                return;
            }

            data.forEach(parceiro => {
                let option = document.createElement("div");
                option.textContent = parceiro.nome;
                option.classList.add("dropdown-item");

                option.addEventListener("click", function () {
                    let parceiroItem = document.createElement("div");
                    parceiroItem.classList.add("parceiro-item");

                    let parceiroNome = document.createElement("span");
                    parceiroNome.textContent = parceiro.nome;

                    // Criar select de subtipo do parceiro
                    // let subtipoSelect = document.createElement("select");
                    // subtipoSelect.classList.add("subtipo-select");

                    // parceiro.subtipos.forEach(subtipo => {
                    //     let option = document.createElement("option");
                    //     option.value = subtipo.id;
                    //     option.textContent = subtipo.nome;
                    //     subtipoSelect.appendChild(option);
                    // });

                    let valorInput = document.createElement("input");
                    valorInput.type = "number";
                    valorInput.placeholder = "Valor R$";
                    valorInput.step = 0.01;
                    valorInput.min = 0;
                    valorInput.value = parceiro.valor_venda;

                    let removerParceiroBtn = document.createElement("button");
                    removerParceiroBtn.textContent = "❌";
                    removerParceiroBtn.onclick = function () {
                        parceiroItem.remove();
                    };

                    parceiroItem.appendChild(parceiroNome);
                    // parceiroItem.appendChild(subtipoSelect);
                    parceiroItem.appendChild(valorInput);
                    parceiroItem.appendChild(removerParceiroBtn);

                    parceirosContainer.appendChild(parceiroItem);
                    dropdownParceiros.remove();
                });

                dropdownParceiros.appendChild(option);
            });

            parceirosContainer.appendChild(dropdownParceiros);
        })
        .catch(error => console.error("Erro ao buscar parceiros:", error));
}

// document.addEventListener("click", function(event) {
//     if (!event.target.closest(".dropdown-parceiros")) {
//         document.getElementById("dropdown-item").style.display = "none";
//     }
// });

// =================================================== PACOTES
document.addEventListener("DOMContentLoaded", function () {
    const inputPacote = document.getElementById("pacote");
    const dropdown = document.getElementById("sugestoes-pacotes");
    const listaPacotes = document.getElementById("pacotes-list");

    inputPacote.addEventListener("input", function () {
        const query = inputPacote.value.trim();
        if (query.length < 1) {
            dropdown.innerHTML = "";
            dropdown.style.display = "none";
            return;
        }

        fetch(`/buscar_pacotes/?q=${query}`)
            .then(response => response.json())
            .then(data => {
                dropdown.innerHTML = "";
                if (data.length === 0) {
                    dropdown.style.display = "none";
                    return;
                }

                data.forEach(pacote => {
                    let option = document.createElement("div");
                    option.textContent = pacote.nome;
                    option.classList.add("dropdown-item");

                    option.addEventListener("click", function () {
                        inputPacote.value = pacote.nome;
                        dropdown.style.display = "none";
                    });

                    dropdown.appendChild(option);
                });

                dropdown.style.display = "block";
            })
            .catch(error => console.error("Erro ao buscar pacotes:", error));
    });

    document.addEventListener("click", function (event) {
        if (!inputPacote.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = "none";
        }
    });

    window.adicionarPacote = function () {
        const nomePacote = inputPacote.value.trim();
    
        if (!nomePacote) {
            alert("Selecione um pacote válido.");
            return;
        }
    
        let pacoteDiv = document.createElement("div");
        pacoteDiv.classList.add("pacote-card");
    
        let titulo = document.createElement("h5");
        titulo.textContent = nomePacote;
    
        let procedimentosContainer = document.createElement("div");
        procedimentosContainer.classList.add("procedimentos-container");
    
        // Buscar procedimentos associados ao pacote
        fetch(`/buscar_procedimentos_por_pacote/?pacote_nome=${encodeURIComponent(nomePacote)}`)
            .then(response => response.json())
            .then(procedimentos => {
                if (procedimentos.length === 0) {
                    let emptyMessage = document.createElement("p");
                    emptyMessage.textContent = "Nenhum procedimento associado.";
                    procedimentosContainer.appendChild(emptyMessage);
                } else {
                    procedimentos.forEach(proc => {
                        let procedimentoItem = document.createElement("div");
                        procedimentoItem.classList.add("procedimento-item");
                        procedimentoItem.textContent = proc.nome;
                        procedimentosContainer.appendChild(procedimentoItem);
                    });
                }
            })
            .catch(error => console.error("Erro ao buscar procedimentos do pacote:", error));
    
        let parceirosPacoteContainer = document.createElement("div");
        parceirosPacoteContainer.classList.add("parceirosPacote-container");
    
        let adicionarParceiroPacoteBtn = document.createElement("button");
        adicionarParceiroPacoteBtn.textContent = "Adicionar Parceiro";
        adicionarParceiroPacoteBtn.onclick = function () {
            adicionarParceiroPacote(parceirosPacoteContainer);
        };
    
        let removerPacoteBtn = document.createElement("button");
        removerPacoteBtn.textContent = "❌ Remover Pacote";
        removerPacoteBtn.onclick = function () {
            pacoteDiv.remove();
        };
    
        pacoteDiv.appendChild(titulo);
        pacoteDiv.appendChild(procedimentosContainer);
        pacoteDiv.appendChild(parceirosPacoteContainer);
        pacoteDiv.appendChild(adicionarParceiroPacoteBtn);
        pacoteDiv.appendChild(removerPacoteBtn);
    
        listaPacotes.appendChild(pacoteDiv);
    
        inputPacote.value = "";
    };
});

document.addEventListener("click", function(event) {
    if (!event.target.closest(".filter-pacote")) {
        document.getElementById("sugestoes-pacotes").style.display = "none";
    }
});

// =================================================== PARCEIROS POR PACOTE
function adicionarParceiroPacote(parceirosPacoteContainer) {
    fetch(`/buscar_parceiros/`) // Remove o parâmetro de busca, retorna todos os parceiros
        .then(response => response.json())
        .then(data => {
            let dropdownParceiros = document.createElement("div");
            dropdownParceiros.classList.add("dropdown-parceiros");

            if (!data || data.length === 0) {
                alert("Nenhum parceiro disponível.");
                return;
            }

            // Criar opções de parceiros
            data.forEach(parceiro => {
                let option = document.createElement("div");
                option.textContent = parceiro.nome;
                option.classList.add("dropdown-item");

                option.addEventListener("click", function () {
                    let parceiroItem = document.createElement("div");
                    parceiroItem.classList.add("parceiro-item");

                    let parceiroNome = document.createElement("span");
                    parceiroNome.textContent = parceiro.nome;

                    // Input de valor
                    let valorInput = document.createElement("input");
                    valorInput.type = "number";
                    valorInput.placeholder = "Valor R$";
                    valorInput.step = 0.01;
                    valorInput.min = 0;
                    valorInput.value = parceiro.valor_venda || ""; // Evita undefined

                    let removerParceiroBtn = document.createElement("button");
                    removerParceiroBtn.textContent = "❌";
                    removerParceiroBtn.onclick = function () {
                        parceiroItem.remove();
                    };

                    parceiroItem.appendChild(parceiroNome);
                    parceiroItem.appendChild(valorInput);
                    parceiroItem.appendChild(removerParceiroBtn);

                    parceirosPacoteContainer.appendChild(parceiroItem);
                    dropdownParceiros.remove(); // Fecha dropdown ao selecionar
                });

                dropdownParceiros.appendChild(option);
            });

            // Remover dropdown existente antes de adicionar um novo
            let oldDropdown = document.querySelector(".dropdown-parceiros");
            if (oldDropdown) {
                oldDropdown.remove();
            }

            parceirosPacoteContainer.appendChild(dropdownParceiros);
        })
        .catch(error => console.error("Erro ao buscar parceiros:", error));

    // Fechar dropdown ao clicar fora
    document.addEventListener("click", function (event) {
        if (!parceirosPacoteContainer.contains(event.target)) {
            let dropdown = document.querySelector(".dropdown-parceiros");
            if (dropdown) {
                dropdown.remove();
            }
        }
    }, { once: true }); // Para remover o event listener após um clique
}