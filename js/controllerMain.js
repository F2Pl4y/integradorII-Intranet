// export const dominio = 'https://f3rn4nd021py.pythonanywhere.com';
export const dominio = 'http://127.0.0.1:5000';

export const expresiones = {
    nombreCargo: /^[\w,\s]{5,30}$/,
    nombreCategoria: /^[\w,\s]{5,50}$/,
    nombrePlatillo: /^[\w,\s]{5,100}$/,
    dinero: /^\d+(.(\d{1,2})?)?$/,
    correo: /^([a-zA-Z0-9_.+-]{1,}@[\w-]+\.+[a-zA-Z0-9-.]+){1,240}$/,
    dni: /^\d{8}$/,
    nombreTrabajador: /^[\w,\s]{1,100}$/,
    /*Password con mínimo 8 caracteres de los cuales un caracter al menos debe ser un caracter especial y un número al menos y sin espacios*/
    password: /^(?=.+[\W])(?=.+\d).{8,}$/,
    /*Aclarando que es número peruano y que si se puede acepta o no +51*/
    telefono: /^(\+51|\+51 |51|51 )?\d{9}$/,
    direccion: /^[\wáéíóúÁÉÍÓÚñÑ\s]{1,150}$/
}

window.addEventListener('load', (e) => {
    efectoInputImg();
    if (window.location.pathname !== "/index.html") {
        menuResponsive();
    }
});

export function menuResponsive() {
    const btnMenu = document.getElementById('btnMenu');
    const menu = document.getElementById('sidenav');
    btnMenu.addEventListener('click', (e) => {
        menu.classList.toggle("responsive");
    });
    btnClose.addEventListener('click', (e) => {
        menu.classList.toggle("responsive");
    })
}

function efectoInputImg() {
    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
}

export function inputCheck(icono, input, boolean) {
    if (boolean) {
        icono.classList.add("positivo");
        icono.classList.remove("negativo");
        icono.innerHTML = `<i class='bx bx-check'></i>`;
        input.classList.add("positivo");
        input.classList.remove("negativo");
    } else {
        icono.classList.add("negativo");
        icono.classList.remove("positivo");
        icono.innerHTML = `<i class='bx bx-x' ></i>`;
        input.classList.add("negativo");
        input.classList.remove("positivo");
    }
}

export function mensajeValidacion(mensaje, validacion) {
    const config = {
        title: validacion ? 'Exito' : 'Error',
        text: mensaje,
        icon: validacion ? 'success' : 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#c83434'
    }
    Swal.fire(config);
}

export function mensajeConfirmacion(titulo, mensaje) {
    return new Promise((resolve) => {
        Swal.fire({
            title: titulo,
            text: mensaje,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            confirmButtonColor: '#062b55',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#c83434'
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(true);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                resolve(false);
            }
        });
    })
}