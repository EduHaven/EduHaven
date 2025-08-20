import React from "react";
import { Link } from "react-router-dom";
import notFoundImage from "../assets/frontend_assets/404.png";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <div style={styles.imageContainer}>
        <img
          src={notFoundImage}
          alt="404 Not Found"
          style={styles.image}
        />
        <Link to="/" style={styles.button}>Go Back Home</Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    backgroundColor: "#f8f9fa",
  },
  imageContainer: {
    position: "relative",
    display: "inline-block",
  },
  image: {
    width: "100%",
    maxWidth: "1200px",
    minWidth: "500px",
    height: "auto",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  },
  button: {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "10px 20px",
    backgroundColor: "#ff6b35",
    color: "white",
    textDecoration: "none",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(255, 107, 53, 0.4)",
    transition: "all 0.3s ease",
    border: "2px solid white",
    zIndex: 10,
  },
};

export default NotFound;
