document.querySelector(".call-options").addEventListener("click", function () {
  // Alterna a classe no elemento clicado
  this.classList.toggle("active");

  // Alterna a classe em outro elemento
  document.querySelector("#top-nav").classList.toggle("active");
});
