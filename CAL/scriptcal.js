// Stary kod usunięty - teraz używamy DOMContentLoaded

const number = document.querySelectorAll(".number");
const operation = document.querySelectorAll(".operation");
const equal = document.querySelectorAll(".equal");
const inputText = document.querySelector(".input-text");
const clear = document.querySelector(".clear");
const del = document.querySelector(".del");
const next = document.querySelector(".next-btn");
const exit = document.querySelector(".exit");

let previousoperand = "";
let currentOperand = "";
let operationLogic = "";
let result = "";

number.forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentOperand = currentOperand + this.textContent;
    inputText.scrollTop = inputText.scrollHeight;
    inputText.textContent = currentOperand;
  });
});

clear.addEventListener("click", function () {
  inputText.textContent = "";
  currentOperand = "";
  previousoperand = "";
  operationLogic = "";
});
const operationConst = operation.forEach(function (btn) {
  btn.addEventListener("click", function () {
    previousoperand = currentOperand;
    operationLogic = this.textContent;
    currentOperand = "";
    inputText.textContent = "";
  });
});

equal.forEach(function (btn) {
  btn.addEventListener("click", function () {
    if (operationLogic === "+") {
      result = parseFloat(previousoperand) + parseFloat(currentOperand);
      inputText.textContent = result;
    } else if (operationLogic === "-") {
      result = parseFloat(previousoperand) - parseFloat(currentOperand);
      inputText.textContent = result;
    } else if (operationLogic === "*") {
      result = parseFloat(previousoperand) * parseFloat(currentOperand);
      inputText.textContent = result;
    } else if (operationLogic === "/") {
      result = parseFloat(previousoperand) / parseFloat(currentOperand);
      inputText.textContent = result;
    } else if (operationLogic === "/") {
      if (parseFloat(currentOperand) === 0)
        inputText.textContent = "you cannot divide by zero";
    }
  });
});

del.addEventListener("click", function () {
  currentOperand = currentOperand.slice(0, -1);
  inputText.textContent = currentOperand;
});

document.addEventListener("DOMContentLoaded", function () {
  // Przycisk BACK
  const btnBack = document.getElementById("back");
  if (btnBack) {
    btnBack.addEventListener("click", function () {
      const page = document.getElementById("page");
      if (page) {
        page.classList.add("side-left");
      }
      setTimeout(() => {
        window.location.href = "../pin/index.html";
      }, 500);
    });
  }

  // Przycisk NEXT
  const btnNext = document.getElementById("next");
  if (btnNext) {
    btnNext.addEventListener("click", function () {
      const page = document.getElementById("page");
      if (page) {
        page.classList.add("side-right");
      }
      setTimeout(() => {
        window.location.href = "../ind/ind.html";
      }, 500);
    });
  }
});
