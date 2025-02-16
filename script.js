// Colores disponibles (coinciden con los IDs de los botones)
const colores = ["red", "green", "blue", "yellow"];

const tabla = document.getElementById("score-table").getElementsByTagName("tbody")[0];

// Secuencia generada por el juego
let secuenciaJuego = [];

// Secuencia ingresada por el jugador
let secuenciaJugador = [];

// Ronda actual
let ronda = 0;

// Puntaje del jugador
let puntaje = 0;


let puntajesGuardados = JSON.parse(localStorage.getItem("puntajes")) || [];

// Estado del juego (si está esperando la interacción del jugador)
let esperandoJugador = false;
function generarColorAleatorio() {
    const indice = Math.floor(Math.random() * colores.length); // Número aleatorio entre 0 y 3
    return colores[indice];
}

function agregarColorASecuencia() {
    const nuevoColor = generarColorAleatorio();
    secuenciaJuego.push(nuevoColor);
}
function reproducirSecuencia() {
    esperandoJugador = false; // Bloquear la interacción del jugador mientras se reproduce la secuencia
    let i = 0;
    const intervalo = setInterval(() => {
        const color = secuenciaJuego[i];
        iluminarBoton(color);
        i++;
        if (i >= secuenciaJuego.length) {
            clearInterval(intervalo);
            esperandoJugador = true; // Permitir la interacción del jugador después de reproducir la secuencia
        }
    }, 1000); // Intervalo de 1 segundo entre cada color
}

function iluminarBoton(color) {
    const boton = document.getElementById(color);
    boton.style.opacity = 1; // Cambiar la opacidad para simular el "brillo"
    setTimeout(() => {
        boton.style.opacity = 0.4; // Restaurar la opacidad original
    }, 500); // El botón permanece iluminado por 0.5 segundos
}
function manejarClick(color) {
    if (!esperandoJugador) return; // Si no es el turno del jugador, ignorar el clic

    iluminarBoton(color); // Iluminar el botón que el jugador presionó
    secuenciaJugador.push(color); // Agregar el color a la secuencia del jugador

    // Validar si el jugador acertó
    if (secuenciaJugador[secuenciaJugador.length - 1] !== secuenciaJuego[secuenciaJugador.length - 1]) {
        // Si el jugador se equivoca, terminar el juego
        terminarJuego();
    } else if (secuenciaJugador.length === secuenciaJuego.length) {
        // Si el jugador completó la secuencia correctamente, avanzar a la siguiente ronda
        setTimeout(() => {
            siguienteRonda();
        }, 1000); // Esperar 1 segundo antes de avanzar
    }
}

// Asignar eventos a los botones
document.getElementById("red").addEventListener("click", () => manejarClick("red"));
document.getElementById("green").addEventListener("click", () => manejarClick("green"));
document.getElementById("blue").addEventListener("click", () => manejarClick("blue"));
document.getElementById("yellow").addEventListener("click", () => manejarClick("yellow"));


function iniciarJuego() {
    secuenciaJuego = [];
    secuenciaJugador = [];
    ronda = 0;
    puntaje = -1;
    actualizarInterfaz();
    siguienteRonda();
}

function siguienteRonda() {
    ronda++;
    puntaje++;
    secuenciaJugador = []; // Reiniciar la secuencia del jugador
    agregarColorASecuencia(); // Agregar un nuevo color a la secuencia del juego
    actualizarInterfaz();
    setTimeout(() => {
        reproducirSecuencia();
    }, 1000); // Esperar 1 segundo antes de reproducir la secuencia
}

function terminarJuego() {
    alert(`¡Juego terminado! Tu puntaje fue: ${puntaje}`);
    const nombreJugador = document.getElementById("pjname").value;
    guardarPuntaje(nombreJugador,puntaje);
    mostrarTablaLideres();
    reiniciarJuego();
}

function reiniciarJuego() {
    secuenciaJuego = [];
    secuenciaJugador = [];
    ronda = 0;
    puntaje = -1;
    actualizarInterfaz();
}

function actualizarInterfaz() {
    document.getElementById("ronda").textContent = ronda;
    document.getElementById("score").textContent = puntaje;
}

document.getElementById("pjform").addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe
    const nombreJugador = document.getElementById("pjname").value;
    if (nombreJugador) {
        iniciarJuego();
    } else {
        alert("Por favor, ingresa tu nombre.");
    }
});

document.getElementById("restart").addEventListener("click", reiniciarJuego);


// Función para guardar el puntaje
function guardarPuntaje(nombreJugador, puntaje) {
    puntajesGuardados.push({ nombreJugador, puntaje }); // Guardar nombre y puntaje
    puntajesGuardados.sort((a, b) => b.puntaje - a.puntaje); // Ordenar de mayor a menor
    puntajesGuardados = puntajesGuardados.slice(0, 5); // Mantener solo los 5 mejores puntajes
    localStorage.setItem("puntajes", JSON.stringify(puntajesGuardados)); // Guardar en localStorage
}

// Función para mostrar la tabla de líderes
function mostrarTablaLideres() {
    tabla.innerHTML = ""; // Limpiar la tabla
    puntajesGuardados.forEach((jugador) => {
        const fila = tabla.insertRow();
        const celdaNombre = fila.insertCell(0);
        const celdaPuntaje = fila.insertCell(1);

        celdaNombre.textContent = jugador.nombreJugador; // Mostrar el nombre
        celdaPuntaje.textContent = jugador.puntaje; // Mostrar el puntaje
    });
}

// Mostrar la tabla de líderes al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarTablaLideres();
});
