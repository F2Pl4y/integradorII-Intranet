const evaluarTrabajador = {
    CorreoTrabajador: false,
    DniTrabajador: false,
    NomTrabajador: false,
    direccionTrabajador: false,
    PasswordTrabajador: false,
    PasswordTrabajadorRepetir: false,
    telefonoTrabajador: false,
    ArchivoImagen: false
}

window.addEventListener('load', (e)=>{
    efectoTablaController();
    trabajadorSel();
    comboCargos();
    accionBtnModal();
    efectoModalAlDesaparecer();
    evaluarCampos();
});

function trabajadorIns(){
    const registrosTrabajador = new FormData();
    registrosTrabajador.append("imagenTrabajador", $('#imagenTrabajador')[0].files[0]);
    registrosTrabajador.append("txtCorreoTrabajador", $('#txtCorreoTrabajador').val());
    registrosTrabajador.append("txtDNITrabajador", $('#txtDNITrabajador').val());
    registrosTrabajador.append("txtPassword", $('#txtPassword').val());
    registrosTrabajador.append("txtNomTrabajador", $('#txtNomTrabajador').val());
    registrosTrabajador.append("txtTelefonoTrabajador", $('#txtTelefonoTrabajador').val());
    registrosTrabajador.append("txtDireccionTrabajador", $('#txtDireccionTrabajador').val());
    registrosTrabajador.append("txtIDCargo", $('#txtIDCargo').val());
    $.ajax({
        type: "POST",
        url: `${dominio}/trabajador/ins/`,
        data: registrosTrabajador,
        contentType: false,
        processData: false,
        success: function (data) {
            mensajeValidacion(data["mensaje"], data["exito"]);
            if(data["exito"]){
                ocultarModal();
                trabajadorSel();
            }
        }
    });
}

function trabajadorUpd(){
    const registrosTrabajador = new FormData();
    registrosTrabajador.append("imagenTrabajador", $('#imagenTrabajador')[0].files[0]);
    registrosTrabajador.append("txtCorreoTrabajador", $('#txtCorreoTrabajador').val());
    registrosTrabajador.append("txtDNITrabajador", $('#txtDNITrabajador').val());
    registrosTrabajador.append("txtPassword", $('#txtPassword').val());
    registrosTrabajador.append("txtNomTrabajador", $('#txtNomTrabajador').val());
    registrosTrabajador.append("txtTelefonoTrabajador", $('#txtTelefonoTrabajador').val());
    registrosTrabajador.append("txtDireccionTrabajador", $('#txtDireccionTrabajador').val());
    registrosTrabajador.append("txtIDCargo", $('#txtIDCargo').val());
    $.ajax({
        type: "PUT",
        url: `${dominio}/trabajador/upd/${$('#txtCodTrabajador').val()}/`,
        data: registrosTrabajador,
        contentType: false,
        processData: false,
        success: function (data) {
            mensajeValidacion(data["mensaje"], data["exito"]);
            if(data["exito"]){
                ocultarModal();
                trabajadorSel();
                $('#tablaTrabajadores').empty();
                $('#resTrabajadorContent').empty();
            }
        }
    });
}

function trabajadorDel(id){
    mensajeConfirmacion('Eliminar', '¿Seguro que desea eliminar este trabajador?').then((booleano)=>{
        if(booleano){
            $.ajax({
                type: "DELETE",
                url: `${dominio}/trabajador/del/${id}/`,
                dataType: "json",
                success: function (data) {
                    mensajeValidacion(data["mensaje"], data["exito"]);
                    if(data["exito"]) trabajadorSel();
                }
            });
        }
    });
}

