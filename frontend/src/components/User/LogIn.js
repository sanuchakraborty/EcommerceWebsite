import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./LogIn.css";
import MetaData from "../layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
import { CLEAR_ERRORS } from "../../constants/userConstant";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const { loading, isAuthenticated, user, error } = useSelector(
    (state) => state.user
  );

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };
  const redirect = location.search ? location.search.split("=")[1] : "/";
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch({ type: CLEAR_ERRORS });
    }
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [dispatch, error, user, loading, navigate, isAuthenticated]);

  return (
    <Fragment>
      <MetaData title={`Login Page`} />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h2 className="login-page">Login Now</h2>
          <div className="login">
            <form id="login" onSubmit={loginSubmit}>
              <input
                type="email"
                placeholder="Email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <p className="forgotPass">
                <Link to="/forgot-password">
                  Forgot password?
                </Link>
              </p>
              <button type="submit" value="Login" className="login-button">
                Log In
              </button>
            </form>
            <p className="forgotPass">
              Don't have an account?{" "}
              <Link className="register-link" to="/register">
                Register here!
              </Link>
            </p>
          </div>
        </Fragment>
      )}
      ;
    </Fragment>
  );
};

export default Login;
