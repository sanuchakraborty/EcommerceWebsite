import React, { Fragment, useEffect, useState } from "react";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";

import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  addNewReview,
  clearErrors,
  getProductDetails,
} from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import { useParams } from "react-router-dom";
import ReviewCard from "../ReviewCard.js";
import { addItemToCart } from "../../actions/cartAction";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { Rating } from "@mui/material";
import { NEW_REVIEW_RESET } from "../../constants/productConstant";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  const { id } = useParams();

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      let qty = quantity + 1;
      setQuantity(qty);
    }
  };
  const decreaseQuantity = () => {
    if (quantity > 1) {
      let qty = quantity - 1;
      setQuantity(qty);
    }
  };
  const addToCartHandler = () => {
    dispatch(addItemToCart(id, quantity));
    alert(`${product.name} added to cart`);
  };
  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    dispatch(addNewReview(rating, comment, id));
    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }

    if (reviewError) {
      alert(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      alert("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error, reviewError, success]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          <div className="ProductDetails">
            <div>
              <Carousel showArrows={true}>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>
            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <form>
                      <input
                        id="item"
                        readOnly
                        type="number"
                        value={quantity}
                      />
                    </form>
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  {product.stock > 0 ? (
                    <button onClick={addToCartHandler}>Add to Cart</button>
                  ) : (
                    <></>
                  )}
                </div>

                <p>
                  Status:
                  <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                    {product.stock < 1
                      ? "Out Of Stock"
                      : `In Stock(${product.stock})`}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>
            </div>
          </div>
          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}>
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          <h3 className="reviewsHeading">Reviews</h3>
          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