function trabajadorSel(idCargo = undefined) {
    const ruta = idCargo == undefined ? `${dominio}/trabajador/cargo/` : `${dominio}/trabajador/cargo/${idCategoria}/`
    $.ajax({
        type: "GET",
        url: ruta,
        dataType: "json",
        success: function (data) {
            if(data["exito"]){
                $('#tablaTrabajadores').empty();
                $('#resTrabajadorContent').empty();
                let tabla = '';
                if(window.innerWidth < 768){
                    $.each(data["resultado"], function (llave, valor) {
                        if(valor["IDCargo"] !== 1){
                            let template = '<div class="list-group elementTabla">';
                                template += '<div class="list-group-item list-group-item-action elementTablaCell">';
                                    template += '<div class="elementTablaCellGroup">';
                                        template += '<div class="nombreCampoTablaCell">DNI</div>';
                                        template += `<div class="infoCampoTablaCell">${valor["DNITrabajador"]}</div>`;
                                    template += '</div>';
                                    template += '<div class="elementTablaCellGroup">';
                                        template += '<div class="nombreCampoTablaCell">Accion</div>';
                                        template += '<div class="infoCampoTablaCell">';
                                            template += '<div class="btn-group">';
                                                template += '<button class="btn btn-primary" data-toggle="modal" data-target="#modalInsUpdTrabajador" onclick="trabajadorGet('+ valor["CodTrabajador"] +')">';
                                                    template += '<i class="bx bx-up-arrow-alt"></i>';
                                                template += '</button>';
                                                template += '<button class="btn btn-danger" onclick="trabajadorDel(' + valor["CodTrabajador"] +')">';
                                                    template += '<i class="bx bx-trash"></i>';
                                                template += '</button>';
                                            template += '</div>';
                                        template += '</div>';
                                    template += '</div>';
                                template += '</div>';
                                template += '<div class="list-group-item list-group-item-action elementTablaCell">';
                                    template += '<div class="elementTablaCellGroup">';
                                        template += '<div class="nombreCampoTablaCell">Correo</div>';
                                        template += `<div class="infoCampoTablaCell">${valor["CorreoTrabajador"]}</div>`;
                                    template += '</div>';
                                template += '</div>';
                                template += '<div class="list-group-item list-group-item-action elementTablaCell">';
                                    template += '<div class="elementTablaCellGroup">';
                                        template += '<div class="nombreCampoTablaCell">Nombre</div>';
                                        template += `<div class="infoCampoTablaCell">${valor["NomTrabajador"]}</div>`
                                    template += '</div>';
                                template += '</div>';
                                template += '<div class="list-group-item list-group-item-action elementTablaCell">';
                                    template += '<div class="elementTablaCellGroup">';
                                        template += '<div class="nombreCampoTablaCell">Telefono</div>';
                                        template += `<div class="infoCampoTablaCell">${valor["TelefonoTrabajador"]}</div>`
                                    template += '</div>';
                                template += '</div>';
                                template += '<div class="list-group-item list-group-item-action elementTablaCell">';
                                    template += '<div class="elementTablaCellGroup">';
                                        template += '<div class="nombreCampoTablaCell">Direccion</div>';
                                        template += `<div class="infoCampoTablaCell">${valor["DireccionTrabajador"]}</div>`
                                    template += '</div>';
                                template += '</div>';
                                template += '<div class="list-group-item list-group-item-action elementTablaCell">';
                                    template += '<div class="elementTablaCellGroup">';
                                        template += '<div class="nombreCampoTablaCell">Foto</div>';
                                        template += `<div class="infoCampoTablaCell">`
                                            template += `<img src="${dominio}/trabajador/foto/${valor["CodTrabajador"]}/" alt="" class="imgTrabajador">`;
                                        template += '</div>';
                                    template += '</div>';
                                template += '</div>';
                                template += '<div class="list-group-item list-group-item-action elementTablaCell">';
                                    template += '<div class="elementTablaCellGroup">';
                                        template += '<div class="nombreCampoTablaCell">Cargo</div>';
                                        template += `<div class="infoCampoTablaCell">${valor["NomCargo"]}</div>`
                                    template += '</div>';
                                template += '</div>';
                            template += '</div>'
                            tabla += template;
                        }
                    });
                    $('#resTrabajadorContent').html(tabla);
                }else{
                    $.each(data["resultado"], function (llave, valor) {
                        if(valor["IDCargo"] !== 1){
                            let template = '<tr>';
                                template += '<td>' + valor["NomTrabajador"] + '</td>';
                                template += '<td>' + valor["CorreoTrabajador"] + '</td>';
                                template += '<td>' + valor["DNITrabajador"] + '</td>';
                                template += '<td>' + valor["TelefonoTrabajador"] + '</td>';
                                template += '<td>' + valor["DireccionTrabajador"] + '</td>';
                                template += '<td>' + valor["NomCargo"] + '</td>';
                                template += '<td>';
                                    template += `<img src="${dominio}/trabajador/foto/${valor["CodTrabajador"]}/" alt="imagenPlatillo" class="imgTrabajador">`;
                                template += '</td>';
                                template += '<td class="grupoBotones">';
                                    template += '<div class="btn-group">';
                                        template += '<button class="btn btn-primary" data-toggle="modal" data-target="#modalInsUpdTrabajador" onclick="trabajadorGet('+ valor["CodTrabajador"] +')">';
                                            template += '<i class="bx bx-up-arrow-alt"></i>';
                                        template += '</button>';
                                        template += '<button class="btn btn-danger" onclick="trabajadorDel(' + valor["CodTrabajador"] +')">';
                                            template += '<i class="bx bx-trash"></i>';
                                        template += '</button>';
                                    template += '</div>';
                                template += '</td>';
                            template += '</tr>';
                            tabla += template;
                        }
                    });
                    $('#tablaTrabajadores').html(tabla);
                }
            }
        }
    });
}

