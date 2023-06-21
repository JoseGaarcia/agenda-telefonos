document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-sign-in");
    if (form !== null) {
        form.addEventListener('submit', validarSignIn);
    }
});

function validarSignIn(evento) {
    evento.preventDefault();

    const fieldEmpty = /^(?!\s|\S*\s$).+$/;
    const regexPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username == "" || !fieldEmpty.test(username)) {
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