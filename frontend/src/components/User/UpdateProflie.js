import React, { useState, useEffect, Fragment } from "react";
import "./LogIn.css";
import { useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, updateProfile } from "../../actions/userAction";
import { CLEAR_ERRORS, UPDATE_PROFILE_RESET } from "../../constants/userConstant";

const UpdateProfile = ({ user }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const { loading, error, isUpdated } = useSelector((state) => state.profile);

  const navigate = useNavigate();

  const UpdateProfileDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const UpdateProfileSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("avatar", avatar);
    //dispatch(register(name, email, password));
    dispatch(updateProfile(myForm));
  };

  useEffect(() => {
    let errorCount = 0;
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
    }
    if (error === "Could not decode base64") {
      errorCount += 1;
      alert("Profile picture should be less than 750kb");
      dispatch({ type: CLEAR_ERRORS });
    }
    if (error === "User validation failed: email: Please enter a valid Email") {
      errorCount += 1;
      alert("Please enter a valid Email");
      dispatch({ type: CLEAR_ERRORS });
    }
    if (
      error ===
      "User validation failed: name: Name should have atleast 4 characters"
    ) {
      errorCount += 1;
      alert("Name should have atleast 4 characters");
      dispatch({ type: CLEAR_ERRORS });
    }
    if (error === "Duplicate email entered") {
      errorCount += 1;
      alert("Email already exists");
      dispatch({ type: CLEAR_ERRORS });
    }
    if (error && errorCount === 0) {
      alert(error);
      dispatch({ type: CLEAR_ERRORS });
    }

    if(isUpdated){
        alert("Profile Updated Successfully");
        dispatch(loadUser());
        navigate("/account");
        dispatch({type: UPDATE_PROFILE_RESET})
    }

  }, [user, dispatch, loading, error, navigate, isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h2 className="login-page">Update Your Profile Now</h2>
          <div class="login">
            <form
              id="login"
              encType="multipart/form-data"
              onSubmit={UpdateProfileSubmit}>
              <input
                type="name"
                placeholder="Name"
                required
                name="name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <div className="imageUpload">
                <img
                  className="register-avatar"
                  src={avatarPreview}
                  alt="Avatar Preview"
                />
                <input
                  id="avatar"
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={UpdateProfileDataChange}
                />
              </div>
              <button
                type="submit"
                value="UpdateProfile"
                className="login-button">
                Update Profile
              </button>
            </form>
          </div>
        </Fragment>
      )}
      ;
    </Fragment>
  );
};

export default UpdateProfile;
