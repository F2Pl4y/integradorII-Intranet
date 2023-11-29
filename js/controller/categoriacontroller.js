const evaluarCategoria = {
    NomCategoria: false
}

window.addEventListener('load', (e) => {
    efectoModalAlDesaparecer();
    categoriaSelCargo();
    accionBtnModal();
    btnAgregarModal();
    evaluarCamposCargo();
})

function categoriaSelCargo() {
    $.ajax({
        type: "GET",
        url: `${dominio}/categoria/sel/`,
        dataType: "json",
        success: function (data) {
            $('#contentCategorias').empty();
            let contenido = '';
            if (data["exito"] === true) {
                $.each(data["resultado"], function (llave, valor) {
                    let template = `<div class="card bg-dark text-light element">`;
                    template += `<div class="card-body">${valor["NomCategoria"]}</div>`;
                    template += `<div class="btn-group">`;
                    template += `<button type='button' class='btn btn-warning btnUpdateCateg' data-toggle='modal' data-target='#modalInsUpdCategoria' onclick='categoriaGet(${valor["IDCategoria"]})'>`;
                    template += `<i class='bx bx-up-arrow-alt'></i>`;
                    template += `</button>`;
                    template += `<button type='button' class='btn btn-danger' data-id='2' onclick='categoriaDel(${valor["IDCategoria"]})'>`;
                    template += `<i class='bx bx-trash'></i>`;
                    template += `</button>`;
                    template += `</div>`;
                    template += `</div>`
                    contenido += template;
                });
                $('#contentCategorias').html(contenido);
            }
        }
    });
}

window.categoriaGet = categoriaGet;
export function categoriaGet(id) {
    const tituloModalCategoria = document.getElementById('tituloModalCategoria');
    const btnInsUpdCategoria = document.getElementById('btnInsUpdCategoria');
    tituloModalCategoria.innerText = 'Actualizar categoria';
    btnInsUpdCategoria.innerText = 'Actualizar';
    $.ajax({
        type: "GET",
        url: `${dominio}/categoria/get/${id}/`,
        dataType: "json",
        success: function (data) {
            $('#txtIdCategoria').val(data["resultado"]["IDCategoria"]);
            $('#txtNomCategoria').val(data["resultado"]["NomCategoria"]);
            evaluarCategoria["NomCategoria"] = true;
        }
    });
}

function categoriaIns() {
    const registrosCategoria = new FormData();
    registrosCategoria.append("txtNomCategoria", $('#txtNomCategoria').val());
    $.ajax({
        type: "POST",
        url: dominio + "/categoria/ins/",
        data: registrosCategoria,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (data) {
            mensajeValidacion(data["mensaje"], data["exito"]);
            console.log("valor", data["exito"]);
            if (data["exito"]) {
                ocultarModal();
                categoriaSelCargo();
                categoriaSelPlatillo();
                llenarComboCategoriaModal();
            }
        }
    });
}

function categoriaUpd() {
    const registrosCategoria = new FormData();
    registrosCategoria.append("txtNomCategoria", $('#txtNomCategoria').val());
    $.ajax({
        type: "PUT",
        url: `${dominio}/categoria/upd/${$('#txtIdCategoria').val()}/`,
        data: registrosCategoria,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (data) {
            mensajeValidacion(data["mensaje"], data["exito"]);
            if (data["exito"]) {
                ocultarModal();
                categoriaSelCargo();
            }
        }
    });
}

window.categoriaDel = categoriaDel;
export function categoriaDel(id) {
    mensajeConfirmacion('Eliminar', '¿Seguro que desea eliminar este trabajador?').then((booleano) => {
        if (booleano) {
            $.ajax({
                type: "DELETE",
                url: `${dominio}/categoria/del/${id}/`,
                dataType: "json",
                success: function (data) {
                    mensajeValidacion(data["mensaje"], data["exito"]);
                    if (data["exito"]) categoriaSelCargo();
                }
            });
        }
    });
}

/**
 * Funciones extra
 */
// function limpiarCampoFormularioCategoria() {
//     $('#txtIdCategoria').val('');
//     $('#txtNomCategoria').val('');
// }

function ocultarModal() {
    $('#modalInsUpdCategoria').modal('hide');
}

function btnAgregarModal() {
    const tituloModalCategoria = document.getElementById('tituloModalCategoria');
    const btnInsUpdCategoria = document.getElementById('btnInsUpdCategoria');
    const btnAgregar = document.getElementById('btnAgregar');
    btnAgregar.addEventListener('click', (e) => {
        tituloModalCategoria.innerText = 'Registrar categoria';
        btnInsUpdCategoria.innerText = 'Registrar';
    })
}

export function evaluarCamposCargo() {
    const txtNomCategoria = document.getElementById('txtNomCategoria');
    const iconoCategoria = document.querySelector('#txtNomCategoria+.icono');
    txtNomCategoria.addEventListener('keyup', (e) => {
        const comprobarCategoria = expresiones["nombreCategoria"].test(txtNomCategoria.value);
        evaluarCategoria["NomCategoria"] = comprobarCategoria;
        inputCheck(iconoCategoria, txtNomCategoria, comprobarCategoria);
    });
}

function efectoModalAlDesaparecer() {
    $('#modalInsUpdCategoria').on('hide.bs.modal', function (e) {
        limpiarCampoFormularioCategoria();
    });
}

export function accionBtnModal() {
    const btnInsUpdCategoria = document.getElementById('btnInsUpdCategoria');
    btnInsUpdCategoria.addEventListener('click', (e) => {
        if (evaluarCategoria["NomCategoria"]) {
            if ($('#txtIdCategoria').val() === '') categoriaIns();
            else categoriaUpd();
        } else {
            mensajeValidacion('Existen campos que no se han completado correctamente, por favor revisar el formulario', false);
        }
    })
}

function limpiarCampoFormularioCategoria() {
    $('#txtIdCategoria').val('');

    $('#txtNomCategoria').val('');
    $('#txtNomCategoria').removeClass('positivo');
    $('#txtNomCategoria').removeClass('negativo');
    $('#txtNomCategoria+.icono').html('');
    $('#txtNomCategoria+.icono').removeClass('positivo');
    $('#txtNomCategoria+.icono').removeClass('negativo');

    evaluarCategoria["NomCategoria"] = false;
}

import { dominio, expresiones, inputCheck, mensajeValidacion, mensajeConfirmacion } from '../controllerMain.js';
import { categoriaSelPlatillo, llenarComboCategoriaModal } from '../controller/platillocontroller.js';