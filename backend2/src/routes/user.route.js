var express = require('express');
var router = express.Router();
const userService = require('../services/user.service');
const {preAuthMiddlewareAdmin, preAuthMiddlewareAdminOrExactUser, preAuthMiddlewareAdminOrUser} = require("../middleware");

/* GET all users and return JSON array */
router.get('/', preAuthMiddlewareAdmin, function(req, res, next) {
    // Pagination
    const page = req.query.page || 0;
    const size = req.query.size || 10;
    userService.getAllUsers(page, size)
        .then(users => res.json(users))
        .catch(err => res.status(400).json({ message: err.message }));
});

/* GET user by id and return JSON object */
router.get('/:id', preAuthMiddlewareAdminOrExactUser, function(req, res, next) {
    userService.getUserById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(err.status).json({ message: err.message }));
});

/* POST create a new user */
router.post('/', function(req, res, next) {
    userService.createUser(req.body.username, req.body.name, req.body.password)
        .then(id => res.status(201).json({ id: id, message: 'User created successfully'}))
        .catch(err => res.status(err.status).json({ message: err.message }));
});

/* PUT update a user */
router.put('/:id', preAuthMiddlewareAdminOrExactUser, function(req, res, next) {
    userService.updateUser(req.params.id, req.body.name, req.body.oldPassword, req.body.newPassword)
        .then(() => res.status(200).json({ message: 'User updated successfully'}))
        .catch(err => res.status(err.status).json({ message: err.message }));
});

/* DELETE delete a user */
router.delete('/:id', preAuthMiddlewareAdminOrExactUser, function(req, res, next) {
    userService.deleteUser(req.params.id)
        .then(() => res.status(200).json({ message: 'User deleted successfully'}))
        .catch(err => res.status(err.status).json({ message: err.message }));
});

/* POST add a game to a user's favGames */
router.post('/favGames/:id', preAuthMiddlewareAdminOrExactUser, function(req, res, next) {
    userService.addFavGame(req.params.id, req.body.gameName, req.body.gameSlug)
        .then(() => res.status(200).json({ message: 'Game added to favGames'}))
        .catch(err => res.status(err.status).json({ message: err.message }));
});

/* GET a user's favGames */
router.get('/favGames/:id', preAuthMiddlewareAdminOrUser, function(req, res, next) {
    userService.getFavGames(req.params.id)
        .then(games => res.json(games))
        .catch(err => res.status(err.status).json({ message: err.message }));
});

/* DELETE remove a game from a user's favGames */
router.delete('/favGames/:id/:gameSlug', preAuthMiddlewareAdminOrExactUser, function(req, res, next) {
    userService.removeFavGame(req.params.id, req.params.gameSlug)
        .then(() => res.status(200).json({ message: 'Game removed from favGames'}))
        .catch(err => res.status(err.status).json({ message: err.message }));
});

module.exports = router;
