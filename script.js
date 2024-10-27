// Clase constructora para las cabañas disponibles
class Cabaña{
    constructor(id, nombre, capacidad, precioPorNoche){
        this.id = id;
        this.nombre = nombre;
        this.capacidad = capacidad;
        this.precioPorNoche = precioPorNoche;
        this.reservas = [];
    }
}

class Reservas{
    constructor(cabañaId, entrada, salida, nombre){
        this.id = Date.now().toString();
        this.cabañaId = cabañaId;
        this.entrada = entrada;
        this.salida = salida;
        this.nombre = nombre;
    }
}

class SistemaReservas{
    constructor (){
        this.cabañas = [];
        this.cargarLocalStorage();
        this.inicializarCabañas();
        this.EventosListeners();
        this.mostrarCabañas();
    }

    inicializarCabañas(){
        if(this.cabañas.length === 0){
            this.cabañas = [
                new Cabaña(1,"El Roble",4,60000),
                new Cabaña(2, "Los Pinos", 6, 60000)
            ];
            this.guardarEnLocalStorage();
        }
    }

    EventosListeners(){
        const form= document.getElementById('formulario-reserva');
        form.addEventListener('submit', (e)=> this.manejoReserva(e));

        const hoy= new Date().toISOString().split('T')[0];
        document.getElementById('entrada').min = hoy;
        document.getElementById('salida').min = hoy;

        document.getElementById('entrada').addEventListener('change', (e)=>{
            document.getElementById('salida').min = e.target.value;
        });
    }

    mostrarCabañas(){
        const container = document.getElementById('container');
        const select = document.getElementById('select-cabana');

        container.innerHTML ='';
        select.innerHTML = '<option value="">Seleccione una cabaña</option>';

        this.cabañas.forEach(e =>{

            const cabanaCard = document.createElement('div');
            cabanaCard.className = 'cabana-card';
            cabanaCard.innerHTML = `
                <h3>${e.nombre}</h3>
                <p>Capacidad:${e.capacidad} personas</p>
                <p>Precio por noche: $${e.precioPorNoche}</p>
                <p>Reservas activas: ${e.reservas.length}</p>
            `;
            container.appendChild(cabanaCard);

            const option = document.createElement('option');
            option.value = e.id;
            option.textContent = e.nombre;
            select.appendChild(option);
        });
    }

    manejoReserva(e){
        const cabanaId = parseInt(document.getElementById('select-cabana').value);
        const entrada = document.getElementById('entrada').value;
        const salida = document.getElementById('salida').value;
        const nombre = document.getElementById('nombre').value;

        if(this.validarReserva(cabanaId, entrada, salida)){
            const cabana=this.cabañas.find(e=> e.id === cabanaId);
            const reserva = new Reservas (cabanaId, entrada, salida, nombre);
            cabana.reservas.push(reserva);

            this.guardarEnLocalStorage();
            this.mostrarCabañas();
            e.target.reset();
        }
   
    }

    validarReserva(cabanaId, entrada, salida){
        const cabana = this.cabañas.find(e=>e.id===cabanaId);

        const fechaEntrada = new Date(entrada);
        const fechaSalida = new Date(salida);

        if(fechaEntrada>= fechaSalida){
            return false
        }

        return true;
    }
    guardarEnLocalStorage(){
        localStorage.setItem('cabanaDatos',JSON.stringify(this.cabañas));
    }
    cargarLocalStorage(){
        const datos = localStorage.getItem('cabanaDatos');
        if(datos){
            this.cabañas = JSON.parse(datos)
        }
    }
}

const sistemaReserva= new SistemaReservas();