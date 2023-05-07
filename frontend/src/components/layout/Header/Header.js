import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import Search from "../../Search/Search.js";
import "./Header.css";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader.js";
import SpeedDialButton from "./SpeedDialButton.js";
import { GiHamburgerMenu } from "react-icons/gi";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../../Assets/logo.png";
const Header = () => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const [showHamburger, setShowHamburger] = useState(false);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="hero">
            <nav>
              <div className="hamburger-menu">
                <a href="#" onClick={() => setShowHamburger(!showHamburger)}>
                  <GiHamburgerMenu />
                </a>
              </div>
              <Link to="/">
                <img src={logo} className="logo-icon" alt="logo" />
                <h2 className="logo">Ecommerce</h2>
              </Link>
              <Search />
              <ul
                className={
                  showHamburger ? "menu-link mobile-menu-link" : "menu-link"
                }>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/products">Products</Link>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/sanu-chakrabortty123/">
                    Contact
                  </a>
                </li>
                <li>
                  <Link to="/cart">
                    <ShoppingCartIcon />
                  </Link>
                </li>
              </ul>
              {isAuthenticated ? (
                <div className="user-profile">
                  <SpeedDialButton user={user} />
                </div>
              ) : (
                <Link to="/login">
                  <button className="signUp-button">Log in</button>
                </Link>
              )}
            </nav>
          </div>
          <div className="hero-mobile">
            {showHamburger ? (
              <div className="hamburger-list">
                <a
                  href="#"
                  onClick={() => setShowHamburger(!showHamburger)}
                  className="close-icon">
                  <CloseIcon />
                </a>
                <div className="mobile-menu">
                  <li>
                    <Link
                      to="/"
                      onClick={() => setShowHamburger(!showHamburger)}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products"
                      onClick={() => setShowHamburger(!showHamburger)}>
                      Products
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/sanu-chakrabortty123/"
                      onClick={() => setShowHamburger(!showHamburger)}>
                      Contact
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/cart"
                      onClick={() => setShowHamburger(!showHamburger)}>
                      Cart
                    </Link>
                  </li>
                </div>
              </div>
            ) : (
              <></>
            )}
            <nav className="nav-mobile">
              <div className="hamburger-menu">
                <a href="#" onClick={() => setShowHamburger(!showHamburger)}>
                  <GiHamburgerMenu className="hamburger-icon" />
                </a>
              </div>
              <Link to="/">
              <img src={logo} className="logo-icon" alt="logo" />
                <h2 className="logo">Ecommerce</h2>
              </Link>
              {isAuthenticated ? (
                <div className="user-profile">
                  <SpeedDialButton user={user} />
                </div>
              ) : (
                <Link to="/login">
                  <button className="signUp-button">Log in</button>
                </Link>
              )}
            </nav>
            <Search className="mobile-search" />
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Header;
