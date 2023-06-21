const pool = require('../database');
// Sirve para controlar el acceso si eres admin o regular
const authPage = (permissions) => {
    return async (req, res, next) => {
        try {
            const username = req.user.username; // Obtengo el nombre de usuario desde req.user.username
            const result = await pool.query('SELECT rol FROM users WHERE username = ?', [username]);
            const role = result[0].rol;

            if (permissions === role) {
                next();
            } else if (permissions === 'admin') {
                return res.redirect('/profile');
            }else {
                return res.redirect('/admin');
            }
        } catch (error) {
            console.error('Error al verificar los permisos:', error);
            return res.status(500).json("Error del servidor");
        }
    };
};

module.exports = { authPage };

