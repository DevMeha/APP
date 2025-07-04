// Czekamy aż DOM się załaduje
document.addEventListener("DOMContentLoaded", function () {
  const btnBack = document.getElementById("back-trading-side");

  if (btnBack) {
    btnBack.addEventListener("click", function () {
      // Najpierw animacja
      const page = document.getElementById("page");
      if (page) {
        page.classList.add("move");
      }

      // Potem przekierowanie po animacji
      setTimeout(() => {
        window.location.href = "../CAL/cal.html";
      }, 500);
    });
  }
});
