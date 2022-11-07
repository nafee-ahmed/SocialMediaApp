const mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    text: String
})

let Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;