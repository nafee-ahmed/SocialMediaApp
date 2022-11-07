const FriendRequest = require("../models/friendRequest");
const User = require("../models/user");
const Friend = require("../models/friend");
const AppError = require("../utils/AppError");

const sendFriendRequest = async (req, res, next) => {
  const { receiverID } = req.body;
  try {
    const receiver = await User.findById(receiverID);
    const requestSentBefore =
      (await FriendRequest.findOne({
        $and: [{ sender: req.user }, { receiver: receiver }],
      })) ||
      (await FriendRequest.findOne({
        $and: [{ sender: receiver }, { receiver: req.user }],
      }));
    if (requestSentBefore) throw new AppError("Request sent before", 401);

    const friendRequest = new FriendRequest({ isPending: true });
    friendRequest.sender = req.user;
    friendRequest.receiver = receiver;
    await friendRequest.save();

    await User.findByIdAndUpdate(receiverID, {
      //new
      $push: { friendRequests: req.user },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { requestsSent: receiverID },
    });

    res.status(201).json({ success: true, msg: "friend request sent" });
  } catch (err) {
    next(err);
  }
};

const verifyRequest = async (req, res, next) => {
  const { receiverID } = req.body;
  try {
    const receiver = await User.findById(receiverID);
    const friendRequestSent =
      (await FriendRequest.findOne({
        $and: [{ sender: req.user }, { receiver: receiver }],
      })) ||
      (await FriendRequest.findOne({
        $and: [{ sender: receiver }, { receiver: req.user }],
      }));
    const friends =
      (await Friend.findOne({
        $and: [{ sender: req.user }, { receiver: receiver }],
      })) ||
      (await Friend.findOne({
        $and: [{ sender: receiver }, { receiver: req.user }],
      }));
    if (friendRequestSent) {
      res.status(201).json({ success: true, msg: "Pending" });
    } else if (friends) {
      res.status(201).json({ success: true, msg: "Friends" });
    } else {
      res.status(201).json({ success: false, msg: "not sent or friends" });
    }
  } catch (err) {
    next(err);
  }
};

const readRequests = async (req, res, next) => {
  try {
    const requests = await FriendRequest.find({
      $and: [{ receiver: req.user }, { isPending: true }],
    }).populate("sender", "-password");
    res.status(201).json({ success: true, requests });
  } catch (err) {
    next(err);
  }
};

const declineRequest = async (req, res, next) => {
  const { senderID } = req.body;
  try {
    const sender = await User.findById(senderID);
    const request = await FriendRequest.findOne({
      $and: [{ sender }, { receiver: req.user }],
    });
    console.log(request);
    const delRequest = await FriendRequest.findByIdAndDelete(request._id);

    await User.findByIdAndUpdate(req.user._id, {
      // new
      $pull: { friendRequests: senderID },
    });
    await User.findByIdAndUpdate(senderID, {
      $pull: { requestsSent: req.user._id },
    });

    const requests = await FriendRequest.find({
      $and: [{ receiver: req.user }, { isPending: true }],
    }).populate("sender", "-password");
    res.status(201).json({ success: true, requests });
  } catch (err) {
    next(err);
  }
};

const acceptRequest = async (req, res, next) => {
  const { senderID } = req.body;
  try {
    const sender = await User.findById(senderID);
    const friend = new Friend({ isBlocked: false });
    friend.receiver = req.user;
    friend.sender = sender;
    await friend.save();

    await User.findByIdAndUpdate(senderID, { $push: { friends: req.user } });
    await User.findByIdAndUpdate(req.user._id, { $push: { friends: sender } });

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { friendRequests: senderID },
    });
    await User.findByIdAndUpdate(senderID, {
      $pull: { requestsSent: req.user._id },
    }); // new

    const request = await FriendRequest.findOne({
      $and: [{ sender }, { receiver: req.user }],
    });
    const delRequest = await FriendRequest.findByIdAndDelete(request._id);
    const requests = await FriendRequest.find({
      $and: [{ receiver: req.user }, { isPending: true }],
    }).populate("sender", "-password");
    res.status(201).json({ success: true, requests });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const isProfileFriends = async (req, res, next) => {
  const { userID } = req.body;
  try {
    const receiver = await User.findById(userID);
    const friends =
      (await Friend.findOne({
        $and: [{ sender: req.user }, { receiver: receiver }],
      })) ||
      (await Friend.findOne({
        $and: [{ sender: receiver }, { receiver: req.user }],
      }));
    if (friends) {
      res.status(201).json({ success: true, msg: "friends" });
    } else {
      res.status(201).json({ success: false, msg: "not friends" });
    }
  } catch (err) {
    next(err);
  }
};

const suggestFriends = async (req, res, next) => {
  // take notice of it not being friends and also request not pending
  try {
    const sameInterests = await User.find({
      $and: [
        { interest: req.user.interest },
        { _id: { $ne: req.user._id } },
        { friends: { $ne: req.user._id } },
        { friendRequests: { $ne: req.user._id } },
        { requestsSent: { $ne: req.user._id } },
      ],
    }).limit(2);

    res.status(201).json({ success: false, msg: sameInterests });
  } catch (error) {
    next(error);
  }
};

module.exports.sendFriendRequest = sendFriendRequest;
module.exports.verifyRequest = verifyRequest;
module.exports.readRequests = readRequests;
module.exports.declineRequest = declineRequest;
module.exports.acceptRequest = acceptRequest;
module.exports.isProfileFriends = isProfileFriends;
module.exports.suggestFriends = suggestFriends;
