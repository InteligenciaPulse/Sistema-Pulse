let timeout = null;

function buscarPacientes() {
    clearTimeout(timeout);
    let query = document.getElementById("paciente").value;
    let dropdown = document.getElementById("sugestoes-pacientes");

    if (query.length < 1) {
        dropdown.classList.remove("show");
        return;
    }

    timeout = setTimeout(() => {
        fetch(`/buscar_pacientes/?q=${query}`)
            .then(response => response.json())
            .then(data => {
                dropdown.innerHTML = "";
                if (data.length > 0) {
                    dropdown.classList.add("show");
                    data.forEach(paciente => {
                        let div = document.createElement("div");
                        div.innerText = paciente.nome;
                        div.onclick = function () {
                            document.getElementById("paciente").value = paciente.nome;
                            dropdown.classList.remove("show");
                        };
                        dropdown.appendChild(div);
                    });
                } else {
                    dropdown.classList.remove("show");
                }
            })
            .catch(error => console.error("Erro ao buscar pacientes:", error));
    }, 100);
}

document.getElementById("paciente").addEventListener("input", buscarPacientes);

document.addEventListener("click", function(event) {
    if (!event.target.closest(".filter-section")) {
        document.getElementById("sugestoes-pacientes").classList.remove("show");
    }
});

// =========================== MODAL CRIAR PACIENTE =========================== //
function abrirModalPaciente() {
  document.getElementById("modal-paciente").style.display = "flex";
  abrirAba(null, 'dados-pessoais');
}

function fecharModalPaciente() {
  document.getElementById("modal-paciente").style.display = "none";
}

function abrirAba(evt, aba) {
  let conteudos = document.getElementsByClassName("tab-content");
  let abas = document.getElementsByClassName("tablink");

  for (let i = 0; i < conteudos.length; i++) {
      conteudos[i].classList.remove("active");
  }
  
  for (let i = 0; i < abas.length; i++) {
      abas[i].classList.remove("active");
  }

  document.getElementById(aba).classList.add("active");

  if (evt) {
      evt.currentTarget.classList.add("active");
  }
}

window.onclick = function(event) {
  let modal = document.getElementById("modal-paciente");
  if (event.target === modal) {
      modal.style.display = "none";
  }
};

document.getElementById("novo-paciente").addEventListener("click", abrirModalPaciente);

document.getElementById("form-paciente").addEventListener("submit", function(event) {
  event.preventDefault();

  let nome = document.getElementById("nome-paciente").value;
  let cpf = document.getElementById("cpf-paciente").value;
  let telefone = document.getElementById("telefone-paciente").value;

  fetch("/cadastrar_paciente/", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken()
      },
      body: JSON.stringify({
          nome: nome,
          cpf: cpf,
          telefone: telefone
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === "success") {
          alert("Paciente cadastrado com sucesso!");
          buscarPacientes();
          fecharModalPaciente();
      } else {
          alert("Erro ao cadastrar paciente: " + data.message);
      }
  })
  .catch(error => console.error("Erro:", error));
});

function getCSRFToken() {
  return document.cookie.split('; ')
      .find(row => row.startsWith('csrftoken'))
      ?.split('=')[1];
}
