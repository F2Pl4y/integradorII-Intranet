const evaluarPlatillo = {
    nombrePlatillo: false,
    imagen: false,
    precio: false
}

let idCategoriaGlobal;

window.addEventListener('load', (e) => {
    categoriaSelPlatillo();
    eventoCombo();
    platilloSel();
    accionBtnModal();
    efectoBusquedaPlatillo();
    llenarComboCategoriaModal();
    efectoModalAlDesaparecer();
    evaluarCamposPlatillos();
    evaluarCamposCargo();
})

function efectoBusquedaPlatillo() {
    $(document).ready(function () {
        $("#inputPlatillo").on("keyup", function () {
            let value = $(this).val().toLowerCase();
            $(".ofertas-content div.cardOfertas").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });
}
window.platilloSel = platilloSel;
export function platilloSel(idCategoria = null) {
    const url = idCategoria === null ? `${dominio}/platillo/sel/` : `${dominio}/platillo/sel/${idCategoria}`;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            idCategoriaGlobal = idCategoria;
            let contenido = '';
            if (data["exito"] === true) {
                $.each(data["resultado"], function (llave, valor) {
                    let template = `<div class="cardOfertas efectoCarta">`;
                    template += `<div class="front">`;
                    template += `<div class="img">`;
                    template += `<img src="${dominio}/platillo/foto/${valor["CodigoPlatillo"]}/" alt="">`;
                    template += `</div>`;
                    template += `<div class="info">`;
                    template += `<h3>${valor["NombrePlatillo"]}</h3>`;
                    template += `<div class="botones">`;
                    // template += `<button type="button" class="btn btn-warning">`;
                    // template += `<i class='bx bx-info-circle'></i>`;
                    // template += `</button>`;
                    template += `<button type="button" class="btn btn-success" data-toggle="modal" data-target="#modalInsUpdPlatillo" onclick="platilloGet(${valor["CodigoPlatillo"]})">`;
                    template += `<i class='bx bx-up-arrow-alt'></i>`;
                    template += `</button>`;
                    template += `<button type="button" class="btn btn-danger" onclick="platilloDel(${valor["CodigoPlatillo"]})">`;
                    template += `<i class='bx bx-trash'></i>`;
                    template += `</button>`;
                    template += `</div>`;
                    template += `</div>`;
                    template += `</div>`;
                    template += `</div>`;
                    contenido += template;
                });
            }
            $('#platilloContent').html(contenido);
        }
    });
}

function platilloUpd() {
    const registrosPlatillo = new FormData();
    registrosPlatillo.append("txtNombrePlatillo", $('#txtNombrePlatillo').val());
    registrosPlatillo.append("txtPrecio", $('#txtPrecio').val());
    registrosPlatillo.append("imagenPlatillo", $('#imagenPlatillo')[0].files[0]);
    registrosPlatillo.append("txtDescripcion", $('#txtDescripcion').val());
    registrosPlatillo.append("txtIdCategoria", $('#categoriaSelectRegisterPlatillo').val());
    $.ajax({
        type: "PUT",
        url: `${dominio}/platillo/upd/${$('#txtIdPlatillo').val()}/`,
        data: registrosPlatillo,
        dataType: 'json',
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        success: function (data) {
            mensajeValidacion(data["mensaje"], data["exito"]);
            if (data["exito"]) {
                ocultarModal();
                platilloSel(idCategoriaGlobal);
            }
        }
    });
}
window.platilloGet = platilloGet;
export function platilloGet(id) {
    const tituloModalPlatillo = document.getElementById('tituloModalPlatillo');
    const btnInsUpdPlatillo = document.getElementById('btnInsUpdPlatillo');
    tituloModalPlatillo.innerText = 'Actualizar platillo';
    btnInsUpdPlatillo.innerText = 'Actualizar';
    $.ajax({
        type: "GET",
        url: `${dominio}/platillo/get/${id}/`,
        dataType: "json",
        success: function (data) {
            $('#txtIdPlatillo').val(data["resultado"]["CodigoPlatillo"]);
            $('#txtNombrePlatillo').val(data["resultado"]["NombrePlatillo"]);
            $('#txtDescripcion').val(data["resultado"]["Descripcion"]);
            $('#txtPrecio').val(data["resultado"]["Precio"]);
            limpiarActualizarCombobox(false, data["resultado"]["IDCategoria"]);
            for (const clave in evaluarPlatillo) {
                evaluarPlatillo[clave] = true;
            }
        }
    });
}

