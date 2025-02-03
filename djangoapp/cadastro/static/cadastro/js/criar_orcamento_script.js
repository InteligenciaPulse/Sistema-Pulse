let timeout = null;
    
function buscarPacientes() {
  clearTimeout(timeout);
  let query = document.getElementById("paciente").value;
  let dropdown = document.getElementById("sugestoes-pacientes");

  if (query.length < 1) {
    dropdown.style.display = "none";
    return;
  }

  timeout = setTimeout(() => {
    fetch(`/buscar_pacientes/?q=${query}`)
      .then(response => response.json())
      .then(data => {
          dropdown.innerHTML = "";
          if (data.length > 0) {
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
          } else {
              dropdown.style.display = "none";
          }
      })
      .catch(error => console.error("Erro ao buscar pacientes:", error));
  }, 50);
}

document.getElementById("paciente").addEventListener("input", buscarPacientes);

document.addEventListener("click", function(event) {
    if (!event.target.closest(".filter-section")) {
        document.getElementById("sugestoes-pacientes").style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const inputProcedimento = document.getElementById("procedimento");
    const dropdown = document.getElementById("sugestoes-procedimentos");
    const tabelaBody = document.querySelector("#procedimentos-table tbody");

    inputProcedimento.addEventListener("input", function() {
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

                    option.addEventListener("click", function() {
                        inputProcedimento.value = procedimento.nome;
                        dropdown.style.display = "none";
                    });

                    dropdown.appendChild(option);
                });

                dropdown.style.display = "block";
            })
            .catch(error => console.error("Erro ao buscar procedimentos:", error));
    });

    document.addEventListener("click", function(event) {
        if (!inputProcedimento.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = "none";
        }
    });

    window.adicionarProcedimento = function() {
        const nome = inputProcedimento.value.trim();

        if (!nome) {
            alert("Selecione um procedimento válido.");
            return;
        }

        let row = document.createElement("tr");

        let nomeTd = document.createElement("td");
        nomeTd.textContent = nome;

        let parceiroTd = document.createElement("td");
        parceiroTd.textContent = "Nenhum parceiro";
        let adicionarParceiroTd = document.createElement("td");
        let adicionarBtn = document.createElement("button");
        adicionarBtn.textContent = "➕";
        adicionarBtn.onclick = function() {
            selecionarParceiro(parceiroTd);
        };
        parceiroTd.appendChild(adicionarBtn);

        let removerTd = document.createElement("td");
        let removerBtn = document.createElement("button");
        removerBtn.textContent = "❌";
        removerBtn.onclick = function() {
            row.remove();
        };
        removerTd.appendChild(removerBtn);

        row.appendChild(nomeTd);
        row.appendChild(parceiroTd);
        row.appendChild(adicionarParceiroTd);
        row.appendChild(removerTd);

        tabelaBody.appendChild(row);

        inputProcedimento.value = "";
    };

    function selecionarParceiro(parceiroTd) {
        fetch("/buscar_parceiros/")
            .then(response => response.json())
            .then(data => {
                let dropdownParceiros = document.createElement("div");
                dropdownParceiros.classList.add("dropdown-parceiros");

                data.forEach(parceiro => {
                    let option = document.createElement("div");
                    option.textContent = parceiro.nome;
                    option.classList.add("dropdown-item");

                    option.addEventListener("click", function() {
                        parceiroTd.textContent = parceiro.nome;
                        dropdownParceiros.remove();
                    });

                    dropdownParceiros.appendChild(option);
                });

                parceiroTd.appendChild(dropdownParceiros);
            })
            .catch(error => console.error("Erro ao buscar parceiros:", error));
    }
});