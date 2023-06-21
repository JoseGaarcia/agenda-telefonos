const bcrypt = require('bcryptjs');

const helpers = {};

// En este metodo recibiremos la contraseña en texto plano y la cifraremos con hash, etse metodo es para cuando nos registremos
helpers.encryptPassword = async (password) => {
    // Generaremos un patron de cifrado
    const salt = await bcrypt.genSalt(10);
    // Aqui ciframos la contraseña con ese patron
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

// Este metodo es para el login comprobar si la contraseña es igual que la que esta encriptada
helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log(e);
    }
};

module.exports = helpers; 