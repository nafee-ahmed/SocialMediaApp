import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import userImg from "../assets/UserImage.png";
import AddPostForm from "./AddPostForm";
import SearchBar from "./SearchBar";
import useInputState from "../hooks/useInputState";
import { AppState } from "../Contexts/AppContext";

function TopNavbar({
  showPostForm,
  setShowPostForm,
  showSearchBar,
  setShowSearchBar,
}) {
  const {
    userState: { profilePic },
  } = AppState();
  const [searchInp, setSearchInp] = useInputState("");
  return (
    <>
      {showPostForm ? <AddPostForm setShowPostForm={setShowPostForm} /> : ""}
      <div className="top-navbar">
        <Link
          to=""
          className="add-link"
          onClick={() => setShowPostForm(!showPostForm)}
        >
          <div>
            {showPostForm ? (
              <i className="bi bi-dash-circle-fill"></i>
            ) : (
              <i className="bi bi-plus-circle-fill"></i>
            )}
          </div>
        </Link>

        <Link to="/settings" className="profile-link">
          <div>
            <img src={profilePic || userImg} alt="" />
          </div>
        </Link>

        <div className={`bottom-section ${showSearchBar && "selected"}`}>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search People"
              value={searchInp}
              onChange={(e) => setSearchInp(e)}
              onClick={(e) => setShowSearchBar(!showSearchBar)}
            />
            <button onClick={() => setShowSearchBar(false)}>
              {showSearchBar ? (
                <i className="bi bi-x"></i>
              ) : (
                <i className="bi bi-search"></i>
              )}
            </button>
          </form>

          <div className="search-bar-div">
            {showSearchBar && <SearchBar searchInp={searchInp} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default TopNavbar;
