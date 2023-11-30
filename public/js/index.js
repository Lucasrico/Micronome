window.addEventListener("load", pintarLista)

bloque = document.getElementById("bloque");
let turn = false
const botones = 16;
let seleccionada = 1


let canciones = [
    {
        cancion: "arabella",
        bpm: 10
    },
    {
        cancion: "rumine",
        bpm: 120
    },
    {
        cancion: "brianstorm",
        bpm: 140
    }
];

setInterval(() => {
    turn = turn ? false : true;
    bloque.style.background = turn ? "#A2D5C6" : "#8B0000";
    console.log(seleccionada);
    console.log(canciones);
    console.log(60000 / canciones[seleccionada - 1].bpm);
}, 60000 / canciones[seleccionada - 1].bpm);

//ESTE CALCULO NO RULA  , lo he probado en el clg y tarda mas

function seleccionar(id) {
    //Cambiamos el valor de seleccionada para
    //saber a cual modificar el bpm
    seleccionada = id;
    //limpiar todas antes
    for (let i = 1; i <= botones; i++) {
        let casilla = document.getElementById(`c${i}`)
        casilla.style.background = "var(--primario)"
    }
    //pintar seleccionado
    let casilla = document.getElementById(`c${id}`);
    casilla.style.background = "var(--fondo-4)"
}

function pintarLista() {
    let lista = document.getElementById("cuadricula");
    let str = "";
    for (let h = 0; h < 4; h++) {
        str += `<div class="lista">`
        for (let i = 1; i <= 4; i++) {
            str += `<div class="select" onclick="seleccionar(${4 * h + i})" id="c${4 * h + i}"></div>`
        }
        str += `</div>`
    }
    lista.innerHTML = str;
    //otro for ahora hasta el 16 para pintar la seleccionada que esta lmacenada,
    //y par poner los titulos y bpm
    for (let i = 0; i < canciones.length; i++) {
        let casilla = document.getElementById(`c${i + 1}`);
        let str = "";
        str += canciones[i].cancion;
        str += canciones[i].bpm;
        casilla.innerHTML = str;
        console.log(str);
    }
}