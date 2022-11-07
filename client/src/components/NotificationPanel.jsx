import React from "react";
import "../App.css";
import userImg from "../assets/UserImage.png";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useEffect } from "react";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { AppState } from "../Contexts/AppContext";
import axios from "axios";
import { backendLink } from "../utils/constants";

function NotificationPanel({ setShowNotification }) {
  const {
    notificationState: { notificationRefresh },
    notificationDispatch,
  } = AppState();

  const [notifications, setNotifications] = useState([]);
  const { data, error, loading, reFetch } = useFetch("/notifications");

  useEffect(() => {
    const markNotificationsAsSeen = async () => {
      try {
        await axios.post(
          backendLink + "/mark/notifications/seen",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        notificationDispatch({ type: "UPDATE_UNSEEN_MESSAGES", payload: 0 });
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    markNotificationsAsSeen();
  }, []);

  useEffect(() => {
    setNotifications(data?.msg);
  }, [data]);

  useEffect(() => {
    const reloadNotifications = () => {
      reFetch();
    };
    reloadNotifications();
  }, [notificationRefresh]);

  return (
    <div className="notification-panel">
      <button onClick={() => setShowNotification(false)}>
        <i className="bi bi-x-lg"></i>
      </button>

      <p>Notifications</p>

      <div className="notifications">
        {loading && !data.msg ? (
          <ClipLoader loading={true} color={`#4B81F1`} />
        ) : (
          notifications?.map((d) => (
            <div className="notification" key={d._id}>
              <img src={d.sender[0]?.profilePic || userImg} alt="" />
              <div>
                <span className="notification-head">
                  <Link to="/profile" className="notification-head-link">
                    {d.text}
                  </Link>
                </span>
                <div>
                  <span className="notification-date">
                    From {d.sender[0].name}
                  </span>
                  {/* {d.type === "comment" && (
                    <>
                      <span>
                        {" "}
                        <i className="bi bi-dot"></i>{" "}
                      </span>
                      <span className="notification-time">9 AM</span>
                    </>
                  )} */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;
