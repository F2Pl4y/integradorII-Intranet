const evaluarPlatillo = {
    nombrePlatillo: false,
    imagen: false,
    precio: false
}

let idCategoriaGlobal;

window.addEventListener('load', (e) => {
    categoriaSel();
    eventoCombo();
    platilloSel();
    accionBtnModal();
    efectoBusquedaPlatillo();
    llenarComboCategoriaModal();
    efectoModalAlDesaparecer();
    evaluarCampos();
})

/**
 * Agrega un efecto de búsqueda en tiempo real para filtrar los resultados de platillos en una sección de ofertas.
 */
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

/**
 * Obtiene los platillos de una categoría específica o de todas las categorías mediante una solicitud AJAX y los muestra en una sección de ofertas.
 */
function platilloSel(idCategoria = null) {
    const url = idCategoria === null ? `${dominio}/platillo/sel/` : `${dominio}/platillo/sel/${idCategoria}`;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            idCategoriaGlobal = idCategoria;
            let contenido = '';
            if (data["exito"] === true) {
                // Si la solicitud fue exitosa, se recorren los platillos y se construye el contenido de la sección de ofertas
                $.each(data["resultado"], function (llave, valor) {
                    let template = `<div class="cardOfertas efectoCarta">`;
                    template += `<div class="front">`;
                    template += `<div class="img">`;
                    template += `<img src="${dominio}/platillo/foto/${valor["CodigoPlatillo"]}/" alt="">`;
                    template += `</div>`;
                    template += `<div class="info">`;
                    template += `<h3>${valor["NombrePlatillo"]}</h3>`;
                    template += `<div class="botones">`;
                    template += `<button type="button" class="btn btn-warning">`;
                    template += `<i class='bx bx-info-circle'></i>`;
                    template += `</button>`;
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

/**
 * Actualiza un platillo existente en el sistema mediante una solicitud AJAX.
 */
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

/**
 * Obtiene los detalles de un platillo específico mediante una solicitud AJAX y actualiza los campos del formulario.
 */
function platilloGet(id) {
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

/**
 * Inserta un nuevo platillo en el sistema mediante una solicitud AJAX.
 */
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

/**
 * Elimina un platillo existente del sistema mediante una solicitud AJAX.
 */
function platilloDel(idPlatillo) {
    $.ajax({
        type: "DELETE",
        url: `${dominio}/platillo/del/${idPlatillo}/`,
        dataType: "json",
        success: function (data) {
            platilloSel(idCategoriaGlobal);
        }
    });
}

/**
 * Realiza una solicitud AJAX para obtener las categorías y muestra las opciones en un elemento select o una lista, dependiendo del ancho de la ventana.
 */
function categoriaSel() {
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
/**
 * Realiza una solicitud AJAX para obtener las categorías y muestra las opciones en un elemento select dentro de un modal.
 */
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

/**
 * Agrega un evento al botón del modal para determinar si se debe realizar una inserción o actualización de un platillo.
 */
function accionBtnModal() {
    const btnInsUpdPlatillo = document.getElementById('btnInsUpdPlatillo');
    btnInsUpdPlatillo.addEventListener('click', (e) => {
        e.preventDefault();
        if (evaluarPlatillo["nombrePlatillo"] && evaluarPlatillo["imagen"] && evaluarPlatillo["precio"]) {
            if ($('#txtIdPlatillo').val() === '') platilloIns();
            else platilloUpd();
        } else {
            mensajeValidacion('Existen campos que no se han completado correctamente, por favor revisar el formulario', false);
        }
    })
}

function evaluarCampos() {
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
    })
}

/**
 * Agrega un evento al modal para limpiar los campos del formulario al ocultarse.
 */

function efectoModalAlDesaparecer() {
    $('#modalInsUpdPlatillo').on('hide.bs.modal', function (e) {
        limpiarCampoFormulario();
    });
}

/**
 * Limpia o actualiza el elemento select de categoría en el formulario del modal.
 */
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

/**
 * Limpia los campos del formulario en el modal.
 */
function limpiarCampoFormulario() {
    $('#txtIdPlatillo').val('');
    $('#txtNombrePlatillo').val('');
    $('#txtDescripcion').val('');
    $('#txtPrecio').val('');
    $('#imagenPlatillo').val(null);
    limpiarActualizarCombobox(true);
}

/**
 * Agrega un evento al elemento select para ejecutar la función platilloSel() cuando cambie su valor.
 */
function eventoCombo() {
    const optionCategoria = document.getElementById('optionCategoria');
    optionCategoria.addEventListener('change', (e) => {
        const id = optionCategoria.value === 'Todos' ? null : optionCategoria.value;
        platilloSel(id);
    });
}

/**
 * Oculta el modal.
 */
function ocultarModal() {
    $('#modalInsUpdPlatillo').modal('hide');
}

/**
 * Modifica el valor de la variable global "idCategoriaGlobal" con el ID de la categoría
 */
function modificarValorCategoria(idcategoria) {
    idCategoriaGlobal = idcategoria;
}

function limpiarCampoFormulario() {
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