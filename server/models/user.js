const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"], // every validation message starts with what is being validated eg name here so it is easy to fetch error messages
  },
  number: {
    type: String,
    required: [true, "number is required"],
    match: [/^\d{10}$/, "phone number format invalid"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    match: [/\S+@\S+\.\S+/, "email format is invalid"],
    lowercase: [true, "email must be lowercased"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  interest: {
    type: String,
    required: [true, "interest is required"],
  },
  bio: {
    type: String,
    required: [true, "bio is required"],
  },
  profilePic: String,
  picId: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Friend" }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "FriendRequest" }],
  requestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "FriendRequest" }]
});

// unique validation of email
userSchema.path("email").validate(async function (email) {
  // we return false, when some validation fails
  const emailCount = await mongoose.models.User.countDocuments({ email }); // returns number of emails already stored with the email inputted
  // return !emailCount; // if we search email and we get 0 results, then it is unique and validation passed
  if (emailCount > 1) {
    return false;
  } else if (emailCount === 0) {
    return true;
  } else if (emailCount === 1) {
    const user = await this.constructor.findOne({ email });
    if (user) {
      if (this._id === user._id) {
        return true;
      }
      return false;
    }
  }
}, "email already exists");

userSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, `${process.env.JWT_SECRET}`);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