function platilloIns() {
    const registrosPlatillo = new FormData();
    registrosPlatillo.append("txtNombrePlatillo", $('#txtNombrePlatillo').val());
    registrosPlatillo.append("txtPrecio", $('#txtPrecio').val());
    registrosPlatillo.append("imagenPlatillo", $('#imagenPlatillo')[0].files[0]);
    registrosPlatillo.append("txtDescripcion", $('#txtDescripcion').val());
    registrosPlatillo.append("txtIdCategoria", $('#categoriaSelectRegisterPlatillo').val());
    $.ajax({
        type: "POST",
        url: `${dominio}/platillo/ins/`,
        data: registrosPlatillo,
        dataType: 'json',
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        success: function (data) {
            mensajeValidacion(data["mensaje"], data["exito"]);
            if (data["exito"]) {
                ocultarModal();
                platilloSel(idCategoriaGlobal);
            }
        }
    });
}
window.platilloDel = platilloDel;
export function platilloDel(idPlatillo) {
    $.ajax({
        type: "DELETE",
        url: `${dominio}/platillo/del/${idPlatillo}/`,
        dataType: "json",
        success: function (data) {
            platilloSel(idCategoriaGlobal);
        }
    });
}

export function categoriaSelPlatillo() {
    $.ajax({
        type: "GET",
        url: `${dominio}/categoria/sel/`,
        dataType: "json",
        success: function (data) {
            let contenido = '';
            if (data["exito"] === true) {
                if (window.innerWidth < 768) {
                    contenido = '<option>Todos</option>';
                    $.each(data["resultado"], function (llave, valor) {
                        let template = `<option value="${valor["IDCategoria"]}">`;
                        template += `${valor["NomCategoria"]}`;
                        template += `</option>`;
                        contenido += template;
                    });
                    $('#optionCategoria').html(contenido);
                } else {
                    contenido = '<li><a href="#" class="btn opcionesOfertas" onclick="platilloSel()">Todos</a></li>';
                    $.each(data["resultado"], function (llave, valor) {
                        let template = `<li>`;
                        template += `<a href="#" onclick="platilloSel(${valor["IDCategoria"]})" class="btn opcionesOfertas">${valor["NomCategoria"]}</a>`;
                        template += `</li>`;
                        contenido += template;
                    });
                    $('#listaCategorias').html(contenido);
                }
            }
        }
    });
}

function llenarComboCategoriaModal() {
    $.ajax({
        type: "GET",
        url: `${dominio}/categoria/sel/`,
        dataType: "json",
        success: function (data) {
            let contenido = '';
            if (data["exito"] === true) {
                $.each(data["resultado"], function (llave, valor) {
                    let template = `<option value="${valor["IDCategoria"]}">`;
                    template += `${valor["NomCategoria"]}`;
                    template += `</option>`;
                    contenido += template;
                });
                $('#categoriaSelectRegisterPlatillo').html(contenido);
            }
        }
    });
}

function accionBtnModal() {
    if (window.location.pathname === "/pages/platillo.html") {
        const btnInsUpdPlatillo = document.getElementById('btnInsUpdPlatillo');
        btnInsUpdPlatillo.addEventListener('click', (e) => {
            e.preventDefault();
            if (evaluarPlatillo["nombrePlatillo"] && evaluarPlatillo["imagen"] && evaluarPlatillo["precio"]) {
                if ($('#txtIdPlatillo').val() === '') platilloIns();
                else platilloUpd();
            } else {
                mensajeValidacion('Existen campos que no se han completado correctamente, por favor revisar el formulario', false);
            }
        });
    }
}

