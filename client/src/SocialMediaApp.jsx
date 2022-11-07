import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import useInputState from "./hooks/useInputState";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SignUpScreen from "./screens/SignUpScreen";
import axios from "axios";
import UserProfileScreen from "./screens/UserProfileScreen";
import { io } from "socket.io-client";
import { AppState } from "./Contexts/AppContext";
import { backendLink } from "./utils/constants";



function SocialMediaApp() {
  const [socket, setSocket] = useState(null);
  const { userDispatch } = AppState();

  const { readRequests, notificationDispatch, getUnseenNotificationCount } =
    AppState();

  useEffect(() => {
    if (!socket) {
      setSocket(io(backendLink));
      console.log("socket set on homescreen");
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("authToken") !== null) {
      socket?.emit("newUser", localStorage.getItem("authToken"));
      localStorage.setItem("socket", socket);
    }
  }, [socket]);

  useEffect(() => {
    socket?.on("notifyFriendRequest", () => {
      userDispatch({ type: "UPDATE_USER_PROFILE_AFTER_REQUEST_SENT" });
      readRequests();
    });

    socket?.on("notifyNotification", () => {
      notificationDispatch({ type: "REFRESH_NOTIFICATIONS" });
      getUnseenNotificationCount();
      console.log("received Like");
    });

    return () => {
      socket?.off("notifyFriendRequest");
      socket?.off("notifyNotification");
    };
  }, [socket]);

  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
        <Route
          path="/resetpassword/:resetToken"
          element={<ResetPasswordScreen />}
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomeScreen socket={socket} setSocket={setSocket} />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfileScreen socket={socket} setSocket={setSocket} />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/:profileID"
          element={
            <PrivateRoute>
              <UserProfileScreen socket={socket} setSocket={setSocket} />
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsScreen socket={socket} setSocket={setSocket} />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default SocialMediaApp;
