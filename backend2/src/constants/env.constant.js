/* Load env variables */
require('dotenv').config();

module.exports = {
    'MONGO_USER': process.env.MONGO_USER,
    'MONGO_PASSWORD': process.env.MONGO_PASSWORD
}