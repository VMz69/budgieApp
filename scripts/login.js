import { inicializarBase, obtenerBase } from "./localstorage.js";

window.addEventListener("DOMContentLoaded", function () {
  inicializarBase("basedefault");
  // inicializar localstorage para poder trabajar
  const base = obtenerBase("basedefault");
  //guarda estado de inicio de sesion
  const sesionActiva = base.find(u => u.logeado === true)

  const formLogin = document.getElementById("login");

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const usuarioIngresado = formLogin.usuario.value;
    const claveIngresada = formLogin.password.value;

    const encontrado = base.find(
      (u) => u.usuario === usuarioIngresado && u.clave === claveIngresada
    );

    if (usuarioIngresado == "" || claveIngresada == "") {
      Toastify({
        text: "Rellena todos los campos",
        className: "info",
        style: {
          background: "linear-gradient(to right, #ff416c, #ff4b2b)",
        },
      }).showToast();
    } else if (!encontrado) {
      Toastify({
        text: "Usuario o clave incorrectos",
        className: "info",
        style: {
          background: "linear-gradient(to right, #ff416c, #ff4b2b)",
        },
      }).showToast();
    }

    encontrado.logeado = true;
    localStorage.setItem("basedefault", JSON.stringify(base));

    location.href = "index.html";
  });

  // validar si hay sesion activa 

  if(sesionActiva){
    location.href = "index.html"
  }
});
