import React, { useState, useEffect, Fragment } from "react";
import "./ForgotProflie.css";
import { useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../actions/userAction";
import { CLEAR_ERRORS, CLEAR_MESSAGE } from "../../constants/userConstant";
// import LockIcon from "@mui/icons-material/Lock";
// import LockOpenIcon from "@mui/icons-material/LockOpen";
// import VpnKeyIcon from '@mui/icons-material/VpnKey';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const { loading, error, message } = useSelector(
    (state) => state.forgotPassword
  );

  const navigate = useNavigate();

  const ForgotPasswordSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (message) {
      alert("This feature is under development, try using another account or contact the developer");
      dispatch({ type: CLEAR_MESSAGE });
    }
    if (error) {
      alert(error);
      dispatch({ type: CLEAR_ERRORS });
    }
  }, [dispatch, loading, error, navigate, message]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h2 className="login-page">Forgot Password</h2>
          <div class="login">
            <form
              id="login"
              encType="multipart/form-data"
              onSubmit={ForgotPasswordSubmit}>
              <input
                type="email"
                placeholder="Enter Your Email"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                type="submit"
                value="ForgotPassword"
                className="login-button">
                Get Reset Password Link
              </button>
            </form>
          </div>
        </Fragment>
      )}
      
    </Fragment>
  );
};

export default ForgotPassword;
