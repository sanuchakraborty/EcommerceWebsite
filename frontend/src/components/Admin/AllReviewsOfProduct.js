import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./AllProducts.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import DeleteIcon from "@mui/icons-material/Delete";
import { clearErrors, deleteReview, getAllReviews } from "../../actions/productAction";
import { DELETE_REVIEW_RESET } from "../../constants/productConstant";

const AllReviewsOfProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, reviews } = useSelector((state) => state.allReviews);

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteReview
  );

  const { productId } = useParams();
  const deleteReviewHandler = (id) => {
    dispatch(deleteReview(id, productId));
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
      alert("Reviews Deleted Successfully");
      navigate(`/admin/product/reviews/${productId}`);
      dispatch({ type: DELETE_REVIEW_RESET });
    }

    dispatch(getAllReviews(productId));
  }, [dispatch, error, deleteError, isDeleted, navigate]);

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 350,
      flex: 0.5,
    },

    {
      field: "comment",
      headerName: "Comment",
      type: "text",
      minWidth: 150,
      flex: 0.2,
    },

    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },

    {
      field: "actions",
      flex: 0.1,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button onClick={() => deleteReviewHandler(params.row.id)}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        comment: item.comment,
        rating: item.rating,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL PRODUCTS - Admin`} />

      <div className="dashboard">
        <div className="productListContainer">
          <h1 id="productListHeading">ALL REVIEWS</h1>

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

export default AllReviewsOfProduct;