function evaluarCamposPlatillos() {
    if (window.location.pathname === "/pages/platillo.html") {
        const formatosArchivo = ['image/jpeg', 'image/jpg', 'image/png']

        const txtNombrePlatillo = document.getElementById('txtNombrePlatillo');
        const iconoNombrePlatillo = document.querySelector('#txtNombrePlatillo+.icono');

        const txtPrecio = document.getElementById('txtPrecio');
        const iconoPrecio = document.querySelector('#txtPrecio+.icono');

        const imagenPlatillo = document.getElementById('imagenPlatillo');

        txtNombrePlatillo.addEventListener('keyup', (e) => {
            const comprobarNombrePlatillo = expresiones["nombrePlatillo"].test(txtNombrePlatillo.value);
            evaluarPlatillo["nombrePlatillo"] = comprobarNombrePlatillo;
            inputCheck(iconoNombrePlatillo, txtNombrePlatillo, comprobarNombrePlatillo);
        });

        txtPrecio.addEventListener('keyup', (e) => {
            const comprobarPrecio = expresiones["dinero"].test(txtPrecio.value);
            evaluarPlatillo["precio"] = comprobarPrecio;
            inputCheck(iconoPrecio, txtPrecio, comprobarPrecio);
        });

        imagenPlatillo.addEventListener('change', (e) => {
            const archivo = e.target.files[0];
            if (archivo != undefined && archivo.size <= 5000000 && formatosArchivo.includes(archivo.type)) {
                evaluarPlatillo["imagen"] = true;
            }
        });
    }
}

function efectoModalAlDesaparecer() {
    $('#modalInsUpdPlatillo').on('hide.bs.modal', function (e) {
        limpiarCampoFormularioPlatillo();
    });
}

function limpiarActualizarCombobox(boolean, idCategoria = null) {
    const categoriaOptions = document.querySelectorAll('#categoriaSelectRegisterPlatillo>option');
    const categoria = document.getElementById('categoriaSelectRegisterPlatillo');
    if (boolean) {
        for (let i = 0; i < categoriaOptions.length; i++) {
            const option = categoriaOptions[i];
            if (i === 0) {
                option.setAttribute("selected", "selected");
            } else {
                option.removeAttribute("selected");
            }
        }
    } else {
        for (let i = 0; i < categoriaOptions.length; i++) {
            const option = categoriaOptions[i];
            if (parseInt(option.value) === idCategoria) {
                option.setAttribute("selected", "selected");
                continue;
            }
            option.removeAttribute("selected");
        }
        categoriaSelectRegisterPlatillo.value = idCategoria;
    }


}

// function limpiarCampoFormularioPlatillo() {
//     $('#txtIdPlatillo').val('');
//     $('#txtNombrePlatillo').val('');
//     $('#txtDescripcion').val('');
//     $('#txtPrecio').val('');
//     $('#imagenPlatillo').val(null);
//     limpiarActualizarCombobox(true);
// }

function eventoCombo() {
    if (window.location.pathname === "/pages/platillo.html") {
        const optionCategoria = document.getElementById('optionCategoria');
        optionCategoria.addEventListener('change', (e) => {
            const id = optionCategoria.value === 'Todos' ? null : optionCategoria.value;
            platilloSel(id);
        });
    }
}

function ocultarModal() {
    $('#modalInsUpdPlatillo').modal('hide');
}

function modificarValorCategoria(idcategoria) {
    idCategoriaGlobal = idcategoria;
}

function limpiarCampoFormularioPlatillo() {
    $('#txtIdPlatillo').val('');

    $('#txtNombrePlatillo').val('');
    $('#txtNombrePlatillo').removeClass('positivo');
    $('#txtNombrePlatillo').removeClass('negativo');
    $('#txtNombrePlatillo+.icono').html('');
    $('#txtNombrePlatillo+.icono').removeClass('positivo');
    $('#txtNombrePlatillo+.icono').removeClass('negativo');

    $('#txtDescripcion').val('');

    $('#txtPrecio').val('');
    $('#txtPrecio').removeClass('positivo');
    $('#txtPrecio').removeClass('negativo');
    $('#txtPrecio+.icono').html('');
    $('#txtPrecio+.icono').removeClass('positivo');
    $('#txtPrecio+.icono').removeClass('negativo');

    $('#categoriaSelectRegisterPlatillo option:nth(0)').attr("selected", "selected");

    $('#imagenPlatillo').val(null);
    $('#imagenPlatillo+label').html('Subir Archivo');
    for (const clave in evaluarPlatillo) {
        evaluarPlatillo[clave] = false;
    }
}

import { dominio, expresiones, inputCheck, mensajeValidacion } from '../controllerMain.js';
import { evaluarCamposCargo } from '../controller/categoriacontroller.js';