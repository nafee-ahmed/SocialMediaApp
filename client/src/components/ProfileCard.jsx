import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import userImg from "../assets/UserImage.png";
import { AppState } from "../Contexts/AppContext";
import { backendLink } from "../utils/constants";


function ProfileCard({
  userID,
  socket,
  name,
  bio,
  profilePic,
  postCount,
  friendsCount,
  requestCount,
}) {
  const navigate = useNavigate();
  const {
    friendRequestState: { isReqSent, reqStatus },
    friendRequestDispatch,
    verifyRequest,
  } = AppState();

  async function addFriendHandler(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        backendLink + "/friendrequest/send",
        { receiverID: userID },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      socket.emit("friendRequestSent", { receiverID: userID });

      await verifyRequest(userID);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (userID) {
      verifyRequest(userID);
    }
  }, [userID]);

  return (
    <div className="profile-card">
      <div className="top-child">
        <img src={profilePic || userImg} alt="" />
        <span className="my-name">{name || "XXXX"}</span>
        <span className="my-bio">{bio || "XXXX"}</span>
      </div>

      <div className="second-child">
        <hr />
      </div>

      <div className="third-child">
        <div>
          <span className="count-num">{postCount || 0}</span>
          <span className="count-label">Photos</span>
        </div>
        <div>
          <span className="count-num">{friendsCount || 0}</span>
          <span className="count-label">Friends</span>
        </div>
        <div>
          <span className="count-num">{requestCount || 0}</span>
          <span className="count-label">Requests</span>
        </div>
      </div>

      <div className="fourth-child">
        {userID ? (
          isReqSent ? (
            <button disabled={true}>{reqStatus}</button>
          ) : (
            <button onClick={(e) => addFriendHandler(e)}>{reqStatus}</button>
          )
        ) : (
          <button type="button" onClick={() => navigate("/settings")}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
