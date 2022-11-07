import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FriendSuggestions from "../components/FriendSuggestions";
import Navbar from "../components/Navbar";
import Posts from "../components/Posts";
import ProfileCard from "../components/ProfileCard";
import TopNavbar from "../components/TopNavbar";
import { AppState } from "../Contexts/AppContext";
import useFetch from "../hooks/useFetch";
import { backendLink } from "../utils/constants";


function UserProfileScreen({ socket, setSocket }) {
  const {
    postState: { posts },
    postDispatch,
  } = AppState();
  const { profileID } = useParams();
  const [showPostForm, setShowPostForm] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const [profileFriend, setProfileFriend] = useState(false);
  const [otherUserInfo, setOtherUserInfo] = useState({});

  const readUserPosts = useCallback(async function (profileID) {
    try {
      const res = await axios.post(
        backendLink + "/posts/user/read",
        { userID: profileID },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(res.data);
      postDispatch({ type: "SET_POSTS", payload: res.data.posts });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const isProfileFriends = useCallback(
    async function () {
      try {
        const res = await axios.post(
          backendLink + "/friends/check",
          { userID: profileID },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setProfileFriend(res.data.success);
      } catch (err) {
        console.error(err);
      }
    },
    [profileID]
  );

  const { data, loading, error } = useFetch(
    `/read/otheruser/info/${profileID}`
  );
  useEffect(() => {
    setOtherUserInfo(data?.msg);
  }, [data]);

  useEffect(() => {
    try {
      readUserPosts(profileID);
      isProfileFriends();
    } catch (error) {
      console.error(error);
    }
  }, [profileID, readUserPosts, isProfileFriends]);

  return (
    <div>
      <div className="profile-screen">
        <Navbar
          showPostForm={showPostForm}
          setShowPostForm={setShowPostForm}
          socket={socket}
          setSocket={setSocket}
        />
        <TopNavbar
          showPostForm={showPostForm}
          setShowPostForm={setShowPostForm}
          showSearchBar={showSearchBar}
          setShowSearchBar={setShowSearchBar}
        />

        <div className="profile-screen-sub-container">
          <div className="left-container">
            <ProfileCard
              userID={profileID}
              socket={socket}
              setSocket={setSocket}
              name={otherUserInfo?.name}
              bio={otherUserInfo?.bio}
              profilePic={otherUserInfo?.profilePic}
              postCount={otherUserInfo?.postCount}
              friendsCount={otherUserInfo?.friendsCount}
              requestCount={otherUserInfo?.requestCount}
            />
            <div className="friend-suggs">
              <FriendSuggestions />
            </div>
          </div>

          <div className="right-container">
            <div>User's Posts</div>
            <Posts profileFriend={profileFriend} socket={socket} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileScreen;
