const canvas = document.getElementById("ctiro");
const btnLanzar = document.getElementById("btnLanzar");
const btnIniciar = document.getElementById("btnIniciar");
const contador = document.getElementById("cronometro");
const resultado = document.getElementById("resultado");
const rebote_sound = new Audio('rebote.mp3');

canvas.width = 800;
canvas.height = 400;
const ctx = canvas.getContext("2d");

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

let cronometro;
let xo, yo;
let animationFrameId;

function dibujarEscenario() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas antes de dibujar el nuevo escenario

    xo = getRandomXO(200, 750);

    if (!inicializado) {
        yo = 370; // Si no se ha presionado, establecer la posición del objetivo en el eje y a 350
    } else {
        yo = getRandomXO(30, 370); // Si se ha presionado, establecer la posición del objetivo en el eje y a una posición aleatoria
    }

    const xop = 5;
    const yop = 340;

    dibujarP(xop, yop, 50, 50, "green"); // Dibujar objeto a lanzar
    dibujarO(xo, yo); // Dibujar objetivo
}

let xp, yp;

function lanzar() {
    if (!cronometro) {
        cronometro = new Crono(contador);
        cronometro.start();
    }

    const angulo = document.getElementById("anguloSlider").value;
    const velocidad = document.getElementById("velocidadSlider").value;

    const xop = 5;
    const yop = 340;
    xp = xop;
    yp = yop;

    const radianes = angulo * Math.PI / 180;
    let velocidadX = Math.cos(radianes) * velocidad;
    let velocidadY = Math.sin(radianes) * velocidad;

    function animate() {
        const radioObjetivo = 50; // Radio del objetivo
        
        const proyectilX = xp + 25; // Posición x del proyectil considerando el borde derecho
        const proyectilY = yp + 25; // Posición y del proyectil considerando el borde inferior
        
        const objetivoX = xo; // Posición x del objetivo (centro)
        const objetivoY = yo; // Posición y del objetivo (centro)
        
        const distanciaAlCuadrado = (proyectilX - objetivoX) ** 2 + (proyectilY - objetivoY) ** 2;
        const radioObjetivoAlCuadrado = radioObjetivo ** 2;
        
        if (distanciaAlCuadrado <= radioObjetivoAlCuadrado) { // Verificar si el proyectil alcanza el objetivo
            cronometro.stop();
            mostrarResultado(true);
            return;
        } else if (xp >= (canvas.width - 50) || yp >= (canvas.height - 50) || xp <= 0 || yp <= 0) { // Verificar si el proyectil sale del canvas
            cronometro.stop();
            mostrarResultado(false);
            return;
        }
    
        // Actualizar la posición horizontal (MRUH)
        xp += velocidadX / 1.5; // Incremento constante en la dirección x
    
        // Calcular la velocidad vertical (MRUV)
        velocidadY -= 9.8 / 100; // Considerando la aceleración de la gravedad (9.8 m/s^2) y el intervalo de tiempo
        
        // Actualizar la posición vertical (MRUV)
        yp -= velocidadY; // Incremento en la dirección y, teniendo en cuenta la disminución de la velocidad debido a la gravedad
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dibujarP(xp, yp, 50, 50, "red");
        dibujarO(xo, yo);
    
        animationFrameId = requestAnimationFrame(animate); // Solo una llamada a requestAnimationFrame aquí
    }
    
    animate();
}

let btnIniciarPressed = false;
let inicializado = false;

btnIniciar.onclick = () => {
    if (cronometro) {
        cronometro.stop();
        cronometro = null;
    }
    btnLanzar.disabled = false;
    contador.innerHTML = "0:0:0";
    resultado.innerHTML = "";
    xp = 5; // Restablecer la posición del proyectil
    yp = 340; // Restablecer la posición del proyectil
    velocidadY = 0;
    velocidadx = 0;
    inicializado = true;
    dibujarEscenario();
    btnIniciarPressed = true; // Marcar que se ha presionado el botón "Iniciar"
    setTimeout(() => {
        btnIniciarPressed = false; // Restablecer la marca después de un breve período
    }, 100);
    // Cancela la animación
    cancelAnimationFrame(animationFrameId);
}


btnLanzar.onclick = () => {
    lanzar();
}

function mostrarResultado(acertado) {
    if (acertado) {
        resultado.innerHTML = "¡Acertaste!";
    } else {
        resultado.innerHTML = "Fallaste el tiro...";
    }
    btnLanzar.disabled = true;
}

function dibujarP(x, y, lx, ly, color) {
    ctx.beginPath();
    ctx.rect(x, y, lx, ly);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function dibujarO(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function getRandomXO(min, max) {
    return Math.random() * (max - min) + min;
}

const anguloSlider = document.getElementById("anguloSlider");
const velocidadSlider = document.getElementById("velocidadSlider");

anguloSlider.oninput = function () {
    document.getElementById("anguloValor").innerText = this.value;
}

velocidadSlider.oninput = function () {
    document.getElementById("velocidadValor").innerText = this.value;
}

function iniciarJuego() {
    if (cronometro) {
        cronometro.stop();
        cronometro = null;
    }
    contador.innerHTML = "0:0:0";
    resultado.innerHTML = "";
    xp = 5; // Restablecer la posición del proyectil
    yp = 340; // Restablecer la posición del proyectil
    velocidadY = 0;
    velocidadx = 0;
    dibujarEscenario();
}

window.onload = iniciarJuego;
