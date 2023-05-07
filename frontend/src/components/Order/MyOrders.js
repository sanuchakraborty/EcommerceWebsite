import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./MyOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, myOrders } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import MetaData from "../layout/MetaData";
import LaunchIcon from "@mui/icons-material/Launch";

const MyOrders = () => {
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { user } = useSelector((state) => state.user);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 100, flex: 0.5 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.5,
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "date",
      headerName: "Ordered On",
      type: "string",
      minWidth: 110,
      flex: 0.3,
    },
    

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "itemsQty",
      headerName: "Quantity",
      type: "number",
      minWidth: 0,
      flex: 0,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "View Order",
      minWidth: 110,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.row.id}`} className="launch-icon">
            <LaunchIcon /><span></span>
          </Link>
        );
      },
    },
  ];
  const rows = [];

  orders &&
    orders.forEach((item, index) => {
      const orderedOn = String(item.createdAt).substr(0, 10);
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice,
        date:orderedOn,
      });
    });

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }

    dispatch(myOrders());
  }, [dispatch, error]);

  return (
    <Fragment>
      <MetaData title={`${user.name} - Orders`} />
      <h2 className="login-page">My Orders</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="myOrdersTable"
            autoHeight
          />

          <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;
