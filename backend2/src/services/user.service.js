/* User CRUD Service from MongoDB */
const User = require('../models/user.model.js');
const {NotFoundError, BadRequestError} = require("../constants/error.constant");
const helmet = require('helmet');

// Get all users paginated
exports.getAllUsers = (page, size) => {
    // get name and email only
    const users = User.find({}, 'username name role')
        .skip(page * size)
        .limit(size);
    return users;
}

// Get user by id
exports.getUserById = async (userId) => {
    // get name and email only
    const user = await User.findById(userId, 'username name role favGames').exec();
    if (!user) {
        throw new NotFoundError('User not found');
    }
    return user;
}

// Create a new user, the password must contain at least 6 characters
exports.createUser = async (username, name, password) => {
    if (!username || !name || !password) {
        return new Promise((resolve, reject) => {
            reject(new BadRequestError('Missing required fields: username, name, password.'));
        });
    }

    // Check if password length is less than 6
    if (password.length < 6) {
        return new Promise((resolve, reject) => {
            reject(new BadRequestError('Password must contain at least 6 characters.'));
        });
    }

    // if user already exists, throw error
    const user = await User.findOne({ username: username }).exec();
    if (user) {
        return new Promise((resolve, reject) => {
            reject(new BadRequestError('Username already exists'));
        });
    }
    const payload = {
        username: username,
        name: name,
        role: "USER"
    };
    // using passport-local-mongoose
    // return _id of new user
    return new Promise((resolve, reject) => {
        User.register(payload, password, (err, user) => {
            if (err) {
                reject(new BadRequestError(err.message));
            }
            resolve(user._id);
        });
    });
}

exports.updateUser = async (userId, name, oldPassword, newPassword) => {
    const oldUser = await User.findById(userId).exec();
    const newPayload = {};
    if (name) {
        newPayload.name = name;
    } else {
        newPayload.name = oldUser.name;
    }

    // update oldUser with newPayload
    oldUser.set(newPayload);

    // update password
    if (oldPassword && newPassword) {
        // change password
        return new Promise((resolve, reject) => {
            oldUser.changePassword(oldPassword, newPassword, (err) => {
                if (err) {
                    reject(new BadRequestError(err.message));
                }
                oldUser.save();
                resolve(oldUser._id);
            });
        });
    }
    else if (oldPassword && !newPassword) {
        return new Promise((resolve, reject) => {
            reject(new BadRequestError('Missing new password'));
        });
    }
    else if (!oldPassword && newPassword) {
        return new Promise((resolve, reject) => {
            reject(new BadRequestError('Missing old password'));
        });
    }
    else {
        return new Promise((resolve, reject) => {
            oldUser.save();
            resolve(oldUser._id);
        });
    }
}

exports.deleteUser = async (userId) => {
    const user = await User.findById(userId).exec();
    if (!user) {
        return new Promise((resolve, reject) => {
            reject(new NotFoundError('User not found'));
        });
    }
    return new Promise((resolve, reject) => {
        user.remove((err) => {
            if (err) {
                reject(new BadRequestError(err.message));
            }
            resolve(user._id);
        });
    });
}

// Add a game to a user's favGames
exports.addFavGame = async (id, gameName, gameSlug) => {
    const user = await  User.findById(id).exec();
    if (!user) {
        return new Promise((resolve, reject) => {
            reject(new NotFoundError('User not found'));
        });
    }
    user.favGames.push({gameName,gameSlug});
    return new Promise((resolve, reject) => {
        user.save((err) => {
            if (err) {
                reject(new BadRequestError(err.message));
            }
            resolve(user._id);
        });
    });
}

// Get a user's favGames
exports.getFavGames = async (userId) => {
    const user = await User.findById(userId).exec();
    if (!user) {
        return new Promise((resolve, reject) => {
            reject(new NotFoundError('User not found'));
        });
    }
    return user.favGames;
}

// Remove a game from a user's favGames
exports.removeFavGame = async (userId, gameSlug) => {
    const user = await User.findById(userId).exec();
    if (!user) {
        return new Promise((resolve, reject) => {
            reject(new NotFoundError('User not found'));
        });
    }
    // remove game from favGames whose gameSlug matches
    user.favGames = user.favGames.filter(game => game.gameSlug !== gameSlug);
    return new Promise((resolve, reject) => {
        user.save((err) => {
            if (err) {
                reject(new BadRequestError(err.message));
            }
            resolve(user._id);
        });
    });
}