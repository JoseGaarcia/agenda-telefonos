const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const helpers = require('../lib/helpers');
const { authPage } = require('../lib/middlewares');
// listado de usuarios
router.get('/usuarios', isLoggedIn, authPage('admin'), async (req, res) => {
    let filtro = req.query['filtro'];
    let busqueda = req.query['busqueda'];
    let consulta = 'SELECT * FROM users WHERE rol = ?'; 
    let control = true;
    let params = ['regular'];

    // Filtro orden alfabetico y busqueda search
    if (busqueda) {
        consulta += 'and (username LIKE ? OR fullname LIKE ?)';
        params.push('%' + busqueda + '%');
        params.push('%' + busqueda + '%'); 
        control = false;
    }
    if (filtro === 'true') {
        consulta += ' ORDER BY username ASC '; 
    }

    user = await pool.query(consulta, params);

    if (user.length === 0  && !control) { 
        control = true;
        req.flash('message', 'No se ha encontrado ningun usuario');
        return res.redirect('/usuarios');
    }

    res.render('links/listUsers', {
        adminView: true, user, filtro
    });
});
// Eliminar usuario
router.get('/delete/:id', isLoggedIn, authPage('admin'), async (req, res) => {
    const { id } = req.params;
    let username = await pool.query('SELECT username FROM users WHERE id = ?', [id]);
    const user = await pool.query('SELECT t.tlf, u.username FROM `users` u INNER JOIN telefonos t ON u.id=t.user_id WHERE u.id = ?', [id]);
    if (user.length <= 0) {
        await pool.query('DELETE users FROM users WHERE id = ?', [id]);
    } else {
        await pool.query('DELETE u,t FROM users u INNER JOIN telefonos t ON u.id=t.user_id WHERE u.id = ?', [id]);
    }
    //log
    const newLog = {
        operation: 'DELETE',
        description: 'El usuario administrador ' + req.user.username + ' ha eliminado el usuario ' + username[0].username + ' correctamente.',
        rol: req.user.rol,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO log set ?', [newLog]);
    req.flash('success', 'Usuario borrado correctamente');
    res.redirect('/usuarios');
});
// Renderizar vista de editar usuario
router.get('/usuarios/edit/:id', isLoggedIn, authPage('admin'), async (req, res) => {
    const { id } = req.params;
    const user = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.render('links/editAdmin', {
        adminView: true, user: user[0]
    });
});
// Editar usuario
router.post('/usuarios/edit/:id', authPage('admin'), async (req, res) => {
    const { id } = req.params;
    let usernameEdit = await pool.query('SELECT username FROM users WHERE id = ?', [id]);
    const { username, password, fullname } = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password);
    let result = await pool.query('SELECT password FROM users WHERE username = ? and id != ?', [username, id]);
    let pass = await pool.query('SELECT password FROM users WHERE id = ?', [id]);
    if (!result.length == 0) {
        req.flash('message', 'El usuario ya existe introduzca otro nombre de usuario!');
    } else if (password === "") {
        newUser.password = pass[0].password;
        await pool.query('UPDATE users set ? WHERE id = ?', [newUser, id]);
        //log
        const newLog = {
            operation: 'UPDATE',
            description: 'El usuario administrador ' + req.user.username + ' ha modificado el usuario ' + usernameEdit[0].username + ' correctamente.',
            rol: req.user.rol,
            user_id: req.user.id
        };
        await pool.query('INSERT INTO log set ?', [newLog]);
        req.flash('success', 'Usuario editado correctamente');
    } else {
        await pool.query('UPDATE users set ? WHERE id = ?', [newUser, id]);
        //log
        const newLog = {
            operation: 'UPDATE',
            description: 'El usuario administrador ' + req.user.username + ' ha modificado el usuario ' + usernameEdit[0].username + ' correctamente.',
            rol: req.user.rol,
            user_id: req.user.id
        };
        await pool.query('INSERT INTO log set ?', [newLog]);
        req.flash('success', 'Usuario editado correctamente');
    }
    res.redirect('/usuarios');
});
// Redenrizar vista de añadir usuario
router.get('/usuarios/add', isLoggedIn, authPage('admin'), async (req, res) => {
    res.render('links/addAdmin', {
        adminView: true
    });
});
// Añadir usuario
router.post('/usuarios/add', authPage('admin'), async (req, res) => {
    const { username, password, fullname, rol } = req.body;
    const newUser = {
        username: username.toLowerCase(),
        password,
        fullname,
        rol
    };
    const user = await pool.query('SELECT * FROM users WHERE username = ?', [newUser.username]);
    if (user.length > 0) {
        req.flash('message', 'El nombre de usuario ya existe!');
        return res.redirect('/usuarios');
    }
    newUser.password = await helpers.encryptPassword(password);
    await pool.query('INSERT INTO users SET ?', [newUser]);
    //log
    const newLog = {
        operation: 'ADD',
        description: 'El usuario administrador ' + req.user.username + ' ha añadido el usuario ' + username + ' correctamente.',
        rol: req.user.rol,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO log set ?', [newLog]);
    res.redirect('/usuarios');
});
module.exports = router;