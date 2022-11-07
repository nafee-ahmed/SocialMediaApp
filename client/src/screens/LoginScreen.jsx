import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import useInputState from "../hooks/useInputState";
import ClipLoader from "react-spinners/ClipLoader";
import { backendLink } from "../utils/constants";


function LoginScreen(socket, setSocket) {
  const navigate = useNavigate();
  const [email, handleEmailChange, resetEmail] = useInputState("");
  const [password, handlePasswordChange, resetPassword] = useInputState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  useEffect(() => {
    localStorage.getItem("authToken") && navigate("/");
    return () => setIsLoginLoading(false);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoginLoading(true);
    try {
      const res = await axios.post(backendLink + "/login", { email, password });
      // setLoginStatus(true);
      localStorage.setItem("authToken", res.data.token);
      navigate("/");
    } catch (err) {
      console.log(err.response.data.message);
      setLoginMsg(err.response.data.message);
      // setLoginStatus(false);
    }
    setIsLoginLoading(false);
  }
  return (
    <div className="LoginScreen">
      <div className="LoginScreen-Form">
        <h3>Login</h3>
        <form onSubmit={handleLogin}>
          <div className="label-input-pair">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleEmailChange(e)}
              placeholder="Enter Email"
              className="email-input"
            />
          </div>

          <div className="label-input-pair">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e)}
              id="password"
              placeholder="Enter Password"
              className="password-input"
            />
          </div>
          {loginMsg !== "" && <span className="cred-error">{loginMsg}</span>}
          {isLoginLoading ? (
            <ClipLoader loading={true} color={`#4B81F1`} />
          ) : (
            <div className="Submit-Button-Container">
              <input type="submit" value="Login" />
            </div>
          )}
        </form>
        <div className="outside-form-container">
          <Link to="/forgotpassword" className="forgot-password">
            Forgot Password?
          </Link>
          <p>Don't have an account?</p>
          <Link to="/signup" className="signup-button">
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
