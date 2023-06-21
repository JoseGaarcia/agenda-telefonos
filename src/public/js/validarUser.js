document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-user");
    if (form !== null) {
        form.addEventListener('submit', validarFormularioUser);
    }
});

function validarFormularioUser(evento) {
    evento.preventDefault();

    const regexFullName = /^(?=.{3,50}$)(\b[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]{1,25}\b)+$/;   
    const regexUsername = /^[a-zA-Z0-9_-]{4,16}$/;
    const regexPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var fullname = document.getElementById('fullname').value;
    var radio = document.getElementsByName('rol');

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

    if (!regexFullName.test(fullname)) {
        Swal.fire(
            'Nombre Completo Incorrecto',
            'Pulsa el boton!',
            'error'
        );
        document.getElementById("fullname").style.borderColor = "red";
        return;
    }

    var isChecked = false;

    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            isChecked = true;
            break;
        }
    }

    if (!isChecked) {
        Swal.fire(
            'Debes seleccionar un rol',
            'Pulsa el boton!',
            'error'
        );
        return;
    }
    this.submit();
} 