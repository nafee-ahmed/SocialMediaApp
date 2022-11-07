import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import userImg from "../assets/UserImage.png";
import { AppState } from "../Contexts/AppContext";
import { backendLink } from "../utils/constants";
import DialogBox from "./DialogBox";
import { useNavigate } from "react-router-dom";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
};

function SettingsForm({ defaultInputs, loadingUpdate, setLoadingUpdate }) {
  const { userDispatch } = AppState();
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [updateError, setUpdateError] = useState(undefined);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", defaultValues: defaultInputs });

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]; // grabbing file on change.
    previewFile(file);
  };

  const showToastNotification = (msg) =>
    toast.success(msg, { toastId: "msg34" });

  async function editHandler(data) {
    setLoadingUpdate(true);
    setUpdateError("");
    const { name, number, email, password, oldpassword, interest, bio } = data;
    try {
      const res = await axios.post(
        backendLink + "/settings/update",
        {
          name: name,
          number: number,
          email: email,
          password: password,
          oldpassword,
          interest: interest,
          bio: bio,
          img: previewSource || "",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (res.data.success) showToastNotification("Profile Updated");
      userDispatch({ type: "SET_USER_PROFILE_PIC", payload: previewSource });
    } catch (err) {
      setUpdateError(err.response.data.message);
      if (err.response.data.message.includes("duplicate key error"))
        setUpdateError("Email already exists");
    }
    setLoadingUpdate(false);
  }
  const deleteHandler = async () => {
    setIsDeleteLoading(true);
    try {
      const res = await axios.post(
        backendLink + "/settings/delete",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      localStorage.clear();
    } catch (err) {
      console.log(err);
    }
    setIsDeleteLoading(false);
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit(editHandler)}>
      {showDeleteDialog && (
        <DialogBox
          setShow={setShowDeleteDialog}
          yesFunc={deleteHandler}
          loading={isDeleteLoading}
        />
      )}
      {!showDeleteDialog && (
        <>
          <p className="error-feed2">{errors.name?.message}</p>
          <div className="field-pair">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Name is required" })}
            />
          </div>

          <p className="error-feed2">{errors.number?.message}</p>
          <div className="field-pair">
            <label htmlFor="number">Phone Number</label>
            <input
              type="text"
              id="number"
              {...register("number", {
                required: "Phone is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Invalid phone format",
                },
              })}
            />
          </div>

          <p className="error-feed2">{errors.interest?.message}</p>
          <div className="field-pair">
            <label htmlFor="interest">Interest</label>
            <input
              type="text"
              id="interest"
              {...register("interest", {
                required: "Interest is required",
              })}
            />
          </div>

          <p className="error-feed2">{errors.bio?.message}</p>
          <div className="field-pair">
            <label htmlFor="bio">Bio</label>
            <input
              type="text"
              id="bio"
              {...register("bio", { required: "Bio is required" })}
            />
          </div>

          <p className="error-feed2">{errors.email?.message}</p>
          <div className="field-pair">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email does not match email format",
                },
              })}
            />
          </div>

          <p className="error-feed2">{errors.password?.message}</p>
          <div className="field-pair">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum length must be 6",
                },
              })}
            />
          </div>

          <p className="error-feed2">{errors.oldpassword?.message}</p>
          <div className="field-pair">
            <label htmlFor="oldpassword">Current Password</label>
            <input
              type="password"
              {...register("oldpassword", {
                required: "Enter current password",
              })}
            />
          </div>

          <div className="field-pair file-pair">
            <label htmlFor="image">Profile Picture</label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleFileInputChange}
              value={fileInputState}
            />
          </div>

          {(previewSource || defaultInputs) && (
            <img
              src={previewSource || defaultInputs?.profilePic || userImg}
              alt="chosen image"
              style={{
                height: "150px",
                width: "150px",
                borderRadius: "50%",
              }}
            />
          )}

          {updateError && <p className="error-feed2">{updateError}</p>}

          {loadingUpdate ? (
            <ClipLoader loading={true} color={`#4B81F1`} />
          ) : (
            <div className="field-pair">
              <input type="submit" value="Edit" />
              <button type="button" onClick={() => setShowDeleteDialog(true)}>
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </form>
  );
}

export default SettingsForm;
