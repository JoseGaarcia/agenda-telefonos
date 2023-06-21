const { format } = require('timeago.js');

const helpers = {};
// Para darle formato a la fecha
helpers.timeago = (timestamp) => {
    return format(timestamp, 'es');
};

module.exports = helpers;