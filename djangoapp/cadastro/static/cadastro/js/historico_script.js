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
