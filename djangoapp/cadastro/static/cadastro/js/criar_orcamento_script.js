let timeout = null;
    
function buscarPacientes() {
  clearTimeout(timeout);
  let query = document.getElementById("paciente").value;
  let dropdown = document.getElementById("sugestoes-pacientes");

  if (query.length < 2) {
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
  }, 300);
}

document.getElementById("paciente").addEventListener("input", buscarPacientes);

document.addEventListener("click", function(event) {
    if (!event.target.closest(".filter-section")) {
        document.getElementById("sugestoes-pacientes").style.display = "none";
    }
});