const mysql = require('mysql');

const { promisify } = require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);

// Uso la conexion aqui para no tener que estar llamandolo todo el rato cada vez que ejecuto el codigo
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // conexion con la base de datos perdida
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') { // comporbar cuantas conexiones tiene la base de datos
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') { // conexion rechazada a la base de datos
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    // Aqui empiezo la conexion
    if (connection) connection.release();
    console.log('DB is CONNECTED');
    return;
});

// Promisify Pool Querys con esto consigo poder usar promesas en las consultas
pool.query = promisify(pool.query);

module.exports = pool;
