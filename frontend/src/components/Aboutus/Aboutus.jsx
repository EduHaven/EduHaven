import React, { useEffect, useState, useContext } from "react";
import "./AboutUs.css";
import { ThemeContext } from "../context/ThemeContext";

const AboutUs = () => {
  const slogan = "Delicious Food Delivered Fresh To Your Door!";
  const [text, setText] = useState("");
  const { theme } = useContext(ThemeContext); // ✅ use theme from context

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(slogan.slice(0, index + 1));
      index++;
      if (index === slogan.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`about-container ${theme === "dark" ? "dark" : "light"}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="about-title">{text}</h1>
        <p className="subtitle">
          Experience the finest cuisine with our premium food delivery service
        </p>
      </section>

      {/* Marquee */}
      <div className="marquee">
        <p className="marquee-text">
       &nbsp; 🚚 Fast Delivery Guaranteed! &nbsp; | 
&nbsp; 💯 100% Satisfaction Promise! &nbsp; | 
&nbsp; 🍴 Fresh & Hygienic Ingredients! &nbsp; | 
&nbsp; 👨‍🍳 Authentic Recipes & Expert Chefs! &nbsp; | 
&nbsp; 🛡️ Safe & Secure Packaging! &nbsp; | 
&nbsp; ⭐ Rated #1 by Our Happy Customers!
        </p>
      </div>

      {/* About Us */}
      <section className="section">
        <h2 className="section-title">About Foodies</h2>
        <p className="about-text">
          At Foodies, we serve the best Veg, Non-Veg, Italian, Chinese, Desserts, and Main Courses.
          Our focus is on <strong>taste, quality, and hygiene</strong>. We're passionate about bringing 
          you exceptional dining experiences right to your doorstep. Enjoy your favorite meals via our 
          intuitive app or website, crafted with love and delivered with care.
        </p>
      </section>

      {/* Categories */}
      <section className="section">
        <h2 className="section-title">Explore Our Categories</h2>
        <div className="categories-list">
          <div className="category-card veg">🥗 Vegetarian</div>
          <div className="category-card nonveg">🍖 Non-Vegetarian</div>
          <div className="category-card italian">🍝 Italian Cuisine</div>
          <div className="category-card chinese">🥟 Chinese Delights</div>
          <div className="category-card dessert">🍰 Sweet Desserts</div>
          <div className="category-card main">🍽️ Main Courses</div>
        </div>
      </section>

      {/* Flow */}
      <section className="section flow-section">
        <h2 className="section-title">How Ordering Works</h2>
        <div className="flow-diagram">
          <div className="flow-step">📱 Browse Menu</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">🛒 Add to Cart</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">✅ Checkout</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">💳 Payment</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">🚚 Delivery</div>
        </div>
      </section>

      {/* Payment */}
      <section className="section payment-section">
        <h2 className="section-title">Payment Methods</h2>
        <p className="payment-text">
          💳 <strong>Credit & Debit Cards</strong> &nbsp; | &nbsp; 
          📱 <strong>Digital Wallets</strong> &nbsp; | &nbsp; 
          💵 <strong>Cash on Delivery</strong>
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
