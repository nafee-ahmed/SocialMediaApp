import axios from "axios";
import { useReducer } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { friendRequestReducer } from "../Reducers/FriendRequestReducer";
import { notificationReducer } from "../Reducers/NotificationReducer";
import { postReducer } from "../Reducers/PostReducer";
import { userReducer } from "../Reducers/UserReducer";
import { backendLink } from "../utils/constants";

const AppContext = createContext();

function AppProvider({ children }) {
  const [friendRequestState, friendRequestDispatch] = useReducer(
    friendRequestReducer,
    {
      isReqSent: false,
      reqStatus: "",
      requests: [],
    }
  );

  const [postState, postDispatch] = useReducer(postReducer, {
    posts: [],
    friendPosts: [],

    previewSource: "",
    postCaption: "",
    postFeed: "",
    fileInputState: "",
  });

  const [userState, userDispatch] = useReducer(userReducer, {
    name: "",
    bio: "",
    profilePic: "",
    postCount: "",
    friendsCount: "",
    requestCount: "",
  });

  const [notificationState, notificationDispatch] = useReducer(
    notificationReducer,
    {
      notificationRefresh: true,
      unseenCount: 0
    }
  );

  async function verifyRequest(userID) {
    try {
      const res = await axios.post(
        backendLink + "/friendrequest/verify",
        { receiverID: userID },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      // const requestStatus = res.data.success;
      if (res.data.msg === "Pending" || res.data.msg === "Friends") {
        friendRequestDispatch({ type: "FRIEND_REQ_SENT" });
        friendRequestDispatch({
          type: "FRIENDS_OR_PENDING_MESSAGE",
          payload: res.data.msg,
        });
      } else {
        friendRequestDispatch({ type: "FRIEND_REQ_NOT_SENT" });
        friendRequestDispatch({
          type: "ADD_FRIENDS_MESSAGE",
          payload: "Add Friend",
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function readRequests() {
    console.log("requests reloaded");
    try {
      const res = await axios.post(
        backendLink + "/friendrequests/read",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      friendRequestDispatch({
        type: "ADD_FRIEND_REQUESTS",
        payload: res.data.requests,
      });
      console.log("navbar read requests", res.data.requests);
    } catch (err) {
      console.log(err.response.data.message);
    }
  }

  async function readPosts() {
    try {
      const res = await axios.post(backendLink + "/post/profile/read", "", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      postDispatch({ type: "SET_POSTS", payload: res.data.posts });
    } catch (err) {
      console.log(err);
      console.log(err.response.data.message);
    }
  }

  async function addPostHandler(
    e,
    postCaption,
    previewSource,
    setIsAddPostLoading
  ) {
    e.preventDefault();
    setIsAddPostLoading(true);
    try {
      const res = await axios.post(
        backendLink + "/post/add",
        { postCaption, image: previewSource },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(res.data);
      postDispatch({ type: "SET_STATES_AFTER_POST_ADDED" });
      setIsAddPostLoading(false);
      readPosts();
      userDispatch({ type: "UPDATE_USER_PROFILE_AFTER_POST_ADDED" });
    } catch (err) {
      postDispatch({
        type: "SET_POST_FEED",
        payload: err.response.data.message,
      });
    }
    setTimeout(function () {
      postDispatch({
        type: "SET_POST_FEED",
        payload: "",
      });
    }, 5000);
  }

  const getUnseenNotificationCount = async () => {
    try {
      const res = await axios.get(backendLink + "/notification/count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      notificationDispatch({
        type: "UPDATE_UNSEEN_MESSAGES",
        payload: res.data?.msg,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        friendRequestState,
        friendRequestDispatch,
        postState,
        postDispatch,
        verifyRequest,
        readRequests,
        readPosts,
        addPostHandler,
        userState,
        userDispatch,
        notificationState,
        notificationDispatch,
        getUnseenNotificationCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;

export const AppState = () => {
  return useContext(AppContext);
};
