import React, { useState, useEffect, Fragment } from "react";
import "./UpdateProflie.css";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../actions/userAction";
import {
  CLEAR_ERRORS,
  UPDATE_PASSWORD_RESET,
} from "../../constants/userConstant";
// import LockIcon from "@mui/icons-material/Lock";
// import LockOpenIcon from "@mui/icons-material/LockOpen";
// import VpnKeyIcon from '@mui/icons-material/VpnKey';

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, error, isUpdated } = useSelector((state) => state.profile);

  const navigate = useNavigate();

  const UpdatePasswordSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);
    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch({ type: CLEAR_ERRORS });
    }

    if (isUpdated) {
      alert("Password Updated Successfully");
      navigate("/account");
      dispatch({ type: UPDATE_PASSWORD_RESET });
    }
  }, [dispatch, loading, error, navigate, isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h2 className="login-page">Update Password</h2>
          <div class="login">
            <form
              id="login"
              encType="multipart/form-data"
              onSubmit={UpdatePasswordSubmit}>
              <input
                type="Password"
                placeholder="Old Password"
                required
                name="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                required
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="Password"
                placeholder="Confirm Password"
                required
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="submit"
                value="UpdatePassword"
                className="login-button">
                Update Password
              </button>
            </form>
          </div>
        </Fragment>
      )}
      ;
    </Fragment>
  );
};

export default UpdatePassword;
