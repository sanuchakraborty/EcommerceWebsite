import React, { useState, useEffect, Fragment } from "react";
import "./UpdateProflie.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../actions/userAction";
import { CLEAR_ERRORS } from "../../constants/userConstant";

// import LockIcon from "@mui/icons-material/Lock";
// import LockOpenIcon from "@mui/icons-material/LockOpen";
// import VpnKeyIcon from '@mui/icons-material/VpnKey';

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, error, success } = useSelector(
    (state) => state.forgotPassword
  );

  const navigate = useNavigate();

  const ResetPasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword(token, newPassword, confirmPassword));
  };

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch({ type: CLEAR_ERRORS });
    }

    if (success) {
      alert("Password Updated Successfully");
      navigate("/login");
    }
  }, [dispatch, loading, error, navigate]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h2 className="login-page">Reset Password</h2>
          <div class="login">
            <form
              id="login"
              encType="multipart/form-data"
              onSubmit={ResetPasswordSubmit}>
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
                value="ResetPassword"
                className="register-button">
                Reset Password
              </button>
            </form>
          </div>
        </Fragment>
      )}
      ;
    </Fragment>
  );
};

export default ResetPassword;
