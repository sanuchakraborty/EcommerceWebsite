import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./AllProducts.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { clearErrors, deleteUser, getAllUsers } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstant";
import Loader from "../layout/Loader/Loader";

const AllUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, users } = useSelector((state) => state.allUsers);
  const {
    error: deleteError,
    isDeleted,
    loading: deleteLoading,
  } = useSelector((state) => state.profile);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert("User Deleted Successfully");
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, error, deleteError, isDeleted, navigate]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 200, flex: 0.5 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      type: "string",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "role",
      headerName: "Role",
      type: "string",
      minWidth: 50,
      flex: 0.3,
      cellClassName: (params) => {
        return params.value === "admin" ? "greenColor" : "redColor";
      },
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            {loading ? (
              <Loader />
            ) : (
              <Fragment>
                <Link to={`/admin/user/${params.row.id}`}>
                  <EditIcon />
                </Link>
                {deleteLoading ? (
                  <></>
                ) : (
                  <Button onClick={() => deleteUserHandler(params.row.id)}>
                    <DeleteIcon />
                  </Button>
                )}
              </Fragment>
            )}
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL USERS - Admin`} />

      <div className="dashboard">
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default AllUsers;
