import React, { Fragment, useEffect } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { createOrder } from "../../actions/orderAction";
import { CLEAR_ERRORS } from "../../constants/orderConstant";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user , error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const tax = Math.floor(subtotal * 0.18);

  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const order = {
      shippingInfo,
      paymentInfo:{
          id:"SamplePaymentId",
          status:"Success"
      },
      orderItems: cartItems,
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: shippingCharges,
      totalPrice,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(order));
    dispatch(createOrder(order));
    

    navigate("/success");
  };

  useEffect(()=>{
    if(error){
      alert(error);
      dispatch({type:CLEAR_ERRORS})
    }
  },[dispatch,error])

  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Address</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.productId}>
                    <img src={item.imageUrl} alt="Product" />
                    <Link to={`/product/${item.productId}`}>
                      {item.name}
                    </Link>{" "}
                    <span>
                      {item.quantity} X ₹{item.price} {" "}
                     = <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/*  */}
        <div>
          <div className="orderSummary">
            <Typography>Order Summery</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>₹{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>₹{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>₹{tax}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>₹{totalPrice}</span>
            </div>
            <button onClick={proceedToPayment}>Place Your Order Now</button>
          </div>
            <h3 className="payment-gateway">Payment Gateway is under development</h3>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
