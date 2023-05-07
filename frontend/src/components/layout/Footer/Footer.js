import React from "react";
// import playStore from "../../../images/playstore.png";
// import appStore from "../../../images/Appstore.png";
import "./Footer.css";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from '@mui/icons-material/Facebook';

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        
        <p>Download Our App for Android and iOS devices</p>
        <img
          src="https://raw.githubusercontent.com/meabhisingh/mernProjectEcommerce/master/frontend/src/images/Appstore.png"
          alt="playstore"
        />
        <img
          src="https://github.com/meabhisingh/mernProjectEcommerce/blob/master/frontend/src/images/playstore.png?raw=true"
          alt="Appstore"
        />
      </div>

      <div className="midFooter">
        <h1>ECOMMERCE</h1>
        <p>High quality is our first priority</p>

        <p>Copyrights 2023 &copy; Sanu Chakrabortty</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.instagram.com/sanu_chakrabortty/"><InstagramIcon className="insta"/></a>
        <a href="https://www.facebook.com/sanu.chakrabortty.39"><FacebookIcon className="insta"/></a>
      </div>
    </footer>
  );
};

export default Footer;
