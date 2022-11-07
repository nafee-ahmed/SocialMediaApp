import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../App.css";
import ProfileCard from "../components/ProfileCard";
import TopNavbar from "../components/TopNavbar";
import Posts from "../components/Posts";
import FriendSuggestions from "../components/FriendSuggestions";
import "../App.css";
import { AppState } from "../Contexts/AppContext";
import useFetch from "../hooks/useFetch";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer } from "react-toastify";

function ProfileScreen({ socket, setSocket }) {
  const {
    readPosts,
    userState: { name, bio, profilePic, postCount, friendsCount, requestCount },
    userDispatch,
  } = AppState();
  const [showPostForm, setShowPostForm] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const { data, error, loading } = useFetch("/read/user/info");
  useEffect(() => {
    userDispatch({ type: "CLEAR_USER_INFO" });
    userDispatch({ type: "SET_USER_INFO", payload: data?.msg });
  }, [data]);

  useEffect(() => {
    readPosts();
  }, []);

  return (
    <div className="profile-screen">
      <ToastContainer />
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
          {loading ? (
            <ClipLoader loading={true} color={`#4B81F1`} />
          ) : (
            <ProfileCard
              socket={socket}
              name={name}
              bio={bio}
              profilePic={profilePic}
              postCount={postCount}
              friendsCount={friendsCount}
              requestCount={requestCount}
            />
          )}
          <div className="friend-suggs">
            <FriendSuggestions socket={socket} />
          </div>
        </div>

        <div className="right-container">
          <div>Your Posts</div>
          <Posts socket={socket} />
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
