const mongoose = require("mongoose");

let postSchema = new mongoose.Schema({
  text: String,
  image: String,
  numberOfLikes: {
    type: Number,
    default: 0,
  },
  numberOfComments: {
    type: Number,
    default: 0,
  },
  likingUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}]
});

let Post = mongoose.model("Post", postSchema);
module.exports = Post;
