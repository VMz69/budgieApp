import { inicializarBase, obtenerBase } from "./localstorage.js";

/**************************************************
 * FUNCIÓN: Muestra el loader en pantalla
 **************************************************/
function mostrarLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.remove("hidden");
  }
}

/**************************************************
 * CUANDO EL HTML YA CARGÓ
 **************************************************/
window.addEventListener("DOMContentLoaded", function () {

  /**************************************************
   * 🎥 CONFIGURACIÓN DE DEMO
   **************************************************/
  const DEMO_MODE = true; // false cuando no quieras demo
  const DEMO_SESSION_KEY = "demo_autologin_done";
  // Vive solo mientras la pestaña esté abierta

  /**************************************************
   * 🔁 RESET CONTROLADO (solo para pruebas internas)
   **************************************************/
  const RESET_DEMO = false;

  if (RESET_DEMO) {
    localStorage.removeItem("basedefault");
    sessionStorage.removeItem(DEMO_SESSION_KEY);
  }

  /**************************************************
   * 🗄️ INICIALIZAR BASE DE DATOS LOCAL
   **************************************************/
  inicializarBase("basedefault"); // crea base si no existe
  const base = obtenerBase("basedefault");

  /**************************************************
   * 🔐 VALIDAR SI HAY SESIÓN ACTIVA
   **************************************************/
  const sesionActiva = base.find(u => u.logeado === true);

  /**************************************************
   * 🔥 AUTO LOGIN DEMO (estable)
   **************************************************/
  if (DEMO_MODE && !sessionStorage.getItem(DEMO_SESSION_KEY)) {

    // Marca que esta pestaña ya ejecutó la demo
    sessionStorage.setItem(DEMO_SESSION_KEY, "true");

    // ⏳ 1) Tiempo para que se vea el login
    setTimeout(() => {

      // 🔄 2) Muestra loader
      mostrarLoader();

      // ⏳ 3) Simula proceso de login
      setTimeout(() => {

        // Si no hay sesión activa, forzamos una demo
        if (!sesionActiva && base.length > 0) {
          base[0].logeado = true; // primer usuario como demo
          localStorage.setItem("basedefault", JSON.stringify(base));
        }

        location.href = "index.html";

      }, 1200); // tiempo loader

    }, 1500); // tiempo viendo login

    return; // ⛔ corta el login manual
  }

  /**************************************************
   * 👉 SI YA HAY SESIÓN ACTIVA, ENTRAR DIRECTO
   **************************************************/
  if (sesionActiva) {
    location.href = "index.html";
    return;
  }

  /**************************************************
   * 🔐 LOGIN NORMAL (manual)
   **************************************************/
  const formLogin = document.getElementById("login");

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuarioIngresado = formLogin.usuario.value;
    const claveIngresada = formLogin.password.value;

    const encontrado = base.find(
      (u) => u.usuario === usuarioIngresado && u.clave === claveIngresada
    );

    // ❌ Campos vacíos
    if (usuarioIngresado == "" || claveIngresada == "") {
      Toastify({
        text: "Rellena todos los campos",
        className: "info",
        style: {
          background: "linear-gradient(to right, #ff416c, #ff4b2b)",
        },
      }).showToast();
      return;
    }

    // ❌ Usuario o clave incorrectos
    if (!encontrado) {
      Toastify({
        text: "Usuario o clave incorrectos",
        className: "info",
        style: {
          background: "linear-gradient(to right, #ff416c, #ff4b2b)",
        },
      }).showToast();
      return;
    }

    // ✅ Login correcto
    encontrado.logeado = true;
    localStorage.setItem("basedefault", JSON.stringify(base));
    location.href = "index.html";
  });
});

