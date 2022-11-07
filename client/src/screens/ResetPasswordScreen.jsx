import axios from "axios";
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import useInputState from "../hooks/useInputState";
import { backendLink } from "../utils/constants";

function ResetPasswordScreen() {
  const [password, handlePasswordChange, resetPassword] = useInputState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { resetToken } = useParams();
  console.log(resetToken);
  async function handleResetPassword(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        backendLink + `/resetpassword/${resetToken}`,
        { password }
      );
      setSuccess(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      setError(err.response.data.message);
      console.log(err);
    }
  }
  return (
    <div className="LoginScreen">
      <div className="LoginScreen-Form">
        <h3>Reset Password</h3>
        <form onSubmit={(e) => handleResetPassword(e)}>
          <div className="label-input-pair">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => handlePasswordChange(e)}
              placeholder="Enter Password"
              className="email-input"
            />
          </div>
          <div className="label-input-pair">Please enter your new password</div>
          {error && <span className="cred-error">{error}</span>}
          {success && (
            <span className="cred-error">
              {success}
              <Link to="/login">Login</Link>
            </span>
          )}
          <div className="Submit-Button-Container">
            <input type="submit" value="Reset Password" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordScreen;
