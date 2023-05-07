import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";
import SearchIcon from "@mui/icons-material/Search";
const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };
  return (
    <>
      <div className="search-container">
        <form className="search" onSubmit={searchSubmitHandler}>
          <input
            type="text"
            placeholder="Search a Product ..."
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="search-button" type="submit" value="Search">
            <SearchIcon className="search-icon"/>
          </button>
        </form>
      </div>
    </>
  );
};

export default Search;
