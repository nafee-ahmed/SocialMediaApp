import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "../App.css";
import TopNavbar from "../components/TopNavbar";
import Posts from "../components/Posts";
import ProfileCard from "../components/ProfileCard";
import FriendSuggestions from "../components/FriendSuggestions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import ClipLoader from "react-spinners/ClipLoader";
import { AppState } from "../Contexts/AppContext";
import useFetch from "../hooks/useFetch";
import { backendLink } from "../utils/constants";


function HomeScreen({ socket, setSocket }) {
  const {
    postState: { friendPosts },
    postDispatch,
    userState: { name, bio, profilePic, postCount, friendsCount, requestCount },
    userDispatch,
  } = AppState();

  const { data, error, loading } = useFetch("/read/user/info");
  useEffect(() => {
    userDispatch({ type: "CLEAR_USER_INFO" });
    userDispatch({ type: "SET_USER_INFO", payload: data?.msg });
  }, [data]);

  const [showPostForm, setShowPostForm] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  const readDashboardPosts = async (mode = "ADD_FRIENDS_POSTS") => {
    // rendering posts of friends
    let limit = 4;
    try {
      const res = await axios.post(
        backendLink + "/posts/dashboard/read",
        { pageNumber, limit },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      postDispatch({
        type: `${mode}`,
        payload: res.data.posts,
      });
      setHasMore(res.data.nextIndex);
      setPageNumber(pageNumber + 1);
    } catch (err) {
      console.log(err.response.data.message);
      // console.error(err);
    }
    // console.log("infinite scroll requested");
  };

  useEffect(() => {
    if (
      localStorage.getItem("authToken") &&
      !localStorage.getItem("showedLoginStatus")
    ) {
      toast.success("Login successful!");
      localStorage.setItem("showedLoginStatus", "showed");
    }
    readDashboardPosts("SET_FRIENDS_POSTS");
  }, []);

  useEffect(() => {
    socket?.emit("newUser", localStorage.getItem("authToken"));
    localStorage.setItem("socket", socket);
  }, [socket]);

  return (
    <div className="home-screen">
      <ToastContainer />
      <Navbar
        setShowPostForm={setShowPostForm}
        showPostForm={showPostForm}
        socket={socket}
        setSocket={setSocket}
      />
      <div className="routes-container">
        <div className="homescreen-container">
          <div className="posts" id="posts">
            {friendPosts.length == 0 ? (
              <p className="no-posts-showing">
                Add more friends<br></br> and wait for them to post something...
              </p>
            ) : (
              // <InfiniteScroll
              //   dataLength={friendPosts.length}
              //   next={readDashboardPosts}
              //     hasMore={hasMore}
              //   loader={
              //     <span style={{ color: `#4B81F1` }}>
              //       <ClipLoader loading={true} color={`#4B81F1`} /> Scroll ⬇️
              //     </span>
              //   }
              // >
                <Posts postsOf="friends" socket={socket} />
              /* </InfiniteScroll> */
            )}
          </div>
          <div className="right-homescreen-container">
            <TopNavbar
              setShowPostForm={setShowPostForm}
              showPostForm={showPostForm}
              showSearchBar={showSearchBar}
              setShowSearchBar={setShowSearchBar}
            />

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
            <FriendSuggestions socket={socket} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
