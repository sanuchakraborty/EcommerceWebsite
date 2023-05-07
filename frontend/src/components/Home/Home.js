import React, { Fragment, useEffect } from "react";
import { BsMouseFill } from "react-icons/bs";
import "./Home.css";
import ProductCard from "./ProductCard";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
import { getProducts } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.js";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      return alert(error);
    }
    dispatch(getProducts());
  }, [dispatch, error]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="ECOMMERCE" />

          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS HERE</h1>

            <a href="#container">
              <button>
                Scroll <BsMouseFill />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
          <div className="view-products-div">
            <Link to="/products">
              <button className="view-products-button">View All Products</button>
            </Link>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
