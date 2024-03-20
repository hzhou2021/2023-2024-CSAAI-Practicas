// -- Clase cronómetro
class Crono {
    // -- Constructor. Hay que indicar el 
    // -- display donde mostrar el cronómetro
    constructor(display) {
        this.display = display;
        // -- Tiempo
        this.cent = 0; // -- Centésimas
        this.seg = 0; // -- Segundos
        this.min = 0; // -- Minutos
        this.timer = 0; // -- Temporizador asociado
    }

    // -- Método que se ejecuta cada centésima
    tic() {
        // -- Incrementar en una centésima
        this.cent += 1;
        // -- 100 centésimas hacen 1 segundo
        if (this.cent == 100) {
            this.seg += 1;
            this.cent = 0;
        }
        // -- 60 segundos hacen un minuto
        if (this.seg == 60) {
            this.min += 1;
            this.seg = 0;
        }
        // -- Mostrar el valor actual
        this.display.innerHTML = this.min + ":" + this.seg + ":" + this.cent;
    }

    // -- Arrancar el cronómetro
    start() {
        if (!this.timer) {
            // -- Lanzar el temporizador para que llame 
            // -- al método tic cada 10ms (una centésima)
            this.timer = setInterval(() => {
                this.tic();
            }, 10);
        }
    }

    // -- Parar el cronómetro
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    // -- Reset del cronómetro
    reset() {
        this.cent = 0;
        this.seg = 0;
        this.min = 0;
        this.display.innerHTML = "0:0:0";
    }
}

// -- Variables globales
let cronometro = new Crono(document.getElementById("contador"));
let claveSecreta = generarClave();
let intentos = 0;
let juegoActivo = false;

// -- Función para generar clave secreta
function generarClave() {
    let clave = "";
    for (let i = 0; i < 4; i++) {
        clave += Math.floor(Math.random() * 10);
    }
    return clave;
}

// -- Función para manejar los botones de dígitos
function pulsar(digito) {
    cronometro = obtenerCronometro();

    if (!juegoActivo) {
        juegoActivo = true;
        cronometro.start();
    }
    const claveDiv = document.getElementById("clave");
    const claveArray = claveDiv.innerHTML.split('');
    

    // Encuentra el primer dígito no adivinado
    let indice = claveArray.indexOf('*');

    // Si no hay más dígitos a adivinar, sal de la función
    if (indice === -1) {
        return;
    }

    // Comprueba si el dígito pulsado está en la clave secreta
    if (claveSecreta[indice] == digito.toString()) {
        // Si es correcto, muestra el dígito y actualiza el contador de intentos
        claveArray[indice] = digito;
        intentos++;
        claveDiv.innerHTML = claveArray.join('');

        // Si se adivinaron todos los dígitos, redirige a la página de ganador
        if (intentos == claveSecreta.length) {
            mostrarCartelGanador();

        }
    }
}

// -- Función para manejar el botón Start
function start() {
    if (!juegoActivo) {
        juegoActivo = true;
        cronometro = obtenerCronometro();
        cronometro.start();
    }
}

// -- Función para manejar el botón Stop
function stop() {
    if (juegoActivo) {
        juegoActivo = false;
        cronometro = obtenerCronometro();
        cronometro.stop();
    }
}

// -- Función para manejar el botón Reset
function reset() {
    cronometro = obtenerCronometro();
    cronometro.stop();
    cronometro.reset();
    juegoActivo = false;
    claveSecreta = generarClave();
    intentos = 0;
    document.getElementById("clave").innerHTML = "****";
}

// -- Función para obtener la instancia actual del cronómetro
function obtenerCronometro() {
    return cronometro || new Crono(document.getElementById("contador"));
}

// Función para mostrar el cartel de ganador con el código y tiempo transcurrido
function mostrarCartelGanador() {
    document.getElementById("juego").style.display = "none";
    const tiempoTranscurrido = cronometro.display.innerHTML;
    const codigo = claveSecreta;
    const mensaje = `¡Has ganado en ${tiempoTranscurrido} con el código ${codigo}!`;
    document.getElementById("ganador-mensaje").innerText = mensaje;
    document.getElementById("cartel-ganador").style.display = "block";
}

// Función para ocultar el cartel de ganador
function ocultarCartelGanador() {
    document.getElementById("cartel-ganador").style.display = "none";
}

// Función para volver a jugar
function volverAJugar() {
    document.getElementById("cartel-ganador").style.display = "none";
    document.getElementById("juego").style.display = "block";
    reset(); // Reiniciar el juego
}
