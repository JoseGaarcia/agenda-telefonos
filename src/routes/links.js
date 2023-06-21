const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const { authPage } = require('../lib/middlewares');

// Para renderizar el formulario de añadir teléfono
router.get('/add', isLoggedIn, authPage('regular'), (req, res) => {
  // Esto tiene la ruta de el archivo que vamos a mostrar
  res.render('links/add');
});

// Añadir teléfono
router.post('/add', isLoggedIn, authPage('regular'), async (req, res) => {
  const { name, tlf, email } = req.body;
  const newTelefono = {
    name,
    tlf,
    email,
    user_id: req.user.id
  };

  let result = await pool.query('SELECT tlf FROM telefonos WHERE tlf = ? AND user_id = ?', [tlf, req.user.id]);
  let username = await pool.query('SELECT username, rol FROM users WHERE id = ?', [req.user.id]);

  if (result.length > 0) {
    req.flash('message', 'El teléfono ya existe');
    res.redirect('/telefonos');
  } else {
    await pool.query('INSERT INTO telefonos SET ?', [newTelefono]);

    //log
    const newLog = {
      operation: 'ADD',
      description: 'El usuario ' + username[0].username + ' ha añadido el teléfono ' + tlf + ' correctamente.',
      rol: username[0].rol,
      user_id: req.user.id
    };

    await pool.query('INSERT INTO log SET ?', [newLog]);
    req.flash('success', 'Teléfono guardado correctamente');
    res.redirect('/telefonos');
  }
});
// listado de teléfonos
router.get('/', isLoggedIn, authPage('regular'), async (req, res) => {
  let filtro = req.query['filtro'];
  let tipo = req.query['tipo'];
  let busqueda = req.query['busqueda'];
  let consulta = 'SELECT * FROM telefonos WHERE user_id = ?';
  let params = [req.user.id];
  let control = true;

  // Filtro orden alfabetico y busqueda search
  if (busqueda && tipo === 'name') {
    consulta += ' and name like ?';
    params.push('%' + busqueda + '%');
    control = false;
  } else if (busqueda && tipo === 'tlf') {
    consulta += ' and tlf like ?';
    params.push('%' + busqueda + '%');
    control = false;
  }

  if (filtro === 'true') {
    consulta += ' ORDER BY name ASC';
  }

  telefonos = await pool.query(consulta, params);

  if (telefonos.length == 0 && !control) {
    control = true;
    req.flash('message', 'No se ha encontrado ningun teléfono');
    return res.redirect('/telefonos');
  }

  // Con esta linea estamos renderizando la vista y pasandole la lista de telefonos
  res.render('links/list', { telefonos, filtro });
});
// Eliminar teléfono
router.get('/delete/:id', isLoggedIn, authPage('regular'), async (req, res) => {
  const { id } = req.params;
  let tlf = await pool.query('SELECT telefonos.tlf, users.username, users.rol FROM telefonos INNER JOIN users ON telefonos.user_id=users.id WHERE telefonos.id = ?', [id]);
  await pool.query('DELETE FROM telefonos WHERE id = ?', [id]);
  //log
  const newLog = {
    operation: 'DELETE',
    description: 'El usuario ' + tlf[0].username + ' ha eliminado el teléfono ' + tlf[0].tlf + ' correctamente.',
    rol: tlf[0].rol,
    user_id: req.user.id
  };
  await pool.query('INSERT INTO log set ?', [newLog]);
  req.flash('success', 'Teléfono borrado correctamente');
  res.redirect('/telefonos');
});
// Renderizar la vista de editar teléfono
router.get('/edit/:id', isLoggedIn, authPage('regular'), async (req, res) => {
  const { id } = req.params;
  const telefono = await pool.query('SELECT * FROM telefonos WHERE id = ?', [id]);
  res.render('links/edit', { telefono: telefono[0] });
});
// Editar teléfono
router.post('/edit/:id', isLoggedIn, authPage('regular'), async (req, res) => {
  const { id } = req.params;
  const { name, tlf, email } = req.body;
  const newTelefono = {
    name,
    tlf,
    email
  };

  // Obtener el registro actual del teléfono
  let telefonoActual = await pool.query('SELECT * FROM telefonos WHERE id = ?', [id]);
  telefonoActual = telefonoActual[0]; // Obtener el primer registro (se asume que el id es único)

  // Verificar si el número de teléfono ha sido modificado
  if (telefonoActual.tlf !== tlf) {
    // Verificar si existe otro teléfono igual para el usuario actual
    let result = await pool.query('SELECT tlf FROM telefonos WHERE tlf = ? AND id != ? AND user_id = ?', [tlf, id, req.user.id]);

    if (result.length > 0) {
      req.flash('message', 'El teléfono ya existe. Introduce otro número de teléfono.');
      res.redirect('/telefonos');
      return;
    }
  }

  // Verificar si se realizaron cambios en la información del teléfono
  if (
    telefonoActual.name !== newTelefono.name ||
    telefonoActual.tlf !== newTelefono.tlf ||
    telefonoActual.email !== newTelefono.email
  ) {
    await pool.query('UPDATE telefonos SET ? WHERE id = ?', [newTelefono, id]);
    //log
    let userEdit = await pool.query('SELECT telefonos.tlf, users.username, users.rol FROM telefonos INNER JOIN users ON telefonos.user_id=users.id WHERE telefonos.id = ?', [id]);
    const newLog = {
      operation: 'UPDATE',
      description: 'El usuario ' + userEdit[0].username + ' ha modificado el teléfono ' + userEdit[0].tlf + ' correctamente.',
      rol: userEdit[0].rol,
      user_id: req.user.id
    };
    await pool.query('INSERT INTO log SET ?', [newLog]);
    req.flash('success', 'Teléfono editado correctamente');
  } else {
    req.flash('message', 'No se realizaron cambios en el teléfono');
  }

  res.redirect('/telefonos');
});
module.exports = router;

