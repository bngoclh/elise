var express = require('express');
var router = express.Router();
const commentService = require('../services/comment.service');
const {preAuthMiddlewareAdminOrUser} = require("../middleware");
const {preAuthMiddlewareAdminOrExactUser} = require("../middleware");

// GET comments by game_id
router.get('/game/:game_id', function(req, res, next) {
    const page = req.query.page || 0;
    const size = req.query.size || 10;
    commentService.getAllCommentsByGameId(req.params.game_id, page, size)
        .then(comments => res.json(comments))
        .catch(err => res.status(400).json({ message: err.message }));
});

// GET comments by user_id
router.get('/user/:user_id', preAuthMiddlewareAdminOrUser, function(req, res, next) {
    commentService.getAllCommentsByUserId(req.params.user_id)
        .then(comments => res.json(comments))
        .catch(err => res.status(400).json({ message: err.message }));
});

// POST create a new comment
router.post('/', preAuthMiddlewareAdminOrUser, function(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    commentService.createComment(token, req.body.game_id, req.body.game_slug, req.body.text)
        .then(comment => res.status(201).json({ comment: comment, message: 'Comment created successfully'}))
        .catch(err => res.status(err.status).json({ message: err.message }));
});

// DELETE a comment, only Admin or the user who created the comment can delete it
router.delete('/:id', preAuthMiddlewareAdminOrUser, function(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    commentService.deleteComment(token, req.params.id)
        .then(comment => res.status(200).json({ message: 'Comment deleted successfully'}))
        .catch(err => res.status(err.status).json({ message: err.message }));
});

// PUT modify a comment, only Admin or the user who created the comment can modify it
router.put('/:id', preAuthMiddlewareAdminOrExactUser, function(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    commentService.updateComment(token, req.params.id, req.body.text)
        .then(comment => res.status(200).json({ message: 'Comment changed and updated successfully'}))
        .catch(err => res.status(err.status).json({ message: err.message }));
});

module.exports = router;