function trabajadorGet(id){
    const tituloModalPlatillo = document.getElementById('tituloModalTrabajador');
    const btnInsUpdPlatillo = document.getElementById('btnInsUpdTrabajador');
    tituloModalPlatillo.innerText = 'Actualizar trabajador';
    btnInsUpdPlatillo.innerText = 'Actualizar';
    $.ajax({
        type: "GET",
        url: `${dominio}/trabajador/get/${id}/`,
        dataType: "json",
        success: function (data) {
            const txtPassword = document.getElementById('txtPassword');
            const txtPasswordRepetir = document.getElementById('txtPasswordRepetir');
            const lblPassword = document.getElementById('lblPassword');
            const lblPasswordRepetir = document.getElementById('lblPasswordRepetir');
            lblPassword.style.display = "None";
            lblPasswordRepetir.style.display = "None";
            txtPassword.style.display = "None";
            txtPasswordRepetir.style.display = "None";
            $('#txtCodTrabajador').val(data["resultado"]["CodTrabajador"]);
            $('#txtCorreoTrabajador').val(data["resultado"]["CorreoTrabajador"]);
            $('#txtNomTrabajador').val(data["resultado"]["NomTrabajador"]);
            $('#txtDireccionTrabajador').val(data["resultado"]["DireccionTrabajador"]);
            $('#txtDNITrabajador').val(data["resultado"]["DNITrabajador"]);
            $('#txtTelefonoTrabajador').val(data["resultado"]["TelefonoTrabajador"]);
            for (const clave in evaluarTrabajador) {
                evaluarTrabajador[clave] = true;
            }
        }
    });
}

function comboCargos(){
    $.ajax({
        type: "GET",
        url: `${dominio}/cargo/sel/1/`,
        dataType: "json",
        success: function (data) {
            let contenido = '';
            if(data["exito"] === true){
                $.each(data["resultado"], function (llave, valor) {
                    let template = `<option value="${valor["IDCargo"]}">`;
                    template += `${valor["NomCargo"]}`;
                    template += `</option>`;
                    contenido += template;
                });
                $('#cmbCargoFiltro').html(contenido);
                $('#txtIDCargo').html(contenido);
            }
        }
    });
}

function accionBtnModal() {
    const btnInsUpdTrabajador = document.getElementById('btnInsUpdTrabajador');
    btnInsUpdTrabajador.addEventListener('click', (e) => {
        e.preventDefault();
        if(evaluarTrabajador["CorreoTrabajador"] && evaluarTrabajador["DniTrabajador"] && evaluarTrabajador["NomTrabajador"] && evaluarTrabajador["direccionTrabajador"] && evaluarTrabajador["PasswordTrabajador"] && evaluarTrabajador["PasswordTrabajadorRepetir"] && evaluarTrabajador["telefonoTrabajador"] && evaluarTrabajador["ArchivoImagen"]){
            if ($('#txtCodTrabajador').val() === '') trabajadorIns();
            else trabajadorUpd();
        }else{
            mensajeValidacion('Existen campos que no se han completado correctamente, por favor revisar el formulario', false);
        }
    })
}

