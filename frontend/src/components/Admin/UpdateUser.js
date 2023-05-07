import React, { Fragment, useEffect, useState } from "react";
import "./UpdateProduct.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateUser,
  getUserDetails,
} from "../../actions/userAction";
import MetaData from "../layout/MetaData";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Loader from "../layout/Loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { UPDATE_USER_RESET } from "../../constants/userConstant";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const {
    loading:updateLoading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.profile);
  const {loading, user, error } = useSelector((state) => state.userDetails);
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert("User Updated Successfully");
      navigate("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
    if (user && user._id !== id) {
      dispatch(getUserDetails(id));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [dispatch, error, updateError, isUpdated, navigate, id, user]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);
    dispatch(updateUser(id, myForm));
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update User" />
          <div className="dashboard">
            <div className="newProductContainer">
              <form
                className="createProductForm"
                encType="multipart/form-data"
                onSubmit={updateUserSubmitHandler}>
                <h1>Update User</h1>

                <div>
                  <SpellcheckIcon />
                  <input
                    type="text"
                    placeholder="User Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <MailOutlineIcon />
                  <input
                    type="text"
                    placeholder="Role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>


                <button
                  id="createProductBtn"
                  type="submit"
                  disabled={updateLoading ? true : false}>
                  Update
                </button>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdateUser;
