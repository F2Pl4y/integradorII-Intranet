const evaluarCargo = {
    NomCargo: false,
    Sueldo: false
}

window.addEventListener('load', (e) => {
    efectoModalDesaparecer();
    cargoSel();
    btnAgregarModal();
    evaluarCamposCargo();
    accionBtnModal();
    insPuntaje();
})


/**
 * Permite listar todos los cargos mediante la llamada al servidor
 * @param
 * @returns
 */
function cargoSel() {
    $.ajax({
        type: "GET",
        url: `${dominio}/cargo/sel/0`,
        dataType: "json",
        success: function (data) {
            if (data["exito"]) {
                let contenido = '';
                $('#contentCargo').empty();
                $.each(data["resultado"], function (llave, valor) {
                    let template = `<div class="card bg-dark text-light element">`;
                    template += `<div class="card-body">${valor["NomCargo"]}</div>`;
                    if (valor["IDCargo"] !== 1) {
                        template += `<div class="btn-group">`;
                        template += `<button type='button' class='btn btn-warning btnUpdateCateg' data-toggle='modal' data-target='#modalInsUpdCargo' onclick='cargoGet(${valor["IDCargo"]})'>`;
                        template += `<i class='bx bx-up-arrow-alt'></i>`;
                        template += `</button>`;
                        template += `<button type='button' class='btn btn-danger' data-id='2' onclick='cargoDel(${valor["IDCargo"]})'>`;
                        template += `<i class='bx bx-trash'></i>`;
                        template += `</button>`;
                        template += `</div>`;
                    }
                    template += `</div>`
                    contenido += template;
                });
                $('#contentCargo').html(contenido);
            } else {
                mensajeValidacion(data["resultado"], data["exito"]);
            }
        }
    });
}

/**
 * Permite obtener los datos de un cargo mediante su id
 * @param id - El id del cargo a buscar
 * @returns
 */
window.cargoGet = cargoGet;
export function cargoGet(id) {
    const tituloModalcargo = document.getElementById('tituloModalcargo');
    const btnInsUpdCargo = document.getElementById('btnInsUpdCargo');
    tituloModalcargo.innerText = 'Actualizar cargo';
    btnInsUpdCargo.innerText = 'Actualizar';
    $.ajax({
        type: "GET",
        url: `${dominio}/cargo/get/${id}/`,
        dataType: "json",
        success: function (data) {
            if (data["exito"]) {
                $('#txtIdCargo').val(data["resultado"]["IDCargo"]);
                $('#txtNomCargo').val(data["resultado"]["NomCargo"]);
                $('#txtSueldo').val(data["resultado"]["Sueldo"]);
                evaluarCargo["NomCargo"] = true;
                evaluarCargo["Sueldo"] = true;
            } else {
                mensajeValidacion(data["resultado"], data["exito"]);
            }
        }
    });
}

/**
 * Envia datos al servidor para registrar un cargo en específico
 * @param
 * @returns
 */
function cargoIns() {
    const registroscargo = new FormData();
    registroscargo.append("txtNomCargo", $('#txtNomCargo').val());
    registroscargo.append("txtSueldo", $('#txtSueldo').val());
    $.ajax({
        type: "POST",
        url: dominio + "/cargo/ins/",
        data: registroscargo,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (data) {
            mensajeValidacion(data["mensaje"], data["exito"]);
            if (data["exito"]) {
                ocultarModal();
                cargoSel();
                comboCargos();
            }
        }
    });

}

/**
 * Permite actualizar un cargo mediante la captura de sus datos y el id
 * @param
 * @returns
 */
function cargoUpd() {
    const registroscargo = new FormData();
    registroscargo.append("txtNomCargo", $('#txtNomCargo').val());
    registroscargo.append("txtSueldo", $('#txtSueldo').val());
    $.ajax({
        type: "PUT",
        url: `${dominio}/cargo/upd/${$('#txtIdCargo').val()}/`,
        data: registroscargo,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (data) {
            mensajeValidacion(data["mensaje"], data["exito"]);
            if (data["exito"]) {
                ocultarModal();
                cargoSel();
            }
        }
    });
}

/**
 * Permite eliminar un cargo solicitando al servidor enviando el id del cargo
 * @param id - El id del cargo a eliminar
 * @returns
 */
window.cargoDel = cargoDel;
function cargoDel(id) {
    mensajeConfirmacion('Eliminar', '¿Seguro que desea eliminar este cargo?').then((booleano) => {
        if (booleano) {
            $.ajax({
                type: "DELETE",
                url: `${dominio}/cargo/del/${id}/`,
                dataType: "json",
                success: function (data) {
                    mensajeValidacion(data["mensaje"], data["exito"]);
                    if (data["exito"]) cargoSel();
                }
            });
        }
    })
}

/**
 * Permite limpiar todos los campos del formulario del modal y reiniciar las
 * validaciones del cargo a su estado inicial
 * @param
 * @returns
 */
function limpiarCampoFormularioCargo() {
    $('#txtIdCargo').val('')
    $('#txtIdcargo').removeClass('positivo');
    $('#txtIdcargo').removeClass('negativo');
    $('#txtIdcargo+.icono').html('');
    $('#txtIdcargo+.icono').removeClass('positivo');
    $('#txtIdcargo+.icono').removeClass('negativo');

    $('#txtNomCargo').val('');
    $('#txtNomCargo').removeClass('positivo');
    $('#txtNomCargo').removeClass('negativo');
    $('#txtNomCargo+.icono').html('');
    $('#txtNomCargo+.icono').removeClass('positivo');
    $('#txtNomCargo+.icono').removeClass('negativo');

    $('#txtSueldo').val('');
    $('#txtSueldo').removeClass('positivo');
    $('#txtSueldo').removeClass('negativo');
    $('#txtSueldo+.icono').html('');
    $('#txtSueldo+.icono').removeClass('positivo');
    $('#txtSueldo+.icono').removeClass('negativo');

    for (const clave in evaluarCargo) {
        evaluarCargo[clave] = false;
    }
}