function evaluarCampos() {
    const formatosArchivo = ['image/jpeg', 'image/jpg', 'image/png']

    const txtCorreoTrabajador = document.getElementById('txtCorreoTrabajador');
    const iconoCorreoTrabajador = document.querySelector('#txtCorreoTrabajador+.icono');
    const txtPassword = document.getElementById('txtPassword');
    const iconoPassword = document.querySelector('#txtPassword+.icono');
    const txtNomTrabajador = document.getElementById('txtNomTrabajador');
    const iconoNomTrabajador = document.querySelector('#txtNomTrabajador+.icono');
    const txtDireccionTrabajador = document.getElementById('txtDireccionTrabajador');
    const iconoDireccionTrabajador = document.querySelector('#txtDireccionTrabajador+.icono');
    const txtDNITrabajador = document.getElementById('txtDNITrabajador');
    const iconoDNITrabajador = document.querySelector('#txtDNITrabajador+.icono');
    const txtPasswordRepetir = document.getElementById('txtPasswordRepetir');
    const iconoPasswordRepetir = document.querySelector('#txtPasswordRepetir+.icono');
    const txtTelefonoTrabajador = document.getElementById('txtTelefonoTrabajador');
    const iconoTelefonoTrabajador = document.querySelector('#txtTelefonoTrabajador+.icono');
    const imagenTrabajador = document.getElementById('imagenTrabajador');

    txtCorreoTrabajador.addEventListener('keyup', (e) => {
        const comprobarCorreo = expresiones["correo"].test(txtCorreoTrabajador.value);
        evaluarTrabajador["CorreoTrabajador"] = comprobarCorreo;
        inputCheck(iconoCorreoTrabajador, txtCorreoTrabajador, comprobarCorreo);
    });

    txtPassword.addEventListener('keyup', (e) => {
        const comprobarPassword = expresiones["password"].test(txtPassword.value);
        evaluarTrabajador["PasswordTrabajador"] = comprobarPassword;
        inputCheck(iconoPassword, txtPassword, comprobarPassword);
        inputCheck(iconoPasswordRepetir, txtPasswordRepetir, txtPasswordRepetir.value === txtPassword.value);
    });

    txtNomTrabajador.addEventListener('keyup', (e) => {
        const comprobarNomTrabajador = expresiones["nombreTrabajador"].test(txtNomTrabajador.value);
        evaluarTrabajador["NomTrabajador"] = comprobarNomTrabajador;
        inputCheck(iconoNomTrabajador, txtNomTrabajador, comprobarNomTrabajador);
    });

    txtDireccionTrabajador.addEventListener('keyup', (e) => {
        const comprobarDireccion = expresiones["direccion"].test(txtDireccionTrabajador.value);
        evaluarTrabajador["direccionTrabajador"] = comprobarDireccion;
        inputCheck(iconoDireccionTrabajador, txtDireccionTrabajador, comprobarDireccion);
    });

    txtDNITrabajador.addEventListener('keyup', (e) => {
        const comprobarDniTrabajador = expresiones["dni"].test(txtDNITrabajador.value);
        evaluarTrabajador["DniTrabajador"] = comprobarDniTrabajador;
        inputCheck(iconoDNITrabajador, txtDNITrabajador, comprobarDniTrabajador);
    });

    txtPasswordRepetir.addEventListener('keyup', (e) => {
        const comprobarPasswordRepetir = txtPasswordRepetir.value === txtPassword.value && txtPasswordRepetir.value !== '';
        evaluarTrabajador["PasswordTrabajadorRepetir"] = comprobarPasswordRepetir;
        inputCheck(iconoPasswordRepetir, txtPasswordRepetir, comprobarPasswordRepetir);
    });

    txtTelefonoTrabajador.addEventListener('keyup', (e) => {
        const comprobarTelefonoTrabajador = expresiones["telefono"].test(txtTelefonoTrabajador.value);
        evaluarTrabajador["telefonoTrabajador"] = comprobarTelefonoTrabajador;
        inputCheck(iconoTelefonoTrabajador, txtTelefonoTrabajador, comprobarTelefonoTrabajador);
    });

    imagenTrabajador.addEventListener('change', (e)=>{
        const archivo = e.target.files[0];
        if(archivo != undefined && archivo.size <= 5000000 && formatosArchivo.includes(archivo.type)){
            evaluarTrabajador["ArchivoImagen"] = true;
        }
    })
}

