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

// let timeout = null;

// function buscarPacientes() {
//   clearTimeout(timeout);
//   let query = document.getElementById("paciente").value;
//   let dropdown = document.getElementById("sugestoes-pacientes");

//   if (query.length < 1) {
//     dropdown.style.display = "none";
//     return;
//   }

//   timeout = setTimeout(() => {
//     fetch(`/buscar_pacientes/?q=${query}`)
//       .then(response => response.json())
//       .then(data => {
//           dropdown.innerHTML = "";
//           if (data.length > 0) {
//               dropdown.style.display = "block";
//               data.forEach(paciente => {
//                   let div = document.createElement("div");
//                   div.innerText = paciente.nome;
//                   div.onclick = function () {
//                       document.getElementById("paciente").value = paciente.nome;
//                       dropdown.style.display = "none";
//                   };
//                   dropdown.appendChild(div);
//               });
//           } else {
//               dropdown.style.display = "none";
//           }
//       })
//       .catch(error => console.error("Erro ao buscar pacientes:", error));
//   }, 50);
// }

// document.getElementById("paciente").addEventListener("input", buscarPacientes);

document.addEventListener("click", function(event) {
    if (!event.target.closest(".filter-paciente")) {
        document.getElementById("sugestoes-pacientes").style.display = "none";
    }
});

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
            adicionarParceiro(parceirosContainer);
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

    function adicionarParceiro(container) {
        fetch("/buscar_parceiros/")
            .then(response => response.json())
            .then(data => {
                let dropdownParceiros = document.createElement("div");
                dropdownParceiros.classList.add("dropdown-parceiros");

                data.forEach(parceiro => {
                    let option = document.createElement("div");
                    option.textContent = parceiro.nome;
                    option.classList.add("dropdown-item");

                    option.addEventListener("click", function () {
                        let parceiroItem = document.createElement("div");
                        parceiroItem.classList.add("parceiro-item");

                        let parceiroNome = document.createElement("span");
                        parceiroNome.textContent = parceiro.nome;

                        let valorInput = document.createElement("input");
                        valorInput.type = "number";
                        valorInput.placeholder = "Valor R$";
                        valorInput.step = 0.01;
                        valorInput.min = 0;

                        let removerParceiroBtn = document.createElement("button");
                        removerParceiroBtn.textContent = "❌";
                        removerParceiroBtn.onclick = function () {
                            parceiroItem.remove();
                        };

                        parceiroItem.appendChild(parceiroNome);
                        parceiroItem.appendChild(valorInput);
                        parceiroItem.appendChild(removerParceiroBtn);

                        container.appendChild(parceiroItem);
                        dropdownParceiros.remove();
                    });

                    dropdownParceiros.appendChild(option);
                });

                container.appendChild(dropdownParceiros);
            })
            .catch(error => console.error("Erro ao buscar parceiros:", error));
    }
});

document.addEventListener("click", function(event) {
    if (!event.target.closest(".filter-procedimento")) {
        document.getElementById("sugestoes-procedimentos").style.display = "none";
    }
});