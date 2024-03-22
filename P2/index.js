class Crono {
    constructor(display) {
        this.display = display;
        this.cent = 0;
        this.seg = 0;
        this.min = 0;
        this.timer = 0;
    }

    tic() {
        this.cent += 1;
        if (this.cent == 100) {
            this.seg += 1;
            this.cent = 0;
        }
        if (this.seg == 60) {
            this.min += 1;
            this.seg = 0;
        }
        this.display.innerHTML = this.min + ":" + this.seg + ":" + this.cent;
    }

    start() {
        if (!this.timer) {
            this.timer = setInterval(() => {
                this.tic();
            }, 10);
        }
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    reset() {
        this.cent = 0;
        this.seg = 0;
        this.min = 0;
        this.display.innerHTML = "0:0:0";
    }
}

let cronometro = new Crono(document.getElementById("contador"));
let claveSecreta = generarClave();
let intentos = 0;
let juegoActivo = false;

function generarClave() {
    let clave = "";
    for (let i = 0; i < 4; i++) {
        clave += Math.floor(Math.random() * 10);
    }
    return clave;
}

function pulsar(digito) {
    cronometro = obtenerCronometro();

    if (!juegoActivo) {
        juegoActivo = true;
        cronometro.start();
    }

    const claveDiv = document.getElementById("clave");
    const claveArray = claveDiv.textContent.split('');

    let indice = claveArray.indexOf('*');

    if (indice === -1) {
        return;
    }

    if (claveSecreta[indice] == digito.toString()) {
        claveArray[indice] = digito;
        intentos++;

        claveDiv.textContent = '';
        
        claveArray.forEach((digito, index) => {
            const span = document.createElement('span');
            span.textContent = digito;
            if (index < intentos) { 
                span.classList.add('digito-correcto');
            }
            claveDiv.appendChild(span);
        });

        if (intentos == claveSecreta.length) {
            mostrarCartelGanador();
        }
    }
}

document.addEventListener('keydown', function(event) {
    var numero = event.key;
    
    if (numero >= '0' && numero <= '9') {
        pulsar(parseInt(numero));
    }
});


function start() {
    if (!juegoActivo) {
        juegoActivo = true;
        cronometro = obtenerCronometro();
        cronometro.start();
    }
}

function stop() {
    if (juegoActivo) {
        juegoActivo = false;
        cronometro = obtenerCronometro();
        cronometro.stop();
    }
}

function reset() {
    cronometro = obtenerCronometro();
    cronometro.stop();
    cronometro.reset();
    juegoActivo = false;
    claveSecreta = generarClave();
    intentos = 0;
    document.getElementById("clave").innerHTML = "****";
}

function obtenerCronometro() {
    return cronometro || new Crono(document.getElementById("contador"));
}

function mostrarCartelGanador() {
    document.getElementById("juego").style.display = "none";
    const tiempoTranscurrido = cronometro.display.innerHTML;
    const codigo = claveSecreta;
    const mensaje = `¡Has ganado en ${tiempoTranscurrido} con el código ${codigo}!`;
    document.getElementById("ganador-mensaje").innerText = mensaje;
    document.getElementById("cartel-ganador").style.display = "block";
}

function ocultarCartelGanador() {
    document.getElementById("cartel-ganador").style.display = "none";
}

function volverAJugar() {
    document.getElementById("cartel-ganador").style.display = "none";
    document.getElementById("juego").style.display = "block";
    reset();
}
