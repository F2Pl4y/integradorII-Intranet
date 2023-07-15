window.addEventListener('load', (e) => {
    clienteSel();
    efectoBusquedaCliente();
})

/**
 * Obtiene los datos de los clientes del sistema mediante una solicitud AJAX y los muestra en una tabla o lista.
 */
function clienteSel() {
    $.ajax({
        type: "GET",
        url: `${dominio}/cliente/sel/`,
        dataType: "json",
        success: function (data) {
            let tabla = '';
            if (data["exito"] === true) {
                if (window.innerWidth < 768) {
                    $.each(data["resultado"], function (llave, valor) {
                        let template = '<div class="list-group elementTabla">';
                        template += '<div class="list-group-item list-group-item-action elementTablaCell">';
                        template += '<div class="elementTablaCellGroup">';
                        template += '<div class="nombreCampoTablaCell">';
                        template += 'Correo';
                        template += '</div>';
                        template += '<div class="infoCampoTablaCell">';
                        template += valor["CorreoCliente"];
                        template += '</div>';
                        template += '</div>';
                        template += '</div>';
                        template += '<div class="list-group-item list-group-item-action elementTablaCell">';
                        template += '<div class="elementTablaCellGroup">';
                        template += '<div class="nombreCampoTablaCell">';
                        template += 'DNI';
                        template += '</div>';
                        template += '<div class="infoCampoTablaCell">';
                        template += valor["DNI"];
                        template += '</div>';
                        template += '</div>';
                        template += '</div>';
                        template += '<div class="list-group-item list-group-item-action elementTablaCell">';
                        template += '<div class="elementTablaCellGroup">';
                        template += '<div class="nombreCampoTablaCell">';
                        template += 'Nombre';
                        template += '</div>';
                        template += '<div class="infoCampoTablaCell">';
                        template += valor["NomCliente"];
                        template += '</div>';
                        template += '</div>';
                        template += '</div>';
                        template += '<div class="list-group-item list-group-item-action elementTablaCell">';
                        template += '<div class="elementTablaCellGroup">';
                        template += '<div class="nombreCampoTablaCell">';
                        template += 'Telefono';
                        template += '</div>';
                        template += '<div class="infoCampoTablaCell">';
                        template += valor["TelefonoCliente"];
                        template += '</div>';
                        template += '</div>';
                        template += '</div>';
                        template += '</div>'
                        tabla += template;
                    });
                    $('#resClienteContent').html(tabla);
                } else {
                    $.each(data["resultado"], function (llave, valor) {
                        let template = '<tr>';
                        template += '<td>' + valor["CorreoCliente"] + '</td>';
                        template += '<td>' + valor["DNI"] + '</td>';
                        template += '<td>' + valor["NomCliente"] + '</td>';
                        template += '<td>' + valor["TelefonoCliente"] + '</td>';
                        template += '</tr>';
                        tabla += template;
                    });
                    $('#clienteTable').html(tabla);
                }
            }
        }
    });
}

/**
 * Agrega un efecto de búsqueda en tiempo real para filtrar los resultados de clientes en una tabla o lista.
 */
function efectoBusquedaCliente() {
    $(document).ready(function () {
        $("#inputCliente").on("keyup", function () {
            if (window.innerWidth < 768) {
                let value = $(this).val().toLowerCase();
                $("#resClienteContent div.elementTabla").filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
            } else {
                let value = $(this).val().toLowerCase();
                $("#clienteTable tr").filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
            }

        });
    });
}