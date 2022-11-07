const mongoose = require('mongoose');

let friendRequestSchema = new mongoose.Schema({
    sender: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    receiver: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    isPending: Boolean
});

let FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
module.exports = FriendRequest;