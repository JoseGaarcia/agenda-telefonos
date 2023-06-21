const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

// Configuracion para iniciar sessión
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            // //log
            const newLog = {
                operation: 'SIGIN',
                description: 'Usuario ' + user.username + ' ha iniciado sesión correctamente.',
                rol: user.rol,
                user_id: user.id
            };
            await pool.query('INSERT INTO log set ?', [newLog]);
            done(null, user, req.flash('success', 'Bienvenido ' + user.username));
        } else {
            done(null, false, req.flash('message', 'La contraseña es incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El nombre de usuario no existe'));
    }
}));

// Configuracion para registrarse
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body;
    const newUser = {
        username: username.toLowerCase(),
        password,
        fullname,
        rol: 'regular'
    };
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [newUser.username]);
    if (rows.length > 0) {
        return done(null, false, req.flash('message', 'El username ya existe!'));
    }
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId; 
    // //log
    const newLog = {
        operation: 'SIGNUP',
        description: 'Usuario ' + newUser.username + ' registrado correctamente.',
        rol: newUser.rol,
        user_id: newUser.id
    };
    await pool.query('INSERT INTO log set ?', [newLog]);
    return done(null, newUser); // aqui devuelvo el newuser para que lo almacene en una sesión
}));

// Aqui guardo el id del usuario en la sesión
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Aqui cojo ese id que he almacenado para volver a obtener los datos de ese usuario que tenia almacenado en la sesión
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});