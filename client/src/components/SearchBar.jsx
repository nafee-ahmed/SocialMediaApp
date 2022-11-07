import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import user from "../assets/UserImage.png";
import axios from "axios";
import { backendLink } from "../utils/constants";

function SearchBar({ searchInp }) {
  const [searchResults, setSearchResults] = useState([]);
  const search = async () => {
    try {
      const res = await axios.post(backendLink + "/search", "", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setSearchResults(res.data.users);
    } catch (err) {
      console.log(err);
      console.log(err.response.data.message);
    }
  };
  useEffect(() => {
    search();
  }, []);
  return (
    <div className="search-bar">
      {searchResults
        .filter((filtered) => {
          if (searchInp === "") return filtered;
          else if (
            filtered.name.toLowerCase().includes(searchInp.toLowerCase())
          )
            return filtered;
        })
        .map((result) => (
          <span key={result._id}>
            <Link
              to={`/profile/${result._id}`}
              key={result._id}
              className="one-search"
            >
              {result.profilePic ? (
                <img src={result.profilePic} alt="" />
              ) : (
                <img src={user} alt="" />
              )}
              <span>{result.name}</span>
            </Link>
            <hr />
          </span>
        ))}
      {/* <Link to='' className='one-search'>
                <img src={user} alt="" />
                <span>Nafi Ahmed</span>
            </Link>
            <hr /> */}
    </div>
  );
}

export default SearchBar;
