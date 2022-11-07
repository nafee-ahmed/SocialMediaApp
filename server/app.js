if (process.env.NODE_ENV !== "production")
  require("dotenv").config({ path: "./config.env" });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http"); // http server for socket.io
const path = require("path");

const AppError = require("./utils/AppError");

const {
  signUpUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateSettings,
  search,
  readSettings,
  renderUserProfile,
  renderOtherUserProfile,
  deleteAccount,
} = require("./routes/user");
const {
  uploadPost,
  readProfilePosts,
  readUserPosts,
  readDashboardPosts,
  loadPostInfo,
  addLike,
  verifyIsLiked,
  loadNotifications,
  getUnseenNotificationCount,
  markNotificationsAsSeen,
  addComment,
  getComments,
} = require("./routes/post");
const {
  sendFriendRequest,
  verifyRequest,
  readRequests,
  declineRequest,
  acceptRequest,
  isProfileFriends,
  suggestFriends,
} = require("./routes/friend");
const { protect } = require("./utils/protect");
const socketio = require("./utils/socketio");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

const io = socketio.createSocket(server); // after creating server separating socketio logic to completely different file

app.post("/signup", signUpUser);
app.post("/login", loginUser);
app.post("/forgotpassword", forgotPassword);
app.post("/resetpassword/:resetToken", resetPassword);
app.post("/post/add", protect, uploadPost);
app.post("/post/profile/read", protect, readProfilePosts);
app.post("/search", protect, search);
app.post("/friendrequest/send", protect, sendFriendRequest);
app.post("/friendrequest/verify", protect, verifyRequest);
app.post("/friendrequests/read", protect, readRequests);
app.post("/friendrequests/decline", protect, declineRequest);
app.post("/friendrequests/accept", protect, acceptRequest);
app.post("/posts/user/read", protect, readUserPosts);
app.post("/friends/check", protect, isProfileFriends);
app.post("/posts/dashboard/read", protect, readDashboardPosts);

app.get("/settings/read", protect, readSettings);
app.post("/settings/update", protect, updateSettings);

app.get("/read/user/info", protect, renderUserProfile);
app.get("/read/otheruser/info/:profileId", protect, renderOtherUserProfile);
app.get("/suggest/friends", protect, suggestFriends);

app.post("/add/like", protect, addLike);
app.post("/verify/liked", protect, verifyIsLiked);

app.get("/notifications", protect, loadNotifications);
app.get("/notification/count", protect, getUnseenNotificationCount);
app.post("/mark/notifications/seen", protect, markNotificationsAsSeen);

app.post("/comments/add", protect, addComment);
app.get("/comments/:postId", protect, getComments);

app.post("/settings/delete", protect, deleteAccount);

app.use((req, res, next) => {
  // 404 error handler
  res.status(404).send("page not found");
});

app.use((err, req, res, next) => {
  console.log("from error handler: ", err);
  if (err.name === "ValidationError") {
    // perform additonal step to separate individual error messages for validation error
    const msg = Object.values(err.errors).map((val) => val.message); // Array of each error val. msg like 1 for password, 1 for email etc
    let dict = new Object();
    for (let m of msg) {
      dict[m.split(" ")[0]] = m; // pick first word from error message and make key and assign message to value from array
    }
    err = new AppError(dict, 400);
  }
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).json({ success: false, message });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/client/index.html"),
      function (err) {
        if (err) {
          res.status(500).send(err);
        }
      }
    );
  });
}

server.listen(process.env.PORT || 3001, () => {
  console.log(`listening on port ${process.env.PORT || 3000}`);
});
