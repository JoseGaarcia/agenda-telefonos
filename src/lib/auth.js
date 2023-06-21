module.exports = {
    // método para comprobar si estas logeado si lo estas te dejo seguir sino te devuelvo a signIn
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect(('/signin'));
    },
    // método para comprobar si no estas logeado si no lo estas te dejo seguir sino te devuelvo a tu perfil
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }

        return res.redirect('/profile');
    }
};