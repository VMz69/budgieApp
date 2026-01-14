import {
  inicializarBase,
  obtenerBase,
  listarInformacionUsuario,
} from "./localstorage.js";

// =========================================================
// 1. INITIAL SETUP AND LOGIN VALIDATION (Adopted from Person B - Executes immediately)
// =========================================================

// Inicializar la base del localstorage con el nombre por defecto.
inicializarBase("basedefault");

// Obtener la base para validar la sesión.
const base = obtenerBase("basedefault");

// Guarda estado de inicio de sesion.
const sesionActiva = base.find((u) => u.logeado === true);

// Se valida que tenga sesión activa. Si no, redirige al login.
if (!sesionActiva) {
  location.href = "./login.html";
} else {
  // Show the page once session is confirmed
  document.getElementById("app-body").classList.remove("opacity-0");
}

// Obtener los datos del usuario logueado.
let datos = listarInformacionUsuario();

// Referencia al elemento contenedor de la lista de transacciones.
const lista = document.getElementById("lista-transacciones");


// =========================================================
// 2. HELPER FUNCTION: DATE FORMATTING (Adopted from Person B)
// =========================================================

// Funciona para convertir el formato de fecha a uno legible (e.g., "16 Octubre").
const convertirFecha = (fecha) => {
  const date = new Date(fecha);

  // Nombres de meses en español.
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  // Obtener día y mes.
  const dia = date.getDate();
  const mes = meses[date.getMonth()];

  const fechaConvertida = `${dia} ${mes}`;
  return fechaConvertida;
};


// =========================================================
// 3. CORE FUNCTION: DRAW TRANSACTIONS (Adopted from Person B)
// =========================================================

// Función para renderizar las transacciones en el DOM.
// Toma la base de datos, el elemento contenedor y el tipo de transacción a mostrar ("ingreso" o "egreso").
// La palabra 'export' se mantiene por si se usa en otros módulos.
export const dibujarTransacciones = (base, elemento, tipoDeTransaccion) => {
  // Limpiamos el div contenedor antes de dibujar.
  elemento.innerHTML = "";
  
  // Refrescar datos por si hay una transacción nueva (aunque 'base' ya está en el argumento).
  let datosActualizados = listarInformacionUsuario();

  // Calcular el total de ingresos para el porcentaje de gastos.
  let totalIngresos = 0;
  for (const transaccion of datosActualizados.transacciones) {
    if (transaccion.tipo === "ingreso") {
      totalIngresos += transaccion.monto;
    }
  }

  // Se recorren las transacciones del objeto.
  datosActualizados.transacciones.forEach((t) => {
    // Solo procesar si el tipo coincide con el tab activo.
    if (t.tipo !== tipoDeTransaccion) return;

    const div = document.createElement("div");
    div.className =
      "flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm";

    // Signo y color según tipo.
    const color = t.tipo === "ingreso" ? "text-green-600" : "text-red-600";
    const signo = t.tipo === "ingreso" ? "+" : "-";

    // Primera parte del HTML (Fecha y Descripción).
    div.innerHTML = `
        <div class="text-gray-700 font-medium">${convertirFecha(t.fecha)} - ${
      t.descripcion
    }</div>
      `;

    // Se decide si se va a mostrar el % de gasto (solo para egresos).
    if (tipoDeTransaccion === "egreso" && totalIngresos > 0) {
      const obtenerPorcentaje = (t.monto / totalIngresos) * 100;
      div.innerHTML += `
        <div class="${color} font-medium">${signo} ${t.monto.toFixed(
        2
      )} <span class="bg-red-400 text-white text-xs p-1 rounded-md font-normal">(${obtenerPorcentaje.toFixed(
        2
      )}%)</span></div>
      `;
    } else {
      // Formato simple para ingresos o egresos sin porcentaje.
      div.innerHTML += `
        <span class="${color} font-medium">${signo} ${t.monto.toFixed(2)}</span>
      `;
    }

    // Se inyecta el elemento al contenedor.
    elemento.appendChild(div);
  });
};


// =========================================================
// 4. DOM MANIPULATION AND EVENT LISTENERS (Combined and cleaned up)
// =========================================================

// Se ejecuta una vez que todo el DOM esté cargado (Best Practice from Person A).
window.addEventListener("DOMContentLoaded", function () {
  
  // Variable para mantener el tab activo, necesaria para la función actualizarVistaTransacciones.
  var tipoActual = "ingreso"; 

  // Referencias a los botones.
  const buttonIngresos = document.getElementById("ingresos-button");
  const buttonEgresos = document.getElementById("egresos-button");

  // Se inicializa el primer renderizado de las transacciones (Ingresos por defecto).
  dibujarTransacciones(datos, lista, tipoActual);

  // Función global para actualizar la vista desde otros módulos (Adopted from Person A).
  window.actualizarVistaTransacciones = function() {
    // Asegura que se dibuje el tipo de transacción actualmente activo.
    dibujarTransacciones(datos, lista, tipoActual);
  };

  // Event listener para el botón de Ingresos.
  buttonIngresos.addEventListener("click", function () {
    tipoActual = "ingreso"; // Actualiza el estado
    
    // Cambios de clase para el estilo de tab activo.
    buttonIngresos.classList.add("bg-slate-800", "text-white");
    buttonIngresos.classList.remove("bg-gray-200", "text-gray-700");
    buttonEgresos.classList.remove("bg-slate-800", "text-white");
    buttonEgresos.classList.add("bg-gray-200", "text-gray-700");

    // Dibuja las transacciones de ingreso.
    dibujarTransacciones(datos, lista, tipoActual);
  });

  // Event listener para el botón de Egresos.
  buttonEgresos.addEventListener("click", function () {
    tipoActual = "egreso"; // Actualiza el estado

    // Cambios de clase para el estilo de tab activo.
    buttonEgresos.classList.add("bg-slate-800", "text-white");
    buttonEgresos.classList.remove("bg-gray-200", "text-gray-700");
    buttonIngresos.classList.remove("bg-slate-800", "text-white");
    buttonIngresos.classList.add("bg-gray-200", "text-gray-700");

    // Dibuja las transacciones de egreso.
    dibujarTransacciones(datos, lista, tipoActual);
  });
});