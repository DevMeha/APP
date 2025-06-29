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

number.addEventListenerAll('click', function () {
  inputText.textContent = this.textContent;
});
