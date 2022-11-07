import React, { useState } from "react";
import "../App.css";
import ClipLoader from "react-spinners/ClipLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppState } from "../Contexts/AppContext";

function AddPostForm({ setShowPostForm }) {
  const {
    postState: { postCaption, fileInputState, previewSource, postFeed },
    postDispatch,
    addPostHandler,
  } = AppState();
  const [isAddPostLoading, setIsAddPostLoading] = useState(false);

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      postDispatch({ type: "SET_PREVIEW_SOURCE", payload: reader.result });
    };
  };

  function handleFileInputChange(e) {
    const file = e.target.files[0];
    previewFile(file);
  }

  function showPostFeedback() {
    toast.success("Post shared", { toastId: "msg1" });
  }

  function cancelPostForm() {
    setShowPostForm(false);
    postDispatch({ type: "SET_PREVIEW_SOURCE", payload: "" });
  }

  return (
    <div className="add-post-form">
      <button className="cancel-btn" onClick={cancelPostForm}>
        <i className="bi bi-x-lg"></i>
      </button>
      {/* <ToastContainer /> */}
      <span>Tell us how you're doing?</span>
      <form
        onSubmit={(e) =>
          addPostHandler(e, postCaption, previewSource, setIsAddPostLoading)
        }
      >
        <textarea
          placeholder="Share life with friends?"
          name="caption"
          id=""
          cols="30"
          rows="10"
          value={postCaption}
          onChange={(e) =>
            postDispatch({ type: "SET_POST_CAPTION", payload: e.target.value })
          }
        ></textarea>
        <input
          type="file"
          name="image"
          id=""
          onChange={(e) => handleFileInputChange(e)}
          value={fileInputState}
        />
        {previewSource && (
          <img
            src={previewSource}
            className="uploaded-image"
            style={{ height: "300px", width: "300px" }}
          />
        )}

        {isAddPostLoading === true ? (
          <ClipLoader loading={true} color={`#4B81F1`} />
        ) : (
          <button className="add-post-btn" type="submit">
            Add Post
          </button>
        )}
        {/* {postFeed && (<span className='error-crede'>{postFeed}</span>)} */}
        {postFeed && showPostFeedback()}
      </form>
    </div>
  );
}

export default AddPostForm;
