import React, { useState } from "react";
import Navbar from "../components/Navbar";
import TopNavbar from "../components/TopNavbar";
import "../App.css";
import useFetch from "../hooks/useFetch";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

import SettingsForm from "../components/SettingsForm";

function SettingsScreen({ socket, setSocket }) {
  const [showPostForm, setShowPostForm] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const { data, error, loading } = useFetch("/settings/read");

  const [defaultInputs, setDefaultInputs] = useState({});
  useEffect(() => {
    setDefaultInputs(data.msg);
  }, [data, loadingUpdate]);

  return (
    <div className="settings-screen">
      <Navbar
        showPostForm={showPostForm}
        setShowPostForm={setShowPostForm}
        socket={socket}
        setSocket={setSocket}
      />
      <TopNavbar
        showPostForm={showPostForm}
        setShowPostForm={setShowPostForm}
        showSearchBar={showSearchBar}
        setShowSearchBar={setShowSearchBar}
      />
      {loading && !data ? (
        <ClipLoader loading={true} color={`#4B81F1`} />
      ) : (
        <div className="edit-profile">
          <ToastContainer />
          <div className="edit-profile-sub">
            <span>Edit Profile</span>
            <div className="hr-container">
              <hr />
            </div>
            {defaultInputs && (
              <SettingsForm
                defaultInputs={defaultInputs}
                loadingUpdate={loadingUpdate}
                setLoadingUpdate={setLoadingUpdate}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsScreen;
