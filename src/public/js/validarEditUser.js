document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-edit-user");
    if (form !== null) {
        form.addEventListener('submit', validarEditUser);
    }
});

function validarEditUser(evento) {
    evento.preventDefault();

    var username = document.getElementById('username-edit-user').value;
    var fullname = document.getElementById('fullname-edit-user').value;  
    var password = document.getElementById('password-edit-user').value;  
    const regexFullName = /^(?=.{3,50}$)(\b[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]{1,25}\b)+$/; 
    const regexUsername = /^[a-zA-Z0-9_-]{4,16}$/; 
    const regexPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; 

    if (!regexUsername.test(username)) {
        Swal.fire(
            'Nombre Incorrecto',
            'Pulsa el boton!',
            'error'
        );
        document.getElementById("username-edit-user").style.borderColor = "red";
        return;
    } 

    if (!regexFullName.test(fullname)) {
        Swal.fire(
            'Nombre Completo Incorrecto',
            'Pulsa el boton!',
            'error'
        );
        document.getElementById("username-edit-user").style.borderColor = "red";
        return;
    } 

    if (password.trim() !== '' && !regexPass.test(password)) {
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