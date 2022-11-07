import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import userImg from "../assets/UserImage.png";
import useFetch from "../hooks/useFetch";
import ClipLoader from "react-spinners/ClipLoader";
import { AppState } from "../Contexts/AppContext";
import { backendLink } from "../utils/constants";

function Comments({
  setShowComments,
  postId,
  postOwnerId,
  commentNum,
  setCommentNum,
  socket,
}) {
  const {
    userState: { profilePic },
  } = AppState();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const { data, error, loading } = useFetch(`/comments/${postId}`);
  console.log(data.msg);
  useEffect(() => {
    setComments(data?.msg);
  }, [data]);

  const addCommentHandler = async (e) => {
    e.preventDefault();

    if (commentText !== "") {
      try {
        const res = await axios.post(
          backendLink + "/comments/add",
          { commentText, postId, postOwnerId, commentNum },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        setComments((prev) => [...prev, res.data?.msg]);
        setCommentText("");
        setCommentNum((prev) => prev + 1);
        socket?.emit("sendNotification", { receiverId: postOwnerId });
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  };

  return (
    <div className="comments">
      <div className="btn-container">
        <button className="cancel-btn" onClick={() => setShowComments(false)}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      <div className="comments-and-inputs">
        <div className="all-comments">
          {loading && !data.msg ? (
            <ClipLoader loading={true} color={`#4B81F1`} />
          ) : (
            comments?.map((comment) => (
              <div className="comment-item" key={comment._id}>
                <img src={comment.user[0].profilePic || userImg} alt="" />
                <div className="name-and-comment-item">
                  <span className="name">{comment.user[0].name}</span>
                  <span className="comment-text">{comment.text}</span>
                </div>
              </div>
            ))
          )}
          {comments?.length === 0 && (
            <div style={{ textAlign: "center" }}>No one commented yet!</div>
          )}
        </div>
        <div className="form-container">
          <form onSubmit={(e) => addCommentHandler(e)}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
            <button type="submit">
              <i className="bi bi-send"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Comments;
