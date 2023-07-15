const evaluarLoginIntr = {
    CorreoTrabajador: false,
    PasswordTrabajador: false,
}

window.addEventListener('load', (e) => {
    checkSession();
    iniciarSesion();
    if (window.location.pathname === "/index.html") {
        evaluarCampos();
    } else {
        cerrarSesion();
    }
});

function setSession(token) {
    sessionStorage.setItem("access_token", token);
}

function isSessionValid(token) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `${dominio}/protected`,
            dataType: "json",
            headers: {
                'Authorization': 'cabecera' + token
            },
            success: function (response) {
                resolve(response["exito"]);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

function cerrarSesion() {
    const btnLogout = document.getElementById('btnLogout');
    btnLogout.addEventListener('click', (e) => {
        mensajeConfirmacion('Cerrar sesión', '¿Estás seguro que deseas cerrar sesión?').then((booleano) => {
            if (booleano) {
                sessionStorage.setItem("access_token", null);
                checkSession();
            }
        });
    })
}

// Función para verificar si el usuario ha iniciado sesión
function checkSession() {
    let tokenC = sessionStorage.getItem("access_token");
    isSessionValid(tokenC).then(validarSesion => {
        if (validarSesion) {
            if (window.location.pathname === "/index.html") {
                window.location.href = '/pages/dashboard.html'
            }
        } else if (window.location.pathname !== "/index.html") {
            window.location.href = '../index.html';
        }
    }).catch(error => {
        console.log(error);
    });
}

function iniciarSesion() {
    $('#loginForm').submit(function (event) {
        event.preventDefault();

        var correo = $('#txtCorreo').val();
        var password = $('#txtPassword').val();

        $.ajax({
            url: `${dominio}/login`,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                CorreoTrabajador: correo,
                PasswordTrabajador: password
            }),
            success: function (response) {
                if (response["mensaje"]) {
                    console.log(response);
                    setSession(response["mensaje"]);
                    checkSession();
                } else {

                }
            },
            error: function () {

            }
        });
    });
}

function evaluarCampos() {

    const txtCorreoTrabajador = document.getElementById('txtCorreo');
    const iconoCorreoTrabajador = document.querySelector('#txtCorreo+.icono');
    const txtPassword = document.getElementById('txtPassword');
    const iconoPassword = document.querySelector('#txtPassword+.icono');

    txtCorreoTrabajador.addEventListener('keyup', (e) => {
        const comprobarCorreo = expresiones["correo"].test(txtCorreoTrabajador.value);
        evaluarLoginIntr["CorreoTrabajador"] = comprobarCorreo;
        inputCheck(iconoCorreoTrabajador, txtCorreoTrabajador, comprobarCorreo);
    });
    txtPassword.addEventListener('keyup', (e) => {
        const comprobarPassword = expresiones["password"].test(txtPassword.value);
        evaluarLoginIntr["PasswordTrabajador"] = comprobarPassword;
        inputCheck(iconoPassword, txtPassword, comprobarPassword);
    });

}