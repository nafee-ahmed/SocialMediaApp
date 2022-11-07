import React, { useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../App.css";
import { useState } from "react";
import { backendLink } from "../utils/constants";


function SignUpScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  async function submitHandler(data) {
    setLoading(true);
    const { name, number, email, password, interest, bio } = data;
    try {
      const res = await axios.post(backendLink + "/signup", {
        name: name,
        number: number,
        email: email,
        password: password,
        interest: interest,
        bio: bio,
      });
      localStorage.setItem("authToken", res.data.token);
      navigate("/");
      console.log(res.data);
    } catch (err) {
      Object.entries(err.response.data.message).forEach(([key, value]) => {
        setError(key, { type: "custom", message: value });
      });
      console.log(err.response.data.message);
    }
    setLoading(false);
  }

  return (
    <div className="SignUpScreen">
      <div className="SignUpScreen-Form">
        <h3>Sign Up</h3>

        <form onSubmit={handleSubmit(submitHandler)} className="register-form">
          <div className="label-input-container">
            <div>
              <label htmlFor="name">Name</label>
              <span className="error-feed">{errors.name?.message}</span>
            </div>
            <input
              type="text"
              id="name"
              className="name-inp"
              placeholder="Enter Full Name"
              {...register("name", { required: "Name is required" })}
            />
          </div>

          <div className="label-input-container">
            <div>
              <label htmlFor="number">Phone Number</label>
              {<span className="error-feed">{errors.number?.message}</span>}
            </div>
            <input
              type="text"
              id="number"
              className="number-inp"
              placeholder="example: 01234567898 (10 digits)"
              {...register("number", {
                required: "Phone is required",
                pattern: { value: /^\d{10}$/, message: "Invalid phone format" },
              })}
            />
          </div>

          <div className="label-input-container">
            <div>
              <label htmlFor="interest">Interest</label>
              <span className="error-feed">{errors.interest?.message}</span>
            </div>
            <input
              type="text"
              id="interest"
              className="name-inp"
              placeholder="Enter your interest"
              {...register("interest", { required: "Interest is required" })}
            />
          </div>

          <div className="label-input-container">
            <div>
              <label htmlFor="bio">Bio</label>
              <span className="error-feed">{errors.bio?.message}</span>
            </div>
            <input
              type="text"
              id="bio"
              className="name-inp"
              placeholder="Enter your bio"
              {...register("bio", { required: "Bio is required" })}
            />
          </div>

          <div className="label-input-container">
            <div>
              <label htmlFor="email">Email</label>
              <span className="error-feed">{errors.email?.message}</span>
            </div>
            <input
              type="email"
              id="email"
              className="email-inp"
              placeholder="Enter Email(example: XXX@gmail.com)"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email does not match email format",
                },
              })}
            />
          </div>

          <div className="label-input-container">
            <div>
              <label htmlFor="password">Password</label>
              <span className="error-feed">{errors.password?.message}</span>
            </div>
            <input
              type="password"
              id="password"
              className="password-inp"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum length must be 6" },
              })}
            />
          </div>

          <div className="submit-button-container">
            {loading ? (
              <ClipLoader loading={true} color={`#4B81F1`} />
            ) : (
              <>
                <input type="submit" value="Create New Account" />
                <p>Already have an account?</p>
                <Link to="/login" className="login-btn">
                  Login
                </Link>
              </>
            )}
          </div>
        </form>

        {/* <div className='login-container'>
                  <p>Already have an account?</p>
                  <Link to='/login' className='login-btn'>Login</Link>
              </div> */}
      </div>
    </div>
  );
}

export default SignUpScreen;
