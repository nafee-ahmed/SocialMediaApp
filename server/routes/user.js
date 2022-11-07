const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const AppError = require("../utils/AppError");
const User = require("../models/user");
const { cloudinary } = require("../utils/cloudinary");
const Post = require("../models/post");
const FriendRequest = require("../models/friendRequest");
const Friend = require("../models/friend");
const Comment = require("../models/comment");
const Notification = require("../models/notification");
const deleteFromCloudinary = require("../utils/deleteFromCloudinary");

function getResetPasswordToken() {
  const resetToken = crypto.randomBytes(20).toString("hex");
  return resetToken;
}

function processedResetToken(resetToken) {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const resetPasswordExpire = Date.now() + 10 * (60 * 1000); // expires in additional 10 mins
  return { resetPasswordToken, resetPasswordExpire };
}

async function sendEmail(options) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
}

async function signUpUser(req, res, next) {
  const { name, number, email, password, interest, bio } = req.body;
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      number,
      email,
      interest,
      bio,
      password: hashedPw,
    });
    await user.save();
    const token = user.getSignedToken();
    res.status(200).json({ success: true, token });
  } catch (e) {
    next(e);
  }
}

async function loginUser(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new AppError("Wrong Credentials", 401);
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const token = user.getSignedToken();
      res.status(200).json({ success: true, token });
    } else {
      throw new AppError("Wrong Credentials", 401);
    }
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new AppError("Email could not be sent", 404);
    const resetToken = getResetPasswordToken(); // returns reset token for use in url
    const resetTokenAndExpiry = processedResetToken(resetToken); // takes reset token to be used in url and encrypts it to be saved in db
    const updated = await User.findByIdAndUpdate(
      user._id,
      resetTokenAndExpiry,
      { runValidators: true, new: true }
    );

    const resetURL = process.env.FRONTEND_LINK + `/resetpassword/${resetToken}`;
    const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${resetURL} clicktracking=off>${resetURL}</a>
        `;
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });
      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (err) {
      const resetPasswordToken = undefined;
      const resetPasswordExpire = undefined;
      await User.findByIdAndUpdate(
        user._id,
        { resetPasswordToken, resetPasswordExpire },
        { runValidators: true, new: true }
      );
      throw new AppError("Email could not be sent", 500);
    }
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  const { resetToken } = req.params;
  let resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log(resetPasswordToken);
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }); // resetPasswordExpire endure it is still valid
    console.log(user);
    if (!user) {
      throw new AppError("Invalid Reset Token", 400);
    }
    const password = await bcrypt.hash(req.body.password, 12);
    resetPasswordToken = undefined;
    const resetPasswordExpire = undefined;
    await User.findByIdAndUpdate(
      user._id,
      { password, resetPasswordToken, resetPasswordExpire },
      { runValidators: true, new: true }
    );

    res.status(201).json({ success: true, data: "Password Reset Success" });
  } catch (err) {
    next(err);
  }
}

async function search(req, res, next) {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select([
      "-resetPasswordToken",
      "-password",
    ]);
    res.status(201).json({ success: true, users });
  } catch (err) {
    next(err);
  }
}

const readSettings = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.user._id }).select([
      "-password",
    ]);
    res.status(201).json({ success: true, msg: user });
  } catch (error) {
    next(error);
  }
};

async function updateSettings(req, res, next) {
  try {
    const { img, oldpassword, password, ...otherDetails } = req.body;
    const hashedPw = await bcrypt.hash(password, 12);

    const isPasswordMatched = await bcrypt.compare(
      oldpassword,
      req.user.password
    );

    if (isPasswordMatched) {
      let profilePic = undefined;
      let picId = undefined;
      if (img !== "") {
        uploadedResponse = await cloudinary.uploader.upload(img, {
          upload_preset: `${process.env.CLOUDINARY_UPLOAD_PRESET}`,
        });
        profilePic = uploadedResponse.url;
        picId = uploadedResponse.public_id;
        if (
          req.user.profilePic !== undefined &&
          req.user.profilePic !== uploadedResponse.url
        ) {
          await cloudinary.uploader.destroy(req.user.picId);
        }
      }

      const updatedSettings = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            ...otherDetails,
            password: hashedPw,
            profilePic,
            picId,
          },
        },
        { new: true }
      );
      res.status(201).json({ success: true, msg: updatedSettings });
    } else {
      throw new AppError("Please enter correct current password", 500);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

const renderUserProfile = async (req, res, next) => {
  const postCount = await Post.countDocuments({ user: req.user._id });
  const requestCount = await FriendRequest.countDocuments({
    $or: [{ receiver: req.user._id }, { sender: req.user._id }],
  });
  const friendsCount = await Friend.countDocuments({
    $or: [{ receiver: req.user._id }, { sender: req.user._id }],
  });
  res.status(201).json({
    success: true,
    msg: {
      name: req.user.name,
      bio: req.user.bio,
      profilePic: req.user.profilePic,
      postCount,
      requestCount,
      friendsCount,
    },
  });
};

const renderOtherUserProfile = async (req, res, next) => {
  const { profileId } = req.params;
  const postCount = await Post.countDocuments({ user: profileId });
  const requestCount = await FriendRequest.countDocuments({
    $or: [{ receiver: profileId }, { sender: profileId }],
  });
  const friendsCount = await Friend.countDocuments({
    $or: [{ receiver: profileId }, { sender: profileId }],
  });
  const user = await User.findById(profileId);
  res.status(201).json({
    success: true,
    msg: {
      name: user.name,
      bio: user.bio,
      profilePic: user.profilePic,
      postCount,
      requestCount,
      friendsCount,
    },
  });
};

const deleteAccount = async (req, res, next) => {
  try {
    await Friend.deleteMany({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    });

    await FriendRequest.deleteMany({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    });

    await Comment.deleteMany({ user: req.user._id });

    await Notification.deleteMany({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    });

    await Post.deleteMany({ user: req.user._id });

    if (req.user.picId !== undefined)
      await deleteFromCloudinary(req.user?.picId);
    await User.findByIdAndDelete(req.user._id);

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports.signUpUser = signUpUser;
module.exports.loginUser = loginUser;
module.exports.forgotPassword = forgotPassword;
module.exports.resetPassword = resetPassword;
module.exports.updateSettings = updateSettings;
module.exports.search = search;
module.exports.readSettings = readSettings;
module.exports.renderUserProfile = renderUserProfile;
module.exports.renderOtherUserProfile = renderOtherUserProfile;
module.exports.deleteAccount = deleteAccount;
