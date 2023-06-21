const express = require('express');
const router = express.Router();

const passport = require('passport');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const { authPage } = require('../lib/middlewares');

// Esta ruta es para renderizar el formulario
router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

// Esta ruta es para recibir los datos del formulario 
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));
// Renderizar vista de signIn
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});
// Esta ruta es para que si todo ha ido bien pases al perfil o sino te vuelva al signIn
router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});
// Renderizar vista de perfil
router.get('/profile', isLoggedIn, authPage('regular'), async (req, res) => {
    res.render('profile');
});
// Renderizar vista de admin
router.get('/admin', isLoggedIn, (req, res) => {
    res.render('admin', {
        adminView: true
    });
});
// Ruta para cerrar sesión
router.get("/logout", isLoggedIn, async (req, res, next) => {
    const { user } = req;

    req.logout((err) => {
        if (err) {
            return next(err);
        }

        // Registrar el evento de cierre de sesión en el log
        const newLog = {
            operation: 'LOGOUT',
            description: 'Usuario ' + user.username + ' ha cerrado sesión correctamente.',
            rol: user.rol,
            user_id: user.id
        };

        pool.query('INSERT INTO log SET ?', [newLog], (err) => {
            if (err) {
                return next(err);
            }

            res.redirect("/signin");
        });
    });
});
module.exports = router;