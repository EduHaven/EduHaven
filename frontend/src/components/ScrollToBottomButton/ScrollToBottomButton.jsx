// src/components/ScrollToBottomButton/ScrollToBottomButton.jsx
import React, { useState, useEffect } from "react";
import { FaArrowDown } from "react-icons/fa";
import "./ScrollToBottomButton.css";

const ScrollToBottomButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 50;
      setVisible(!atBottom);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return visible ? (
    <div className="scroll-to-bottom-btn" onClick={scrollToBottom}>
      <FaArrowDown />
    </div>
  ) : null;
};

export default ScrollToBottomButton;
