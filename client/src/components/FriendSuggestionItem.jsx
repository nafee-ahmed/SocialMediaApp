import React from "react";
import userImg from "../assets/UserImage.png";
import { Link } from "react-router-dom";
import { AppState } from "../Contexts/AppContext";
import axios from "axios";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { backendLink } from "../utils/constants";


function FriendSuggestionItem({ item, socket }) {
  const { verifyRequest } = AppState();
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function addFriendHandler(e, userID) {
    e.preventDefault();
    setIsLoading(true);
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
      setIsRequestSent(true);
    } catch (err) {
      console.error(err);
      setIsError(true);
    }
    setIsLoading(false);
  }
  return isError ? (
    "Something went wrong"
  ) : (
    <div className="friend-suggestion">
      <div className="second-child">
        <img src={item.profilePic || userImg} alt="" />
        <div>
          <Link to="" className="profile-link">
            {item.name}
          </Link>
          <span>You both like {item.interest}</span>
          {isRequestSent ? (
            <button disabled={true}>Pending</button>
          ) : isLoading ? (
            <ClipLoader loading={true} color={`#4B81F1`} />
          ) : (
            <button onClick={(e) => addFriendHandler(e, item._id)}>
              Add Friend
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendSuggestionItem;
