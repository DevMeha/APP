document.getElementById('back').addEventListener('click', function () {
  const page = document.getElementById('page');
  if (page) {
    page.classList.add('side-left');
  }

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
});

const number = document.querySelectorAll('.number');
const operation = document.querySelectorAll('.operation');
const equal = document.querySelectorAll('.equal');
const inputText = document.querySelector('.input-text');
const clear = document.querySelector('.clear');

let previousoperand = '';
let currentOperand = '';
let operationLogic = '';

number.forEach(function (btn) {
  btn.addEventListener('click', function () {
    currentOperand = currentOperand + this.textContent;
    inputText.scrollTop = inputText.scrollHeight;
    inputText.textContent = currentOperand;
  });
});

clear.addEventListener('click', function () {
  inputText.textContent = '';
  currentOperand = '';
  previousoperand = '';
  operationLogic = '';
});