function efectoTablaController(){
    $(document).ready(function () {
        $("#inputTrabajador").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tablaTrabajadores tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });
}

function ocultarModal() {
    $('#modalInsUpdTrabajador').modal('hide');
}

function efectoModalAlDesaparecer(){
    $('#modalInsUpdTrabajador').on('hide.bs.modal', function (e) {
        const txtPassword = document.getElementById('txtPassword');
        const txtPasswordRepetir = document.getElementById('txtPasswordRepetir');
        const lblPassword = document.getElementById('lblPassword');
        const lblPasswordRepetir = document.getElementById('lblPasswordRepetir');
        lblPassword.style.display = "block";
        lblPasswordRepetir.style.display = "block";
        txtPassword.style.display = "block";
        txtPasswordRepetir.style.display = "block";
        limpiarCampoFormulario();
    });
}

function limpiarCampoFormulario() {
    $('#txtCodTrabajador').val('');

    $('#txtCorreoTrabajador').val('');
    $('#txtCorreoTrabajador').removeClass('positivo');
    $('#txtCorreoTrabajador').removeClass('negativo');
    $('#txtCorreoTrabajador+.icono').html('');
    $('#txtCorreoTrabajador+.icono').removeClass('positivo');
    $('#txtCorreoTrabajador+.icono').removeClass('negativo');

    $('#txtPassword').val('');
    $('#txtPassword').removeClass('positivo');
    $('#txtPassword').removeClass('negativo');
    $('#txtPassword+.icono').html('');
    $('#txtPassword+.icono').removeClass('positivo');
    $('#txtPassword+.icono').removeClass('negativo');

    $('#txtNomTrabajador').val('');
    $('#txtNomTrabajador').removeClass('positivo');
    $('#txtNomTrabajador').removeClass('negativo');
    $('#txtNomTrabajador+.icono').html('');
    $('#txtNomTrabajador+.icono').removeClass('positivo');
    $('#txtNomTrabajador+.icono').removeClass('negativo');

    $('#txtDireccionTrabajador').val('');
    $('#txtDireccionTrabajador').removeClass('positivo');
    $('#txtDireccionTrabajador').removeClass('negativo');
    $('#txtDireccionTrabajador+.icono').html('');
    $('#txtDireccionTrabajador+.icono').removeClass('positivo');
    $('#txtDireccionTrabajador+.icono').removeClass('negativo');

    $('#txtDNITrabajador').val('');
    $('#txtDNITrabajador').removeClass('positivo');
    $('#txtDNITrabajador').removeClass('negativo');
    $('#txtDNITrabajador+.icono').html('');
    $('#txtDNITrabajador+.icono').removeClass('positivo');
    $('#txtDNITrabajador+.icono').removeClass('negativo');

    $('#txtPasswordRepetir').val('');
    $('#txtPasswordRepetir').removeClass('positivo');
    $('#txtPasswordRepetir').removeClass('negativo');
    $('#txtPasswordRepetir+.icono').html('');
    $('#txtPasswordRepetir+.icono').removeClass('positivo');
    $('#txtPasswordRepetir+.icono').removeClass('negativo');

    $('#txtTelefonoTrabajador').val('');
    $('#txtTelefonoTrabajador').removeClass('positivo');
    $('#txtTelefonoTrabajador').removeClass('negativo');
    $('#txtTelefonoTrabajador+.icono').html('');
    $('#txtTelefonoTrabajador+.icono').removeClass('positivo');
    $('#txtTelefonoTrabajador+.icono').removeClass('negativo');

    $('#txtIDCargo option:nth(0)').attr("selected", "selected");
    $('#imagenTrabajador').val(null);
    $('#imagenTrabajador+label').html('Subir Archivo');
    for (const clave in evaluarTrabajador) {
        evaluarTrabajador[clave] = false;
    }
}