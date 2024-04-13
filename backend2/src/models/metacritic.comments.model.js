const mongoose = require("mongoose");

const metacriticCommentSchema = new mongoose.Schema({
    game_slug: { type: String, required: true}, // thay game bằng game_slug
    commentsList: { type: [String], required: true },
});

const MetacriticComment = mongoose.model("MetacriticComment", metacriticCommentSchema);

module.exports = MetacriticComment;