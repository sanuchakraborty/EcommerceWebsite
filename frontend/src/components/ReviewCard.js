import ReactStars from "react-rating-stars-component";
import React, { Fragment } from "react";
// import profilePng from "../../images/Profile.png";
import { Rating } from "@mui/material";
const ReviewCard = ({ review }) => {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
    size: "small"
  };

  return (
    <Fragment>
      {
        review.comment ? <Fragment><div className="reviewCard">
        <img src={review.image} alt="User" />
        <p>{review.name}</p>
        <Rating {...options} />
        <span className="reviewCardComment">{review.comment}</span>
      </div></Fragment> :<></>
      }
    </Fragment>
    
  );
};

export default ReviewCard;