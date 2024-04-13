/* Configuration of local MongoDB */

const mongoose= require('mongoose');
const {MONGO_USER, MONGO_PASSWORD} = require("../constants/env.constant");

const uri = "mongodb://localhost:27017/clients-db";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Event listeners for connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
