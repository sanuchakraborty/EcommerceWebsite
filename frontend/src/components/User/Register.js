import React, { useState, useEffect, Fragment } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../actions/userAction";
import { CLEAR_ERRORS } from "../../constants/userConstant";

const Register = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [avatarPreviewFromLink, setAvatarPreviewFromLink] = useState();
  const [avatarPreview, setAvatarPreview] = useState(
    "https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-profile-line-black-icon-png-image_691065.jpg"
  );

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const navigate = useNavigate();

  const imageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setAvatarPreviewFromLink(e.target.value);
  }
  const registerDataChange = (e) => {
    
    
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("imageUrl", imageUrl);
    myForm.set("avatar", avatar);
    //dispatch(register(name, email, password));
    dispatch(register(myForm));
  };
  
  useEffect(() => {
    
    let errorCount = 0;
    
    if (error === "Could not decode base64") {
      errorCount+=1;
      alert("Profile picture should be less than 750kb");
      dispatch({ type: CLEAR_ERRORS });
    }
    if (
      error ===
      "User validation failed: password: Password should be greater than 8 characters"
    ) {
      errorCount+=1;
      alert("Password should be greater than 8 characters");
      dispatch({ type: CLEAR_ERRORS });
    }
    if (error === "User validation failed: email: Please enter a valid Email") {
      errorCount+=1;
      alert("Please enter a valid Email");
      dispatch({ type: CLEAR_ERRORS });
    }
    if (
      error ===
      "User validation failed: name: Name should have atleast 4 characters"
    ) {
      errorCount+=1;
      alert("Name should have atleast 4 characters");
      dispatch({ type: CLEAR_ERRORS });
    }
    if (error === "Duplicate email entered") {
      errorCount+=1;
      alert("Email already exists");
      dispatch({ type: CLEAR_ERRORS });
      navigate(`/login`)
    }
    if(error && errorCount===0){
      alert(error);
    }
    if (isAuthenticated) {
       navigate(`/account`);
    }
  }, [user, isAuthenticated, dispatch, loading, error, navigate]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h2 className="login-page">Sign Up Now</h2>
          <div class="login">
            <form
              id="login"
              encType="multipart/form-data"
              onSubmit={registerSubmit}>
              <input
                type="name"
                placeholder="Name"
                required
                name="name"
                value={name}
                onChange={registerDataChange}
              />
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={registerDataChange}
              />
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                value={password}
                onChange={registerDataChange}
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
                  onChange={registerDataChange}
                />
              </div>
              Or
              <div>
                <input
                  type="name"
                  placeholder="Image Link"
                  name="imageUrl"
                  value={imageUrl}
                  onChange={imageUrlChange}
                />
                {avatarPreviewFromLink && <img
                  className="register-avatar-from-link"
                  src={avatarPreviewFromLink} alt="avatar preview"
                />}
              </div>
              <button
                type="submit"
                value="Register"
                className="login-button">
                Sign Up
              </button>
            </form>
            <p className="forgotPass">
              Already have an account?{" "}
              <Link className="register-link" to="/login">
                Login now!
              </Link>
            </p>
          </div>
        </Fragment>
      )}
      ;
    </Fragment>
  );
};

export default Register;
