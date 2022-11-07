import React from "react";
import useFetch from "../hooks/useFetch";
import ClipLoader from "react-spinners/ClipLoader";
import FriendSuggestionItem from "./FriendSuggestionItem";

function FriendSuggestions({ socket }) {
  const { data, loading, error } = useFetch("/suggest/friends");

  return loading ? (
    <ClipLoader loading={true} color={`#4B81F1`} />
  ) : (
    <div className="friend-suggestions">
      <p>Friend Suggestions</p>

      <div className="divider-child">
        <hr />
      </div>

      {data.msg &&
        data.msg.map((d) => (
          <FriendSuggestionItem item={d} socket={socket} key={d._id} />
        ))}
      {data.msg && data.msg.length === 0 && (
        <span style={{ textAlign: "center", color: "#989898" }}>
          No one found with the same interest
        </span>
      )}
    </div>
  );
}

export default FriendSuggestions;