/**
 * Permite que los campos del formulario del modal se evaluen constantemente 
 * mientras se presiona una tecla en alguno de los campos
 * @param
 * @returns
 */
function evaluarCamposCargo() {
    const txtNomCargo = document.getElementById('txtNomCargo');
    const iconoNomCargo = document.querySelector('#txtNomCargo+.icono');
    const txtSueldo = document.getElementById('txtSueldo');
    const iconoSueldo = document.querySelector('#txtSueldo+.icono');
    txtNomCargo.addEventListener('keyup', (e) => {
        const comprobarCargo = expresiones["nombreCargo"].test(txtNomCargo.value);
        evaluarCargo["NomCargo"] = comprobarCargo;
        inputCheck(iconoNomCargo, txtNomCargo, comprobarCargo);
    });
    txtSueldo.addEventListener('keyup', (e) => {
        const comprobarSueldo = expresiones["dinero"].test(txtSueldo.value);
        evaluarCargo["Sueldo"] = comprobarSueldo;
        inputCheck(iconoSueldo, txtSueldo, comprobarSueldo);
    });
}

/**
 * Función que ocultará el modal cuando sea necesario
 * @param
 * @returns
 */
function ocultarModal() {
    $('#modalInsUpdCargo').modal('hide');
}

/**
 * Permite modificar el titulo y el texto del boton del modal al momento de que
 * el usuario desee insertar un nuevo cargo
 * @param
 * @returns
 */
function btnAgregarModal() {
    const tituloModalcargo = document.getElementById('tituloModalcargo');
    const btnInsUpdCargo = document.getElementById('btnInsUpdCargo');
    const btnAgregar = document.getElementById('btnAgregar');
    btnAgregar.addEventListener('click', (e) => {
        tituloModalcargo.innerText = 'Registrar cargo';
        btnInsUpdCargo.innerText = 'Registrar';
    })
}

/**
 * Permite tener un evento que al momento de que el modal desaparezca llamará un
 * método que limpiará todo el formulario
 * @param
 * @returns
 */
function efectoModalDesaparecer() {
    $('#modalInsUpdCargo').on('hide.bs.modal', function (e) {
        limpiarCampoFormularioCargo();
    });
}

/**
 * Permite definir la accion del boton del modal si insertará o actualizará un
 * cargo
 * @param
 * @returns
 */
function accionBtnModal() {
    const btnInsUpdCargo = document.getElementById('btnInsUpdCargo');
    btnInsUpdCargo.addEventListener('click', (e) => {
        if (evaluarCargo["NomCargo"] && evaluarCargo["Sueldo"]) {
            if ($('#txtIdCargo').val() === '') cargoIns();
            else cargoUpd();
        } else {
            mensajeValidacion('Existen campos que no se han completado correctamente, por favor revisar el formulario', false);
        }
    })
}



// -------- inicio de puntaje --------


function puntajeIns() {
    const registroscargo = new FormData();
    console.log("ESTO VALE: ", puntaje);
    registroscargo.append('puntaje', puntaje);
    // registroscargo.append(puntaje);
    $.ajax({
        type: "POST",
        url: dominio + "/puntaje/ins/",
        data: registroscargo,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (data) {
            mensajeValidacion(data["mensaje"], data["exito"]);
            if (data["exito"]) {
                ocultarModal();
                cargoSel();
            }
        }
    });

}

let puntaje = document.querySelectorAll(".stars i.active").length;
function insPuntaje() {
    const btnInsUpdCargo = document.getElementById('btnAgregarPuntaje');
    // Select all elements with the "i" tag and store them in a NodeList called "stars"
    const stars = document.querySelectorAll(".stars i");


    const mensajeElement = document.getElementById("mensaje");
    // Define los mensajes para cada cantidad de estrellas seleccionadas
    const mensajes = [
        "¡Terrible!",
        "¡Malo!",
        "¡Regular!",
        "¡Bueno!",
        "¡Excelente!",
        "¡Terrible!"
    ];
    // Loop through the "stars" NodeList
    stars.forEach((star, index1) => {
        // Add an event listener that runs a function when the "click" event is triggered
        star.addEventListener("click", () => {
            // Contar estrellas activas para obtener el puntaje
            // Loop through the "stars" NodeList Again
            stars.forEach((star, index2) => {
                // Add the "active" class to the clicked star and any stars with a lower index
                // and remove the "active" class from any stars with a higher index
                index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
            });
            puntaje = document.querySelectorAll(".stars i.active").length;

            // Mostrar el puntaje en console.log()
            // console.log(`Puntaje: ${puntaje}`);

            mensajeElement.textContent = mensajes[puntaje - 1];

            btnInsUpdCargo.addEventListener('click', (e) => {
                if (puntaje != 0 && puntaje != null) {
                    // if ($('#txtIdCargo').val() === '') cargoIns();
                    puntajeIns();
                    // console.log("el puntaje es: ", puntaje);
                } else {
                    console.log("no hay puntaje");
                }
            })
        });
    });
}


// -------- fin de puntaje --------
import { dominio, expresiones, inputCheck, mensajeValidacion, mensajeConfirmacion } from '../controllerMain.js';

import { comboCargos } from '../controller/trabajadorcontroller.js';