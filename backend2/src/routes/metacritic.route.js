var express = require('express');
var router = express.Router();
const commentService = require('../services/comment.service');
const MetacriticComment = require('../models/metacritic.comments.model');

// POST create new comments by scrapping metacritic
router.post('/', function(req, res, next) {
    MetacriticComment.scrapeComment(req, res, next);
});

// GET comments metacritic by game_slug
router.get('/metacritic/:game_slug', function(req, res, next) {
    MetacriticComment.addMetacriticComment(req, res, next);
});
