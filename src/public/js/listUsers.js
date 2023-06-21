document.addEventListener('DOMContentLoaded', () => {
  const buttonmessage = document.querySelector('.close');
  if (buttonmessage) {
    buttonmessage.addEventListener('click', () => {
      document.querySelector('.borrarmessage').remove();
    });
  }
  // Filtro para buscar usuarios con rol Admin
  const input = document.querySelector('#flex-switch-check-user');
  const result = document.querySelector('#search-user');

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

  const button = document.querySelector('#button-search-user');

  if (button !== null) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      url.searchParams.set('busqueda', result.value);
      window.location.href = url.href;
    });
  }

  const deleteUsers = document.querySelectorAll('.delete-admin');
  deleteUsers.forEach((deleteUser) => {
    deleteUser.addEventListener('click', (event) => {
      event.preventDefault();

      const id = deleteUser.dataset.id; // Obtener el valor del atributo data-id

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
          window.location.href = '/delete/' + id;
        }
      });
    });
  });
});
















