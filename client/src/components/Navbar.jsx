import React, { useEffect, useState } from "react";
import "../App.css";
import { Link, useLocation, useMatch, useNavigate } from "react-router-dom";
import userImg from "../assets/UserImage.png";
import NotificationPanel from "./NotificationPanel";
import FriendRequests from "./FriendRequests";
import { AppState } from "../Contexts/AppContext";

function Navbar({ setShowPostForm, showPostForm, socket }) {
  const {
    userState: { profilePic },
  } = AppState();

  const [inactive, setInactive] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);

  const [selected, setSelected] = useState("");
  const [hovered, setHovered] = useState("");

  const {
    friendRequestState: { requests },
    notificationState: { unseenCount },
    getUnseenNotificationCount,
    readRequests,
  } = AppState();

  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout(e) {
    e.preventDefault();
    socket?.emit("userLeft", localStorage.getItem("authToken"));
    localStorage.clear();
    navigate("/login");
  }

  async function friendRequestClickHandler(e) {
    e.preventDefault();
    setShowFriendRequests(!showFriendRequests);
  }

  useEffect(() => {
    readRequests();
    getUnseenNotificationCount();
    if (location.pathname === "/") setSelected("home");
    else if (location.pathname === "/profile") setSelected("profile");
    else if (location.pathname === "/settings") setSelected("settings");
  }, []);

  return (
    <>
      <div
        className={inactive ? "navbar inactive" : "navbar"}
        onMouseEnter={() => setInactive(!inactive)}
        onMouseLeave={() => setInactive(true)}
      >
        <div
          className="top-section"
          onClick={() => setShowPostForm(!showPostForm)}
          onMouseEnter={() => setHovered("createpost")}
          onMouseLeave={() => setHovered("")}
        >
          {showPostForm ? (
            <i className="bi bi-dash-circle-fill"></i>
          ) : (
            <i className="bi bi-plus-circle-fill"></i>
          )}
          <span className={hovered === "createpost" ? "underline" : ""}>
            Create Post
          </span>
        </div>

        <div className="medium-section">
          <ul>
            <li>
              <Link
                to="/"
                className={
                  selected === "home" ? `medium-link selected` : `medium-link`
                }
                onMouseEnter={() => setHovered("home")}
                onMouseLeave={() => setHovered("")}
              >
                <div>
                  <i className="bi bi-grid-1x2"></i>
                </div>
                <span className={hovered === "home" ? "underline" : ""}>
                  Dashboard
                </span>
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className={
                  selected === "profile"
                    ? "medium-link selected"
                    : "medium-link"
                }
                onMouseEnter={() => setHovered("profile")}
                onMouseLeave={() => setHovered("")}
              >
                <div>
                  <i className="bi bi-person"></i>
                </div>
                <span className={hovered === "profile" ? "underline" : ""}>
                  Profile
                </span>
              </Link>
            </li>

            <li>
              <Link
                to=""
                className="medium-link notification"
                onClick={() => setShowNotification(!showNotification)}
                onMouseEnter={() => setHovered("notification")}
                onMouseLeave={() => setHovered("")}
              >
                <div className="notification-div">
                  <span className="notification-num">{unseenCount}</span>
                  <i className="bi bi-bell"></i>
                </div>
                <span className={hovered === "notification" ? "underline" : ""}>
                  Notification
                </span>
              </Link>
            </li>

            <li>
              <Link
                to=""
                className="medium-link fr"
                onClick={(e) => friendRequestClickHandler(e)}
                onMouseEnter={() => setHovered("request")}
                onMouseLeave={() => setHovered("")}
              >
                <div className="fr-div">
                  <span className="fr-num">{requests.length}</span>
                  <i className="bi bi-people"></i>
                </div>
                <span className={hovered === "request" ? "underline" : ""}>
                  Requests
                </span>
              </Link>
            </li>

            <li>
              <Link
                to="/settings"
                className={
                  selected === "settings"
                    ? "medium-link selected"
                    : "medium-link"
                }
                onMouseEnter={() => setHovered("settings")}
                onMouseLeave={() => setHovered("")}
              >
                <div>
                  <i className="bi bi-gear"></i>
                </div>
                <span className={hovered === "settings" ? "underline" : ""}>
                  Settings
                </span>
              </Link>
            </li>

            <li>
              <Link
                to=""
                className="medium-link"
                onClick={(e) => handleLogout(e)}
                onMouseEnter={() => setHovered("logout")}
                onMouseLeave={() => setHovered("")}
              >
                <div>
                  <i className="bi bi-door-closed"></i>
                </div>
                <span className={hovered === "logout" ? "underline" : ""}>
                  Logout
                </span>
              </Link>
            </li>
          </ul>
        </div>
        <Link to="/settings" className="profile-link">
          <div className="bottom-section">
            <img src={profilePic || userImg} alt="" />
          </div>
        </Link>
      </div>
      {showNotification ? (
        <NotificationPanel setShowNotification={setShowNotification} />
      ) : (
        ""
      )}
      {showFriendRequests ? (
        <FriendRequests
          setShowFriendRequests={setShowFriendRequests}
          socket={socket}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default Navbar;
