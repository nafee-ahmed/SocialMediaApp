import React, { useContext, useEffect } from "react";
import "../App.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import FriendRequest from "./FriendRequest";
import { AppState } from "../Contexts/AppContext";
import { backendLink } from "../utils/constants";


function FriendRequests({ setShowFriendRequests }) {
  const { profileID } = useParams();
  const { verifyRequest } = AppState();

  const {
    friendRequestState: { requests },
    friendRequestDispatch,
    readRequests,
    userDispatch
  } = AppState();

  async function declineRequestHandler(senderID) {
    try {
      const res = await axios.post(
        backendLink + "/friendrequests/decline",
        { senderID },
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
      if (profileID) verifyRequest(profileID);
      userDispatch({ type: "UPDATE_USER_PROFILE_AFTER_REQUEST_DECLINED" });

    } catch (err) {
      console.log(err.response.data.message);
    }
  }
  useEffect(() => {
    readRequests();
  }, []);

  async function acceptRequestHandler(senderID) {
    try {
      const res = await axios.post(
        backendLink + "/friendrequests/accept",
        { senderID },
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
      if (profileID) verifyRequest(profileID);
      userDispatch({ type: "UPDATE_USER_PROFILE_AFTER_REQUEST_ACCEPTED" });
    } catch (err) {
      console.error(err);
    }
  }

  requests && Array.from(requests);
  return (
    <div className="friend-request-panel">
      <button
        className="cancel-container"
        onClick={() => setShowFriendRequests(false)}
      >
        <i className="bi bi-x-lg"></i>
      </button>

      <p>Friend Requests</p>
      <div className="friend-requests">
        {requests.length > 0 ? (
          requests.map((request) => (
            <FriendRequest
              request={request}
              declineRequestHandler={declineRequestHandler}
              acceptRequestHandler={acceptRequestHandler}
              key={request._id}
            />
          ))
        ) : (
          <div className="no-new-req">Nothing to display</div>
        )}

        {/* <button onClick={() => readRequests()}>Reload Requests</button> */}
      </div>
    </div>
  );
}

export default FriendRequests;
