import { footerLinks } from "@/constants";
import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="info">
        <p>
          More ways to shop: <span>Find an Apple Store</span> or other retailer
          near you. Or call <span>000800 040 1966.</span>
        </p>
        <img src="/logo.svg" alt="Apple logo" />
      </div>
      <hr />
      <div className="links">
        <p>Copyright © 2026 Apple Inc. All rights reserved.</p>
        <ul>
            {footerLinks.map((link) => (
                <li key={link.label}>
                    <a href={link.link} target="_blank" >{link.label}</a>
                </li>
            ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
