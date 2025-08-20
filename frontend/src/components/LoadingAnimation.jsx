import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoadingAnimation.css";
import TextType from './Typetext/typetext';

const LoadingAnimation = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Delivering happiness, one bite at a time…";

  // Fixed typewriter effect
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Navigate after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-container">
      
      {/* Animated City Skyline */}
      <div className="city-skyline">
        <div className="buildings-container">
          <div className="building building-1"></div>
          <div className="building building-2"></div>
          <div className="building building-3"></div>
          <div className="building building-4"></div>
          <div className="building building-5"></div>
          <div className="building building-6"></div>
          <div className="building building-7"></div>
          <div className="building building-8"></div>
          <div className="building building-9"></div>
          <div className="building building-10"></div>
          <div className="building building-11"></div>
          <div className="building building-12"></div>
        </div>
      </div>

      {/* Main Loading Section - Centered */}
      <div className="main-loader">
        
        {/* Enhanced Loading Progress Circle */}
        <div className="loader-wrapper">
          <div className="loader-circle">
            {/* Outer glow ring */}
            <div className="glow-ring"></div>
            
            <svg className="progress-svg" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff9800" />
                  <stop offset="50%" stopColor="#ffc107" />
                  <stop offset="100%" stopColor="#ff9800" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="rgba(255, 248, 225, 0.3)"
                strokeWidth="12"
              />
              
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeDasharray="220"
                strokeDashoffset="55"
                filter="url(#glow)"
                className="progress-circle"
                strokeLinecap="round"
              />
              
              {/* Inner accent circle */}
              <circle
                cx="50"
                cy="50"
                r="25"
                fill="none"
                stroke="rgba(255, 193, 7, 0.4)"
                strokeWidth="2"
                strokeDasharray="5 5"
                className="inner-circle"
              />
            </svg>
            
            {/* Center logo/icon */}
            <div className="center-icon">
              <div className="icon-circle">
                <span className="scooter-emoji">🛵</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Scooter Animation */}
        <div className="scooter-section">
          <div className="scooter-animation">
            <div className="scooter-container">
              {/* Enhanced Scooter Shadow */}
              <div className="scooter-shadow"></div>
              
              {/* Larger Scooter SVG */}
              <svg
                  className="scooter-svg"
                  viewBox="0 0 100 60"
                  width="200"
                  height="120"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Wheels */}
                  <circle cx="20" cy="45" r="8" fill="#3e2723" />
                  <circle cx="20" cy="45" r="5" fill="#ff9800" />
                  <circle cx="70" cy="45" r="8" fill="#3e2723" />
                  <circle cx="70" cy="45" r="5" fill="#ff9800" />

                  {/* Scooter Body */}
                  <rect x="20" y="30" width="40" height="10" rx="5" fill="#ffc107" />
                  <rect x="50" y="15" width="20" height="18" rx="6" fill="#ff9800" />

                  {/* Headlight */}
                  <circle cx="68" cy="24" r="4" fill="#fff8e1" />
                  <circle cx="68" cy="24" r="2" fill="#ffffff" />

                  {/* Handle */}
                  <rect x="66" y="12" width="1.5" height="6" fill="#3e2723" />
                  <rect x="64" y="12" width="6" height="1.5" fill="#3e2723" rx="1" />

                  {/* Delivery Box */}
                  <rect x="55" y="5" width="10" height="10" rx="2" fill="#ff9800" />
                  <circle cx="60" cy="10" r="3" fill="#fff8e1" />
                  <path d="M58 8 L60 10 L62 8" stroke="#3e2723" strokeWidth="1" fill="none" />
                </svg>

                {/* Delivery Person */}
                <div className="delivery-person" style={{ position: "absolute", top: "10px", left: "42px" }}>
                  <svg viewBox="0 0 20 20" width="40" height="40" className="person-svg">
                    {/* Head */}
                    <circle cx="10" cy="5" r="4" fill="#3e2723" />
                    <circle cx="10" cy="5" r="2" fill="#fff8e1" />

                    {/* Body */}
                    <rect x="6" y="9" width="8" height="8" rx="4" fill="#ff9800" />
                  </svg>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Path */}
      <div className="delivery-path">
        <svg className="path-svg" viewBox="0 0 800 60" preserveAspectRatio="none">
          <path
            d="M0 40 Q200 15 400 35 T800 40"
            fill="none"
            stroke="#ff9800"
            strokeWidth="4"
            strokeDasharray="20 15"
            opacity="0.7"
          />
          <path
            d="M0 45 Q200 20 400 40 T800 45"
            fill="none"
            stroke="#ffc107"
            strokeWidth="2"
            strokeDasharray="10 8"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Enhanced Floating Food Icons */}
      <div className="floating-icons">
        <div className="food-icon food-1">
          <div className="icon-container">
            <img
              src="https://cdn0.iconfinder.com/data/icons/fastfood-31/64/hamburger-fast-food-fastfood-burger-food-bread-128.png"
              alt="Hamburger icon"
            />
          </div>
        </div>
        
        <div className="food-icon food-2">
          <div className="icon-container">
            <img
              src="https://cdn3.iconfinder.com/data/icons/food-set-3/91/Food_C219-128.png"
              alt="pizza icon"
            />
          </div>
        </div>
        
        
        <div className="food-icon food-3">
          <div className="icon-container">
            <img
              src="https://cdn2.iconfinder.com/data/icons/coffee-19/450/Frappe-128.png"
              alt="coke icon"
            />
          </div>
        </div>
        
        <div className="food-icon food-4">
          <div className="icon-container">
            <img
              src="https://cdn2.iconfinder.com/data/icons/international-food/64/ramen-128.png"
              alt="food icon"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Typewriter Loading Message */}
      <div>
          <TextType 
            text={["Food At Your Doorstep....."]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
      </div>
    </div>
  );
};

export default LoadingAnimation;



