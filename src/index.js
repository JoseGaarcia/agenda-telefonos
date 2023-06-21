const express = require('express');
// Muestra las peticiones que van llegando del servidor por consola
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

// incializaciones 
const app = express();
require('./lib/passport');

// settings 
app.set('port', process.env.PORT || 4000);
// Esto es para decirle donde esta la carpeta views, dirname te devuelve la direccion del archivo que se esta ejecutando
app.set('views', path.join(__dirname, 'views'));
// Configuracion del motor express-hbs, join sirve para concatenar directorios, extname es para configurar que los archivos acaben en .hbs
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares 
app.use(session({
    secret: 'telefonomysqlsession',
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore(database),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // Tiempo de vida de la cookie en milisegundos (aquí establezco un día)
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // Fecha de expiración de la cookie (aquí también se establece un día)
    }
}));

app.use(flash());
app.use(morgan('dev'));
// Sirve para poder aceptar de los formularios los datos que me envien los usuarios, extended false solo es para aceptar datos sencillos no imagenes..
app.use(express.urlencoded({ extended: false }));
// Esto es para poder recibir y enviar json
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Variables globales
// Para usar variables globales desde cualquier parte
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});  

// Routes aqui importo las rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use(require('./routes/linksAdmin'));
// Para acceder a las rutas de links hay que poner siempre el prefijo /telefonos
app.use('/telefonos', require('./routes/links'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server 
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});