document.getElementById('back').addEventListener('click', function () {
  const page = document.getElementById('page');
  if (page) {
    page.classList.add('side-left');
  }

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
});
