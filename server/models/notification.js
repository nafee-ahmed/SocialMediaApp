const mongoose = require("mongoose");

let notificationSchema = new mongoose.Schema({
    text: {
        type: String, 
        required: [true, "notification text is required"]
    },
    type: String,
    seen: Boolean,
    post: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
    sender: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    receiver: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
});

let Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;