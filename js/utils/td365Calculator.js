document.addEventListener("DOMContentLoaded", function () {
  const depositInput = document.getElementById("td365Deposit");
  const riskInput = document.getElementById("td365Risk");
  const stopLossInput = document.getElementById("td365StopLoss");
  const calcBtn = document.getElementById("td365CalcBtn");
  const resultDiv = document.getElementById("td365Result");

  if (calcBtn) {
    calcBtn.addEventListener("click", function () {
      const deposit = parseFloat(depositInput.value);
      const risk = parseFloat(riskInput.value);
      const stopLoss = parseFloat(stopLossInput.value);

      if (isNaN(deposit) || isNaN(risk) || isNaN(stopLoss) || stopLoss === 0) {
        resultDiv.innerText = "Wypełnij poprawnie wszystkie pola.";
        return;
      }

      const riskAmount = deposit * (risk / 100);
      const positionSize = riskAmount / stopLoss;
      resultDiv.innerText = `Możesz wejść ${positionSize.toFixed(
        2
      )} kontraktami.`;
    });
  }
});
