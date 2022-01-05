let participantes = [];
let personajeSeleccionado = [];
let corredoresRivales = [];

class Pilot{

    constructor(nombre, velocidadMax, velocidadMin, peso, img){
        this.nombre = nombre;
        this.velocidadMax = velocidadMax;
        this.velocidadMin = velocidadMin;
        this.peso = peso
        this.vuelta = 0;
        this.velocidadActual = 0;
        this.metrosRealizados = 0;
        this.posicion = 'En salida';
        this.pasarMeta = false;
        this.img = img;
    }
    recorrido(){
        this.metrosRealizados += this.velocidadActual;
    }
    
    acelerar(){
        this.velocidadActual = parseInt(Math.random() * (this.velocidadMax - this.velocidadMin) + this.velocidadMin);
        this.recorrido();
    }

    pasarVuelta(metrosVuelta, vueltaMax){
        if (this.vuelta < vueltaMax && this.metrosRealizados >= metrosVuelta) {
                this.vuelta ++;
                this.metrosRealizados -= metrosVuelta;
        } 
        if (this.vuelta >= vueltaMax) {
            this.pasarMeta = true;
            this.velocidadActual = 'ACABADO';
            this.metrosRealizados = 500;
            return this;
        }
        return null;

    }

}

class Circuito{
    constructor(nombre, metrosVuelta, coches, vueltaMax){
        this.nombre = nombre;
        this.metrosVuelta = metrosVuelta;
        this.coches = coches;
        this.cochesFinalizados = [];
        this.vueltaMax = vueltaMax;
    }

    posicion(){
        // Ordeno array 
        this.coches = this.coches.sort((i, z) => z.vuelta - i.vuelta);
        let cochesOrdenados = [];
        for (let i = this.vueltaMax; i >= -1; i--) {
            let arrayCochesVuelta = this.coches.filter(coche => coche.vuelta == i);

            arrayCochesVuelta.sort((i, z) => z.metrosRealizados - i.metrosRealizados);

            for (let coche of arrayCochesVuelta) {
                cochesOrdenados.push(coche);
            }
        }

        this.coches = cochesOrdenados;

        for (let i = 0; i < this.coches.length; i++) {
            this.coches[i].posicion = i+1;
        }
    }

    start() {
        this.cochesFinalizados = [];
        for (let i = 0; i < this.coches.length; i++) {
            this.coches[i].acelerar();
            let cocheFinalizado = this.coches[i].pasarVuelta(this.metrosVuelta, this.vueltaMax);
            if (this.coches[i].pasarMeta) {
                this.cochesFinalizados[i] = cocheFinalizado;
            }
        }
        this.posicion();
        this.printarCarrera();

        this.finalizacionCarrera();
        
    }
    
    finalizacionCarrera () {
        if (this.cochesFinalizados.length === this.coches.length-1) {
            console.log('CARRERA FINALIZADA');
            console.log(this.cochesFinalizados);
            cambiarPantalla('pantallaPodio');
            this.pintaPodio();
        }
    }

    printarCarrera() {
        let piloto = document.getElementsByClassName('pilotoCarrera');
        let velocidad = document.getElementsByClassName('velocidad');
        let metrosParaVuelta = document.getElementsByClassName('metrosParaVuelta');
        let vuelta = document.getElementsByClassName('vuelta');
        let img = document.getElementsByClassName('imgCarrera');
        for (let i = 0; i < this.coches.length; i++) {
            piloto[i].textContent = 'Piloto: ' + this.coches[i].nombre;
            velocidad[i].innerHTML = 'Velocidad: ' + '<span class="marioNumeros">' + this.coches[i].velocidadActual + '</span>';
            metrosParaVuelta[i].innerHTML = 'Metros para dar la vuelta: \n' + '<span class="marioNumeros">' + (this.metrosVuelta - this.coches[i].metrosRealizados) + '</span>';
            vuelta[i].innerHTML = 'Vuelta: ' + '<span class="marioNumeros">' + this.coches[i].vuelta + '</span>';
            img[i].src = this.coches[i].img;
        }
    }
    // ------------------------- Funcion printar el podio -----------------------------------
    pintaPodio ()  {
        let img = document.getElementsByClassName('imgPodio');
        let piloto = document.getElementsByClassName('pilotoPodio');

        for (let i = 0; i < 3; i++) {
            piloto[i].innerHTML = this.cochesFinalizados[i].nombre;
            img[i].src = this.cochesFinalizados[i].img;
        }


    }

}

// ------------------------- Funcion para seleccionar corredores -----------------------------------

const seleccionarCorredor = (corredorSeleccionado) =>{
    if (corredoresRivales.length < 3) {
        if (personajeSeleccionado.length < 1) {
            personajeSeleccionado.push(allPlayers[corredorSeleccionado]);
            participantes.push(allPlayers[corredorSeleccionado]);

        } else {
            corredoresRivales.push(allPlayers[corredorSeleccionado]);
            participantes.push(allPlayers[corredorSeleccionado]);

            if (corredoresRivales.length == 3) {
                cambiarPantalla('pantallaLoading');

                setTimeout (() => {
                    cambiarPantalla('pantallaCarrera');
                }, 3000);

                circuito1.printarCarrera();
            }
        }

        document.getElementById(corredorSeleccionado).onclick = "";
        document.getElementById(corredorSeleccionado).className = "card personajeSeleccionado";
    }
}


//Instancio corredores
let player1 = new Pilot("Mario",70,15, "intermedio", '../img/corredores/mario.png');
let player2 = new Pilot("Luigi",70,15, "intermedio", '../img/corredores/luigi.png');
let player3 = new Pilot("Peach",80,10, "ligero", '../img/corredores/peach.png');
let player4 = new Pilot("Yoshi",80,10, "ligero", '../img/corredores/yoshi.png');
let player5 = new Pilot("Toad",90,5, "muy ligero", '../img/corredores/toad.png');
let player6 = new Pilot("Tortuga",90,5, "muy ligero", '../img/corredores/koopa.png');
let player7 = new Pilot("Bowser",60,20,"pesado", '../img/corredores/bowser.png');
let player8 = new Pilot("DK",60,20,"pesado", '../img/corredores/dk.png');


let allPlayers = {
    "1" : player1,
    "2" : player2,
    "3" : player3,
    "4" : player4,
    "5" : player5,
    "6" : player6,
    "7" : player7,
    "8" : player8
};

//Instancio circuitos
let circuito1 = new Circuito("Reino Campinyon", 500, participantes, 1);