document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    if (form !== null) {
        form.addEventListener('submit', validarFormulario);
    }
});

function validarFormulario(evento) {
    evento.preventDefault();

    const regexName = /^(?=.{3,50}$)(\b[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]{1,30}\b)+$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexTlf = /^[9|6|7][0-9]{8}$/;

    var name = document.getElementById('name').value;
    var tlf = document.getElementById('tlf').value;
    var email = document.getElementById('email').value;

    if (!regexName.test(name)) {
        Swal.fire(
            'Nombre Incorrecto',
            'Pulsa el boton!',
            'error'
        );
        document.getElementById("name").style.borderColor = "red";
        return;
    }

    if (!regexTlf.test(tlf)) {
        Swal.fire(
            'Telefono Incorrecto',
            'Pulsa el boton!',
            'error'
        );
        document.getElementById("tlf").style.borderColor = "red";
        return;
    } else {
        document.getElementById("tlf").style.borderColor = '#ced4da';
    }

    if (!regexEmail.test(email)) {
        Swal.fire(
            'Email Incorrecto',
            'Pulsa el boton!',
            'error'
        )
        document.getElementById("email").style.borderColor = "red";
        return;
    }
    this.submit();
}