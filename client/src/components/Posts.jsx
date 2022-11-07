import React from "react";
import Post from "./Post";
import "../App.css";
import { AppState } from "../Contexts/AppContext";

function Posts({ profileFriend, postsOf, socket }) {
  let {
    postState: { posts, friendPosts },
  } = AppState();

  postsOf === "friends" ? (posts = friendPosts) : (posts = posts);
  posts && Array.from(posts);
  return (
    <div>
      {posts ? (
        posts.map((post) => (
          <Post
            postId={post._id}
            key={post._id}
            userName={post.user[0].name}
            userInterest={post.user[0].interest}
            text={post.text}
            image={post.image}
            profileFriend={profileFriend}
            owner={post.user[0].profilePic}
            numberOfLikes={post.numberOfLikes}
            numOfComments={post.numberOfComments}
            postOwnerId={post.user[0]._id}
            socket={socket}
          />
        ))
      ) : (
        <Post userName="XXXX" userInterest="XXXX" text="XXXX" image="XXXX" />
      )}
    </div>
  );
}

export default Posts;
