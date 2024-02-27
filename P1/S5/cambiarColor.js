console.log("Ejecutando JS...");

const elemento = document.getElementById("elemento");
const boton = document.getElementById("boton");

boton.onclick = () => {
  console.log("Clic!");

  //-- Cambiar color

  if (elemento.style.backgroundColor == "red"){
    elemento.style.backgroundColor = "blue";
  } else {
    elemento.style.backgroundColor = "red"
  }
  //elemento.style.backgroundColor = ramdom_color();
}

function ramdom_color() {

    //calcular los valores rgb de manera aleatoria por seprado
    //combina en un único color hexadecimal valido que es rcolor

    return rcolor
}