document.addEventListener("DOMContentLoaded", function () {
  const exportBtn = document.getElementById("exportExcelBtn");

  exportBtn.addEventListener("click", function (event) {
      event.preventDefault();
      let params = new URLSearchParams(new FormData(document.querySelector("form")));
      window.location.href = exportBtn.href + "?" + params.toString();
  });
});

// ------------------------------------------ MODAL --------------------------------------
document.getElementById("openFilters").onclick = function() {
  document.getElementById("filterModal").style.display = "block";
};

document.querySelector(".close-btn").onclick = function() {
  document.getElementById("filterModal").style.display = "none";
};

window.onclick = function(event) {
  if (event.target == document.getElementById("filterModal")) {
      document.getElementById("filterModal").style.display = "none";
  }
};

// -------- STATUS ---------
// document.addEventListener("DOMContentLoaded", function () {
//   fetch('/buscar_status/')
//       .then(response => response.json())
//       .then(data => {
//           let statusSelect = document.getElementById("statusSelect");
//           data.status.forEach(status => {
//               let option = document.createElement("option");
//               option.value = status.id;
//               option.textContent = status.nome;
//               statusSelect.appendChild(option);
//           });
//       })
//       .catch(error => console.error("Erro ao buscar status:", error));
// });

// -------- ESPECIALIDADE ---------
// document.addEventListener("DOMContentLoaded", function () {
//   fetch('/buscar_especialidades/')
//       .then(response => response.json())
//       .then(data => {
//           let select = document.getElementById('especialidadeSelect');
//           data.forEach(item => {
//               let option = document.createElement("option");
//               option.value = item.id;
//               option.textContent = item.nome;
//               select.appendChild(option);
//           });
//       })
//       .catch(error => console.error("Erro ao buscar dados de " + selectId + ":", error));
// });

// -------- PACIENTE ---------
document.addEventListener("DOMContentLoaded", function () {
  const inputPaciente = document.getElementById("paciente");
  const dropdown = document.getElementById("sugestoes-pacientes");
  let selecionado = false;

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
                  selecionado = true;
              };
              dropdown.appendChild(div);
          });
      }).catch(error => console.error("Erro ao buscar pacientes:", error));
  });

  inputPaciente.addEventListener("click", function () {
      if (selecionado) {
          inputPaciente.value = "";
          delete inputPaciente.dataset.id;
          selecionado = false;
      }
  });

  document.addEventListener("click", function (event) {
      if (!inputPaciente.contains(event.target) && !dropdown.contains(event.target)) {
          dropdown.style.display = "none";
      }
  });
});

// -------- PARCEIRO ---------
document.addEventListener("DOMContentLoaded", function () {
  const inputParceiro = document.getElementById("parceiro");
  const dropdown = document.getElementById("sugestoes-parceiros");
  let selecionado = false;

  inputParceiro.addEventListener("input", function () {
      const query = inputParceiro.value.trim();
      
      if (query.length < 1) {
          dropdown.innerHTML = "";
          dropdown.style.display = "none";
          return;
      }

      fetch(`/buscar_parceiros/?q=${query}`)
      .then(response => response.json())
      .then(data => {
          dropdown.innerHTML = "";
          if (data.length === 0) {
              dropdown.style.display = "none";
              return;
          }

          dropdown.style.display = "block";
          data.forEach(parceiro => {
              let div = document.createElement("div");
              div.dataset.id = parceiro.id;
              div.innerText = parceiro.nome;
              div.onclick = function () {
                  inputParceiro.value = parceiro.nome;
                  inputParceiro.dataset.id = parceiro.id;
                  dropdown.style.display = "none";
                  selecionado = true;
              };
              dropdown.appendChild(div);
          });
      }).catch(error => console.error("Erro ao buscar parceiros:", error));
  });

  inputParceiro.addEventListener("click", function () {
      if (selecionado) {
          inputParceiro.value = "";
          delete inputParceiro.dataset.id;
          selecionado = false;
      }
  });

  document.addEventListener("click", function (event) {
      if (!inputParceiro.contains(event.target) && !dropdown.contains(event.target)) {
          dropdown.style.display = "none";
      }
  });
});

// -------- PROCEDIMENTO ---------
document.addEventListener("DOMContentLoaded", function () {
  const inputProcedimento = document.getElementById("procedimento");
  const dropdown = document.getElementById("sugestoes-procedimentos");
  let selecionado = false;

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

          dropdown.style.display = "block";
          data.forEach(procedimento => {
              let div = document.createElement("div");
              div.dataset.id = procedimento.id;
              div.innerText = procedimento.nome;
              div.onclick = function () {
                  inputProcedimento.value = procedimento.nome;
                  inputProcedimento.dataset.id = procedimento.id;
                  dropdown.style.display = "none";
                  selecionado = true;
              };
              dropdown.appendChild(div);
          });
      }).catch(error => console.error("Erro ao buscar procedimentos:", error));
  });

  inputProcedimento.addEventListener("click", function () {
      if (selecionado) {
          inputProcedimento.value = "";
          delete inputProcedimento.dataset.id;
          selecionado = false;
      }
  });

  document.addEventListener("click", function (event) {
      if (!inputProcedimento.contains(event.target) && !dropdown.contains(event.target)) {
          dropdown.style.display = "none";
      }
  });
});
// -------------------------------- ACOES ------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", function () {
        const orcamentoId = this.getAttribute("data-id");
        if (orcamentoId) {
            window.location.href = `/editar_orcamento/${orcamentoId}/`;
        }
    });
  });

  document.querySelectorAll(".print-btn").forEach(button => {
    button.addEventListener("click", function () {
        const orcamentoId = this.getAttribute("data-id");
        const novaAba = window.open(`/visualizar-orcamento-html/${orcamentoId}/`, "_blank");
        
        novaAba.onload = function () {
            novaAba.print();
        };
    });
  });
});
