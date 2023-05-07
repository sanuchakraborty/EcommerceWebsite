import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";

const CartItemCard = ({ item, deleteCartItems }) => {
  return (
    <div className="CartItemCard">
      <Link to={`/product/${item.productId}`}>
        <img src={item.imageUrl} alt={item.name} className="cart-image" />
      </Link>
      <div>
        <Link to={`/product/${item.productId}`}>{item.name}</Link>
        <span>{` ₹${item.price}`}</span>
        <p onClick={() => deleteCartItems(item.productId)}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;
