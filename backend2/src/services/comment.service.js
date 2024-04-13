/* Comment CRUD Service from MongoDB */
const Comment = require('../models/comment.model');
const {verifyToken} = require('../utils/jwt');
const User = require('../models/user.model');
const {NotFoundError, BadRequestError} = require("../constants/error.constant");

// Get all comments paginated by game_id, sorted by date
exports.getAllCommentsByGameId = (gameId, page, size) => {
    const comments = Comment.find({ game_id: gameId })
        .sort({ date: -1 })
        .skip(page * size)
        .limit(size);
    return comments;
}

const createCommentForGameAndUser = async (userId, gameId, gameSlug, text) => {
    const user = await User.findById(userId).exec();
    const comment = new Comment({
        user_id: user,
        username: user.username,
        game_id: gameId,
        game_slug: gameSlug,
        text: text
    });
    await comment.save();
    return await comment;
}

// Create a new comment
exports.createComment = async (token, gameId, gameSlug, text) => {
    return new Promise((resolve, reject) => {
        verifyToken(token)
            .then(decoded => resolve(createCommentForGameAndUser(decoded._id, gameId, gameSlug, text)))
            .catch(err => reject(err));
    });
}

// GET all comments by user_id
exports.getAllCommentsByUserId = (userId) => {
    return Comment.find({ user_id: userId });
}


// Delete a comment, only Admin or the user who created the comment can delete it
exports.deleteComment = async (token, commentId) => {
    return new Promise((resolve, reject) => {
        verifyToken(token)
            .then(decoded => {
                Comment.findById(commentId) // Find the comment
                    .then(comment => {
                        if (!comment) {
                            reject(new NotFoundError("Comment not found"));
                        } else if (decoded.role === 'admin' || comment.user_id == decoded._id) {
                            comment.deleteOne(); // Delete the comment
                            resolve(comment);
                        } else {
                            reject(new BadRequestError("You are not allowed to delete this comment"));
                        }
                    })
                    .catch(err => reject(err)); // Error while finding the comment
            }
            ) // Error while verifying the token
            .catch(err => reject(err)); // Error while verifying the token
    }
    );
}

// PUT to modify a comment, only Admin or the user who created the comment can modify it
exports.updateComment = async (token, commentId, text) => {
    return new Promise((resolve, reject) => {
        verifyToken(token)
            .then(decoded => {
                Comment.findById(commentId) // Find the comment
                    .then(comment => {
                        if (!comment) {
                            reject(new NotFoundError("Comment not found"));
                        } else if (decoded.role === 'admin' || comment.user_id == decoded._id) {
                            comment.text = text; // Modify the comment
                            comment.save();
                            resolve(comment);
                        } else {
                            reject(new BadRequestError("You are not allowed to modify this comment"));
                        }
                    })
                    .catch(err => reject(err)); // Error while finding the comment
            }
            ) // Error while verifying the token
            .catch(err => reject(err)); // Error while verifying the token
    }
    );
}