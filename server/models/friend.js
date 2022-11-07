const mongoose = require('mongoose');

let friendSchema = new mongoose.Schema({
    sender: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    receiver: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    isBlocked: Boolean
});

let Friend = mongoose.model('Friend', friendSchema);
module.exports = Friend;