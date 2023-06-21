window.onload = () => {
    const input = document.querySelector('#flex-switch-check');
    const result = document.querySelector('#search');
    const opcion = document.querySelector('#select');

    if (input !== null && input.getAttribute('data-filtro') == 'true') {
        input.checked = true;
    }

    let url = new URL(window.location.href);

    if (input !== null) {
        input.addEventListener('click', () => {
            url.searchParams.set('filtro', input.checked);
            window.location.href = url.href;
        });
    }

    const button = document.querySelector('#button-search');

    if (button !== null) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            url.searchParams.set('tipo', opcion.value);
            url.searchParams.set('busqueda', result.value);
            window.location.href = url.href;
        });
    }

    const buttonMessage = document.querySelector('.close');
    if (buttonMessage !== null) {
        buttonMessage.addEventListener('click', () => {
            const messageElement = document.querySelector('.borrarmessage');
            if (messageElement !== null) {
                messageElement.remove();
            }
        });
    }

    const deletePhones = document.querySelectorAll('.delete-phone');
    deletePhones.forEach((deletePhone) => {
        deletePhone.addEventListener('click', (event) => {
            event.preventDefault();
            const id = deletePhone.dataset.id; // Obtener el valor del atributo data-id
            Swal.fire({
                title: '¿Estás seguro?',
                text: 'No podrás restablecer esto.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirigir a la ruta especificada con el parámetro
                    window.location.href = 'telefonos/delete/' + id;
                }
            });
        });
    });
}