let pagina = 1;

const cita = {
    nombre: "",
    fecha: "",
    hora: "",
    servicios: []
}

document.addEventListener("DOMContentLoaded", function(){
    iniciarApp();
})

function iniciarApp(){
    mostrarServicios();
// Resalta el DIV actual segun el tab al que se presiona
mostrarSeccion() ;
// Oculta o muestra una seccion segun el tab al que se presiona

cambiarSeccion();

// Paginacion Siguiente y Anterior
paginaSiguiente();

paginaAnterior();

// Comprueba la pagina actual para mostrar u ocultar la paginacion

botonesPaginador();

// Muestra el resumen de la cita (o mensaje de error en caso de no pasar la validacion)
mostrarResumen();

// Almacena el nombre de la cita en el objeto
nombreCita();

// Almacena la fecha de la cita en el objeto
fechaCita();

// Deshabilitar fechas anteriores 
deshabilitarFechas()

// Almacena la hora de la cita en el objeto
horaCita()

}
function mostrarSeccion() {

    // Eliminar mostrar-seccion de la seccion anterior 
    const seccionAnterior = document.querySelector(".mostrar-seccion")
    if (seccionAnterior) {
        seccionAnterior.classList.remove("mostrar-seccion");
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`)
    seccionActual.classList.add("mostrar-seccion")
    
   // Eliminar la clase de actual en el tab anterior 
   const tabAnterior = document.querySelector(".tabs .actual")
   if(tabAnterior) {
       tabAnterior.classList.remove("actual");
   }

    // Resaltar el tab actual 
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add("actual");
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll(".tabs button")
     enlaces.forEach( enlace => {
         enlace.addEventListener("click", e => {
            e.preventDefault()
           pagina = parseInt(e.target.dataset.paso);

            // LLamar la funcion de mostrar seccion 
            mostrarSeccion()
            botonesPaginador() 
         })
     })
}

async function mostrarServicios(){
try {
    const resultado = await fetch("./servicios.json")
    const db = await resultado.json();
    
    const {servicios} = db;
    // Generar el HTML
    servicios.forEach(servicio => {
        const {id, nombre, precio} = servicio

        // DOM Scripting
        // Generar Nombre de Servicio
        const nombreServicio = document.createElement("P")
        nombreServicio.textContent = nombre;
        nombreServicio.classList.add("nombre-servicio");

        // Generar el Precio del Producto
        const precioServicio = document.createElement("P");
        precioServicio.textContent = `$ ${precio}`;
        precioServicio.classList.add("precio-servicio");

        // Generar div Contenedor de Servicio
        const servicioDiv = document.createElement("DIV");
        servicioDiv.classList.add("servicio");
        servicioDiv.dataset.idServicio = id;

        // Seleccionar un servicio para la cita
        servicioDiv.onclick = seleccionarServicio;
        
        // Inyectar precio y nombre al div de servicio
        servicioDiv.appendChild(nombreServicio)
        servicioDiv.appendChild(precioServicio)
      
        // Inyectarlo en el HTML
        document.querySelector("#servicios").appendChild(servicioDiv);
    });
} catch (error) {
    console.log(error)
}
}

function seleccionarServicio(e){
    let elemento;
    // Forzar que el elemento al cual le damos click sea el DIV
    if (e.target.tagName === "P"){
        elemento = e.target.parentElement;
    }else{
        elemento = e.target;
    }

    if(elemento.classList.contains("seleccionado")){ //.contains("clase") = sirve para verificar si una clase existe
        elemento.classList.remove("seleccionado")

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id)
    }else {
        elemento.classList.add("seleccionado");

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent, // firstElementChild : selecciona el primer hijo 
            precio: elemento.firstElementChild.nextElementSibling.textContent // .nextElementSibling va a seleccionar el siguienete elemento hijo 
        }

        agregarServicio(servicioObj)
    }

}
function eliminarServicio(id) {
    const {servicios} = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id)
  
}

function agregarServicio(servicioObj) {
    const {servicios} = cita;
    cita.servicios = [...servicios, servicioObj];
    
}


function paginaSiguiente(){
    const paginaSiguiente = document.querySelector("#siguiente")
    paginaSiguiente.addEventListener("click",() => {
       pagina++
       console.log(pagina)
       botonesPaginador()
    })
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector("#anterior")
    paginaAnterior.addEventListener("click",() => {
        pagina -- ;
        console.log(pagina)
        botonesPaginador()
    })
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector("#siguiente")
    const paginaAnterior = document.querySelector("#anterior")

    if (pagina === 1) {
        paginaAnterior.classList.add("ocultar");
    } else if (pagina === 3) {
        paginaSiguiente.classList.add("ocultar");
        paginaAnterior.classList.remove("ocultar");
        mostrarResumen()
    } else {
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }

    mostrarSeccion() // Cambia la seccion que se muestra por la de la pagina 
}

function mostrarResumen() {
    // Destructuring
    const {nombre, fecha, hora, servicios} = cita;

    // Seleccionar el resumen
    const resumenDiv = document.querySelector(".contenido-resumen")

    // Limpiar HTML previo
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    // Validacion de Objeto
    if (Object.values(cita).includes("")) { // Object.Values : te muestra solamente los valores de los obj
        const noServicios= document.createElement("P")
        noServicios.textContent = "Falta informacion de Servicios, hora, fecha o nombre "
        noServicios.classList.add("invalidar-cita")

        // Agregar a resumenDiv
        resumenDiv.appendChild(noServicios);
        return;
    } 

    const headingCita = document.createElement("H3")
    headingCita.textContent = "Resumen de Cita"

            // Mostrar el Resumen
            const nombreCita = document.createElement("P");
            nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

            const fechaCita = document.createElement("P");
            fechaCita.innerHTML = `<span>fecha:</span> ${fecha}`;

            const horaCita = document.createElement("P");
            horaCita.innerHTML = `<span>hora:</span> ${hora}`;

            const servicioCita = document.createElement("DIV");
            servicioCita.classList.add("resumen-servicios");

            const headingServicios = document.createElement("H3")
            headingServicios.textContent = "Resumen de Servicios"

            servicioCita.appendChild(headingServicios);
            let cantidad = 0;

            // Iterar sobre el arreglo de servicios
            servicios.forEach(servicio => {
                const {nombre, precio} = servicio;
                const contenedorServicio = document.createElement("DIV");
                contenedorServicio.classList.add("contenedor-servicio");

                const textoServicio = document.createElement("P");
                textoServicio.textContent = nombre;

                const precioServicio = document.createElement("P");
                precioServicio.textContent = precio;
                precioServicio.classList.add("precio")
                
                const totalServicio = precio.split("$")
                cantidad += parseInt(totalServicio[1].trim());

                // Colocar texto y precio en el div
                contenedorServicio.appendChild(textoServicio);
                contenedorServicio.appendChild(precioServicio);
                servicioCita.appendChild(contenedorServicio);
                
            })

            // Agregarlo a resumenDiv
            resumenDiv.appendChild(headingCita);
            resumenDiv.appendChild(nombreCita);
            resumenDiv.appendChild(fechaCita);
            resumenDiv.appendChild(horaCita);
            resumenDiv.appendChild(servicioCita);
            const cantidadPagar = document.createElement("P")
            cantidadPagar.innerHTML = `<span>Total a Pagar:</> $${cantidad}`
            cantidadPagar.classList.add("total");
            resumenDiv.appendChild(cantidadPagar);
    
}

function nombreCita() {
    const nombreInput = document.querySelector("#nombre");

    nombreInput.addEventListener("input", e => {
        const nombreTexto = e.target.value.trim(); // trim() elimina los espacios en blanco (cuando damos a la barra espaciadora sin escribir nada)
        
        // Validar nombreTexto (tine que tener algo escrito)
        if(nombreTexto === "" || nombreTexto.length < 3 ) {
            mostrarAlerta("Nombre no valido", "error")
        } else {
            const alerta = document.querySelector(".alerta")
            if (alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
            
        }
    })
}

function mostrarAlerta(mensaje, tipo){

 //Si hay una alerta previa , no muestres mas de una 
 const alertaPrevia = document.querySelector(".alerta")
 if (alertaPrevia){
     return
 }

const alerta = document.createElement("DIV");
alerta.textContent = mensaje;
alerta.classList.add("alerta")

 if (tipo === "error") {
     alerta.classList.add("error");
 }

// Insertar alerta en el HTML
const formulario = document.querySelector(".formulario");
formulario.appendChild(alerta)

// Desaparecer la alerta despues de 3 segundos
setTimeout(() => {
    alerta.remove()
}, 3000);

}

function fechaCita() {
    const fechaInput = document.querySelector("#fecha");
    fechaInput.addEventListener("input", (e) =>{
        const dia = new Date(e.target.value).getUTCDay(); // getUTCday nos retorna los numeros de los dias del 0 al 6 (0 es domingo )
        
        if ([6, 0].includes(dia)){
            e.preventDefault()
            fechaInput.value = "";
            mostrarAlerta("No abrimos fines de semana", "error");
        } else {
            cita.fecha = fechaInput.value;
        }

    })
}

function deshabilitarFechas(){
    const inputFecha = document.querySelector("#fecha");
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    let mes = fechaAhora.getMonth() + 1;
   if (mes < 10) {
       mes = `0${mes}`
   }
    let dia = fechaAhora.getDate() + 1;
    if (dia < 10) {
        dia = `0${dia}`
    }

    fechaDeshabilitar = `${year}-${mes}-${dia}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector("#hora");
    inputHora.addEventListener("input", e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(":"); // .split divide un string, en los parentesis le pones una letra clave para que a partir de esa letra lo divida
        if (hora[0] < 9 || hora[0] > 20) {
            mostrarAlerta("Introduce un horario valido", "error");
            setTimeout(() => {
                inputHora.value = ""
            }, 2000);
        } else {
            cita.hora = horaCita;
        }
    })
}