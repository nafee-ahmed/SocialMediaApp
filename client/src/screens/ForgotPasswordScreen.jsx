import axios from "axios";
import React, { useState } from "react";
import useInputState from "../hooks/useInputState";
import { backendLink } from "../utils/constants";
import ClipLoader from "react-spinners/ClipLoader";

function ForgotPasswordScreen() {
  const [email, handleEmailChange, resetEmail] = useInputState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleForgotPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(backendLink + "/forgotpassword", { email });
      setSuccess(res.data.data);
    } catch (err) {
      setError(err.response.data.message);
      resetEmail();
    }
    setLoading(false);
  };
  return (
    <div className="LoginScreen">
      {loading ? (
        <ClipLoader loading={true} color={`#4B81F1`} />
      ) : (
        <div className="LoginScreen-Form">
          <h3>Forgot Password</h3>
          <form onSubmit={(e) => handleForgotPassword(e)}>
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
              Please enter the email you used to sign up with. <br />
              We will send the link to reset password to your email
            </div>
            {success && <span className="cred-error">{success}</span>}
            {error && <span className="cred-error">{error}</span>}
            <div className="Submit-Button-Container">
              <input type="submit" value="Send Email" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ForgotPasswordScreen;
