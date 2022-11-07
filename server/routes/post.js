const { cloudinary } = require("../utils/cloudinary"); // cloudinary config
const mongoose = require("mongoose");

const Post = require("../models/post");
const Friend = require("../models/friend");

const { pagenate } = require("../utils/pagenate");
const AppError = require("../utils/AppError");
const Notification = require("../models/notification");
const Comment = require("../models/comment");

async function uploadPost(req, res, next) {
  try {
    let finalImg;
    if (req.body.image) {
      const image = req.body.image;
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: `${process.env.CLOUDINARY_UPLOAD_PRESET}`,
      });
      finalImg = uploadedResponse.url;
    } else {
      finalImg = undefined;
    }
    const text = req.body.postCaption || undefined;
    const post = new Post({ text, image: finalImg });
    post.user = req.user;
    await post.save();
    res.status(201).json({ success: true, msg: req.body });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function readProfilePosts(req, res, next) {
  console.log("user", req.user._id);
  try {
    const posts = await Post.find({ user: req.user._id })
      .populate("user")
      .sort({ _id: -1 });
    // console.log('posts', posts);
    res.status(201).json({ success: true, posts });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function readUserPosts(req, res, next) {
  const { userID } = req.body;
  try {
    let posts = await Post.find({ user: userID })
      .populate("user")
      .populate("likingUsers")
      .sort({ _id: -1 });
    res.status(201).json({ success: true, posts });
  } catch (err) {
    next(err);
  }
}

async function readDashboardPosts(req, res, next) {
  const { pageNumber, limit } = req.body;
  try {
    const userFriends = await Friend.find({
      $or: [{ sender: req.user }, { receiver: req.user }],
    });
    const filteredFriends = [];
    for (const userFriend of userFriends) {
      if (userFriend.sender.toString() === req.user._id.toString())
        filteredFriends.push(userFriend.receiver);
      if (userFriend.receiver.toString() === req.user._id.toString())
        filteredFriends.push(userFriend.sender);
    }

    const posts = await Post.find({ user: { $in: filteredFriends } }).populate(
      "user"
    ); // console.logging user friends' posts

    const pagenatedRes = pagenate(posts, pageNumber, limit);
    const pagenatedPosts = pagenatedRes.pagenatedModel;
    const nextIndex = pagenatedRes.nextIndex;
    res.status(201).json({ success: true, posts: posts, nextIndex });
  } catch (err) {
    next(err);
  }
}

const addLike = async (req, res, next) => {
  const { postId, numOfLikes, postOwnerId } = req.body;
  try {
    const post = await Post.findById(postId);
    const alreadyLiked = post.likingUsers.some((l) => l.equals(req.user._id));
    if (alreadyLiked) throw new AppError("Only 1 like by a user allowed", 401);
    const result = await Post.findByIdAndUpdate(
      postId,
      { $push: { likingUsers: req.user._id }, numberOfLikes: numOfLikes + 1 },
      { new: true }
    );
    const notification = new Notification({
      text: "Someone liked your post",
      type: "like",
      seen: false,
    });
    notification.post = postId;
    notification.sender = req.user;
    notification.receiver = postOwnerId;
    await notification.save();
    res.status(201).json({ success: true, msg: result });
  } catch (err) {
    next(err);
  }
};

const verifyIsLiked = async (req, res, next) => {
  const { postId } = req.body;
  const userId = req.body.userId || req.user._id;
  try {
    const post = await Post.findById(postId);
    const alreadyLiked =
      post.likingUsers.some((l) => l.equals(userId)) ||
      post.user[0].equals(req.user._id);
    res.status(201).json({ success: true, msg: alreadyLiked });
  } catch (err) {
    next(err);
  }
};

const loadNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user._id,
    })
      .populate("post")
      .populate("sender");
    const unseenCount = await Notification.countDocuments({ seen: false });
    res.status(201).json({ success: true, msg: notifications, unseenCount });
  } catch (error) {
    next(error);
  }
};

const getUnseenNotificationCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      seen: false,
      receiver: req.user._id,
    });
    res.status(201).json({ success: true, msg: count });
  } catch (error) {
    next(error);
  }
};

const markNotificationsAsSeen = async (req, res, next) => {
  try {
    const notifications = await Notification.updateMany(
      { seen: false },
      { $set: { seen: true } },
      { new: true }
    );
    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const storeNotification = async (
  text,
  type,
  seen,
  postId,
  sender,
  postOwnerId
) => {
  const notification = new Notification({
    text: text,
    type: type,
    seen: seen,
  });
  notification.post = postId;
  notification.sender = sender;
  notification.receiver = postOwnerId;
  await notification.save();
};

const addComment = async (req, res, next) => {
  const { commentText, postId, postOwnerId, commentNum } = req.body;
  try {
    const comment = new Comment({
      text: commentText,
      user: req.user._id,
      post: postId,
    });
    const savedComment = await comment.save();
    await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: savedComment },
        numberOfComments: commentNum + 1,
      },
      { new: true }
    );

    if (postOwnerId.toString() !== req.user._id.toString())
      await storeNotification(
        `Someone says ${commentText}`,
        "comment",
        false,
        postId,
        req.user,
        postOwnerId
      );

    res.status(201).json({ success: true, msg: savedComment });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const comment = await Comment.find({ post: postId })
      .populate("post")
      .populate("user");
    console.log(comment);
    res.status(201).json({
      success: true,
      msg: comment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.uploadPost = uploadPost;
module.exports.readProfilePosts = readProfilePosts;
module.exports.readUserPosts = readUserPosts;
module.exports.readDashboardPosts = readDashboardPosts;
module.exports.verifyIsLiked = verifyIsLiked;
module.exports.addLike = addLike;
module.exports.loadNotifications = loadNotifications;
module.exports.getUnseenNotificationCount = getUnseenNotificationCount;
module.exports.markNotificationsAsSeen = markNotificationsAsSeen;
module.exports.addComment = addComment;
module.exports.getComments = getComments;
