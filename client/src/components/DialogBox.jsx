import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

function DialogBox({ setShow, yesFunc, loading }) {
  return (
    <div className="dialog-box">
      {loading ? (
        <div className="loading-div">
          <ClipLoader loading={true} color={`#4B81F1`} />
        </div>
      ) : (
        <>
          <div className="question">Are you sure?</div>
          <div className="yes-or-no">
            <button className="btn yes-btn" onClick={() => yesFunc()}>
              Yes
            </button>
            <button className="btn no-btn" onClick={() => setShow(false)}>
              No
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default DialogBox;
