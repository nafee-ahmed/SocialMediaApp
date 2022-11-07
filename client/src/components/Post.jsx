import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import userImg from "../assets/UserImage.png";
import "../App.css";
import { AppState } from "../Contexts/AppContext";
import { useState } from "react";
import Comments from "./Comments";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { backendLink } from "../utils/constants";
import { toast } from "react-toastify";
import { useEffect } from "react";

function Post({
  text,
  image,
  userName,
  userInterest,
  profileFriend,
  owner,
  postId,
  numberOfLikes,
  postOwnerId,
  socket,
  numOfComments,
}) {
  const {
    friendRequestState: { reqStatus },
  } = AppState();
  const { profileID } = useParams();


  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(numberOfLikes || 0);
  const [commentNum, setCommentNum] = useState(numOfComments || 0);

  useEffect(() => {
    const verifyIsLiked = async () => {
      try {
        const res = await axios.post(
          backendLink + "/verify/liked",
          { postId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setIsLiked(res.data.msg);
      } catch (err) {
        console.log(err.response.data.message);
      }
    };
    verifyIsLiked();
    return () => setLoading(false);
  }, []);

  const likeHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        backendLink + "/add/like",
        { postId, numOfLikes, postOwnerId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setNumOfLikes((prev) => prev + 1);
      socket?.emit("sendNotification", { receiverId: postOwnerId });
    } catch (err) {
      toast.error(err.response.data.message, { toastId: "msg88" });
      console.log(err.response.data.message);
    }
    setIsLiked(true);
    setLoading(false);
  };

  return (
    <div className="post">
      {showComments && (
        <Comments
          setShowComments={setShowComments}
          postId={postId}
          postOwnerId={postOwnerId}
          setCommentNum={setCommentNum}
          commentNum={commentNum}
          socket={socket}
        />
      )}
      <div className="top-section">
        <Link to="" className="profile-link">
          <img src={owner || userImg} alt="" />
        </Link>

        <div>
          <h5>{userName}</h5>
          <span>{userInterest}</span>
        </div>

        <Link to="" className="more-link">
          {/* <i className="bi bi-three-dots-vertical"></i> */}
        </Link>
      </div>

      <span className="above-med-sect">{text}</span>

      <img className="medium-section" src={image} alt="" />

      {(profileFriend || !profileID || reqStatus === "Friends") &&
        (loading ? (
          <ClipLoader loading={true} color={`#4B81F1`} />
        ) : (
          <div className="bottom-section">
            <button
              type="button"
              className="action-post"
              onClick={(e) => likeHandler(e)}
              disabled={isLiked ? true : false}
            >
              <i className="bi bi-heart-fill"></i>
              <span>{numOfLikes || 0}</span>
            </button>

            <button
              type="button"
              className="action-post"
              onClick={() => setShowComments(!showComments)}
            >
              <i className="bi bi-chat-fill"></i>
              <span>{commentNum || 0}</span>
            </button>

            {/* <button type="button" className="action-post">
              <i className="bi bi-reply-fill"></i>
              <span>999</span>
            </button> */}
          </div>
        ))}
    </div>
  );
}

export default Post;
