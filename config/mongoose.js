const mongoose = require('mongoose');
const config = require('./config');


mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});
exports.connect = () => {
    mongoose.connect(config.DB_URL, {
        useNewUrlParser: true
    });
    console.log(`connecting to mongo @: ${config.DB_URL}`);
    return mongoose.connection;
};
exports.disconnect = () => {
    mongoose.disconnect(() => {
        console.log(`disconnect to mongo @: ${config.DB_URL}`);
    });
};