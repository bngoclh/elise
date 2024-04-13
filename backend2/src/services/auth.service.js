const User = require('../models/user.model.js');
const {generateAuthToken, verifyToken} = require('../utils/jwt');
const {BadRequestError} = require("../constants/error.constant");
const passport = require('passport');

exports.login = async (username, password) => {
    const user = await User.findOne({ username: username }).exec();
    if (!user) {
        return new Promise((resolve, reject) => {
            reject(new BadRequestError('Username is not registered'));
        });
    }
    return new Promise((resolve, reject) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                reject(new BadRequestError(err.message));
            }
            if (!user) {
                reject(new BadRequestError('Wrong password'));
            }
            const token = generateAuthToken(user);
            resolve(token);
        })({body: {username: username, password: password}});
    });
}

exports.verifyToken = (token) => {
    return verifyToken(token);
}