const express = require('express');
const router = express.Router();

// vista principal de la aplicación
router.get('/', (req, res) => { 
    const user = req.user;

    if (user && user.rol === 'admin') {
        res.render('index', {
            adminView: true
        });
    } else {
        res.render('index');
    }
});

module.exports = router;

