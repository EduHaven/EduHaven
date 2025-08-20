import React, { useContext } from "react";
import "./AppDownload.css";
import { assets } from "../../assets/frontend_assets/assets";
import { ThemeContext } from "../context/ThemeContext";

const AppDownload = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="appdownload" id="appdownload">
      <p>
        For Better Experience Download <br /> Foodie App
      </p>
      <div className="app-download-platforms">
        <img
          src={assets.play_store}
          alt=""
          className={`${theme === "dark" ? "image-dark" : ""}`}
        />
        <img
          src={assets.app_store}
          alt=""
          className={`${theme === "dark" ? "image-dark" : ""}`}
        />
      </div>
    </div>
  );
};

export default AppDownload;
