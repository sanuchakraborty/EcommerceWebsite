import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = ({ user }) => {
  const { loading } = useSelector((state) => state.user);
  let imageurl = "";
  if (user.avatar) {
    imageurl = user.avatar.url;
  }

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${user.name}'s Profile`} />
          <h2 className="my-profile">My Profile</h2>
          <div className="profileContainer">
            <div>
              <img src={imageurl} alt={user.name} className="profile-picture" />
              <Link to="/account/update">Edit Profile</Link>
            </div>
            <div>
              <div>
                <h4>Full Name</h4>
                <p>{user.name}</p>
              </div>
              <div>
                <h4>Email</h4>
                <p>{user.email}</p>
              </div>
              <div>
                <h4>You are </h4>
                <p>{user.role}</p>
              </div>
              <div>
                <h4>Joined On</h4>
                <p>{String(user.createdAt).substr(0, 10)}</p>
              </div>

              <div>
                <Link to="/orders">My Orders</Link>
                <Link to="/account/update-password">Change Password</Link>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UserProfile;
