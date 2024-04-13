const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    game_id: { type: String, required: true },
    game_slug: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
