import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";

import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProducts } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import MetaData from "../layout/MetaData";
const categories = [
  "Top",
  "Bottom",
  "Footwear",
  "Attire",
  "Camera",
  "Laptop",
  "Smartphone",
  "Others",
  "All",
];

const Products = () => {
  const {
    loading,
    error,
    products,
    totalProductsCount,
    resultPerPage,
    productsCount,
  } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const { keyword } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 2500000]);
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [ratings, setRatings] = useState(0);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };
  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };
  const applyPriceHandler = () => {
    const newPrice = [minPrice, maxPrice];
    setPrice(newPrice);
  };

  useEffect(() => {
    if (error) {
      dispatch({ clearErrors });
    }
    dispatch(getProducts(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, error, category, ratings]);
  console.log(category);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="All Products" />
          <h2 className="productsHeading">Products</h2>
          <div className="filterBox-mobile">
            <Typography>Price</Typography>
            <form onSubmit={applyPriceHandler} className="price-filter">
              <input
                type="price"
                placeholder="Min"
                required
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />

              <input
                type="price"
                placeholder="Max"
                required
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <button type="submit">Apply</button>
            </form>

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}>
                  {category}
                </li>
              ))}
            </ul>

            <Typography>Ratings Above</Typography>
            <Slider
              value={ratings}
              onChange={(e, newRating) => {
                setRatings(newRating);
              }}
              aria-labelledby="continuous-slider"
              valueLabelDisplay="auto"
              min={0}
              max={5}
            />
          </div>
          <div className="products">
            {!productsCount ? (
              <>
                <p className="no-products">No Product Found</p>
              </>
            ) : (
              <></>
            )}
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-label="continuous-slider"
              min={0}
              max={250000}
            />

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}>
                  {category}
                </li>
              ))}
            </ul>

            <Typography>Ratings Above</Typography>
            <Slider
              value={ratings}
              onChange={(e, newRating) => {
                setRatings(newRating);
              }}
              aria-labelledby="continuous-slider"
              valueLabelDisplay="auto"
              min={0}
              max={5}
            />
          </div>
          {resultPerPage < productsCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={totalProductsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
