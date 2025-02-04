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

// =================================================== PARCEIRO
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

                    // Criar input de valor, preenchendo automaticamente com `valor_venda`
                    let valorInput = document.createElement("input");
                    valorInput.type = "number";
                    valorInput.placeholder = "Valor R$";
                    valorInput.step = 0.01;
                    valorInput.min = 0;
                    valorInput.value = parceiro.valor_venda; // Preenchendo com valor do banco

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

document.addEventListener("click", function(event) {
    if (!event.target.closest(".filter-procedimento")) {
        document.getElementById("sugestoes-procedimentos").style.display = "none";
    }
});