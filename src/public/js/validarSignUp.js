document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-sign-up");
    if (form !== null) {
        form.addEventListener('submit', validarSignUp);
    }
});

function validarSignUp(evento) {
    evento.preventDefault();

    const regexUsername = /^[a-zA-Z0-9_-]{4,16}$/;
    const regexPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const regexFullName = /^(?=.{3,50}$)(\b[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]{1,25}\b)+$/;
    var fullname = document.getElementById('fullname').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (!regexFullName.test(fullname)) {
        Swal.fire(
            'Nombre Completo Incorrecto',
            'Pulsa el boton!',
            'error'
        );
        document.getElementById("fullname").style.borderColor = "red";
        return;
    }

    if (!regexUsername.test(username)) {
        Swal.fire(
            'Nombre Incorrecto',
            'Pulsa el boton!',
            'error'
        );
        document.getElementById("username").style.borderColor = "red";
        return;
    }

    if (!regexPass.test(password)) {
        Swal.fire(
            'Contraseña Incorrecta\nMínimo 8 caracteres',
            'Pulsa el boton!',
            'error'
        );
        document.getElementById("password").style.borderColor = "red";
        return;
    }
    this.submit();
}