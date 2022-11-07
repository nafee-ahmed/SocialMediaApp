const { Server } = require("socket.io");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

let onlineUsers = [];

const findUserFromJWT = async (jwtToken) => {
  const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id); // in users models, we stored the id in jwt token, so we find user through it
  if (!user) {
    return "No user found with this ID";
  } else {
    return user;
  }
};

const addNewUser = (userID, socketID) => {
  onlineUsers.map((user) => {
    if (user.socketID === socketID) return;
  });
  onlineUsers.push({ userID, socketID });
};

const removeUser = (socketID) => {
  onlineUsers = onlineUsers.filter((user) => user.socketID !== socketID);
};

const getUsers = (userID) => {
  return onlineUsers.filter((user) => user.userID.equals(userID));
};

const printUsers = () => {
  onlineUsers.map((onlineUser) => console.log(onlineUser));
};

module.exports = {
  createSocket: (server) => {
    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", async (socket) => {
      socket.on("newUser", async (jwtToken) => {
        const user = await findUserFromJWT(jwtToken);
        addNewUser(user._id, socket.id);
        console.log("connect print");
        printUsers();
      });

      socket.on("friendRequestSent", ({ receiverID }) => {
        const receivers = getUsers(mongoose.Types.ObjectId(receiverID));
        console.log("received fr from client", socket.id);
        receivers.map((receiver) => console.log(receiver.socketID));
        receivers.map((receiver) =>
          io.to(receiver.socketID).emit("notifyFriendRequest")
        );
      });

      socket.on("sendNotification", ({ receiverId }) => {
        const receivers = getUsers(mongoose.Types.ObjectId(receiverId));
        receivers.map((receiver) =>
          io.to(receiver.socketID).emit("notifyNotification")
        );
      });

      socket.on("userLeft", async (jwtToken) => {
        removeUser(socket.id);
        console.log("user logout print");
        printUsers();
      });

      socket.on("disconnect", async () => {
        removeUser(socket.id);
        console.log("disconnect print");
        printUsers();
      });
    });
    return io;
  },
};
