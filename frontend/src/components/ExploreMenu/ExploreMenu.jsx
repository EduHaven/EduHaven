import React, { useRef, useEffect, useState, useCallback } from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/frontend_assets/assets";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ExploreMenu = ({ category, setCategory }) => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pauseTimeoutRef = useRef(null);

  // Auto-scroll function using requestAnimationFrame for smooth animation
  const autoScroll = () => {
    if (isPaused || isHovered || !scrollRef.current) {
      return; //  Stop animation completely while hovered/paused
    }

    const container = scrollRef.current;
    const scrollSpeed = 0.5; // Pixels per frame
    
    // Move forward
    container.scrollLeft += scrollSpeed;
    
    // Calculate when to reset with better precision
    const scrollWidth = container.scrollWidth;
    const halfWidth = scrollWidth / 2;
    const resetBuffer = 20; // Small buffer to ensure clean reset
    
    // Reset when we've scrolled past the first set (with buffer)
    if (container.scrollLeft >= halfWidth - resetBuffer) {
      container.scrollLeft = 0;
      console.log("Auto-scroll reset triggered"); // Debug log
    }
    
    // Continue the animation
    animationRef.current = requestAnimationFrame(autoScroll);
  };

  // Manual scroll with arrows
  const handleManualScroll = (direction) => {
    console.log(`Button clicked: ${direction}`); // Debug log
    
    if (!scrollRef.current) {
      console.log("No scrollRef available"); // Debug log
      return;
    }
    
    const container = scrollRef.current;
    const scrollAmount = 300;
    
    // Calculate safe boundaries to avoid reset issues
    const scrollWidth = container.scrollWidth;
    const halfWidth = scrollWidth / 2;
    const safeZone = 100; // Buffer to stay away from reset boundary
    
    console.log(`Current scroll position: ${container.scrollLeft}`); // Debug log
    console.log(`Half width (reset point): ${halfWidth}`); // Debug log
    
    // Stop auto-scroll first
    setIsPaused(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Calculate new position
    let newPosition;
    if (direction === "left") {
      newPosition = container.scrollLeft - scrollAmount;
      // If going too far left, wrap to safe position before reset point
      if (newPosition < 0) {
        newPosition = halfWidth - safeZone - scrollAmount;
      }
    } else {
      newPosition = container.scrollLeft + scrollAmount;
      // If getting too close to reset point, wrap to beginning
      if (newPosition >= halfWidth - safeZone) {
        newPosition = 0;
      }
    }
    
    // Apply the safe scroll position
    container.scrollLeft = newPosition;
    
    console.log(`New scroll position: ${container.scrollLeft}`); // Debug log
    
    // Clear existing timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    // Resume after 1 second
    pauseTimeoutRef.current = setTimeout(() => {
      console.log("Resuming auto-scroll"); // Debug log
      // Normalize position before resuming to ensure we're in a safe zone
      if (scrollRef.current) {
        const currentPos = scrollRef.current.scrollLeft;
        const resetPoint = scrollRef.current.scrollWidth / 2;
        if (currentPos >= resetPoint - 50) {
          scrollRef.current.scrollLeft = 0;
          console.log("Normalized position before resuming"); // Debug log
        }
      }
      setIsPaused(false);
    }, 900);
  };

  // Hover handlers
  const handleMouseEnter = () => {
    console.log("Mouse entered - pausing scroll");
    setIsHovered(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current); //  Stop animation on hover
    }
  };
  
  const handleMouseLeave = () => {
    console.log("Mouse left - resuming scroll");
    setIsHovered(false);
    if (!isPaused) {
      animationRef.current = requestAnimationFrame(autoScroll); //  Resume animation after hover
    }
  };

  // Start auto-scroll on mount
  useEffect(() => {
    animationRef.current = requestAnimationFrame(autoScroll);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  // Restart animation when pause state changes
  useEffect(() => {
    if (!isPaused && !isHovered) {
      animationRef.current = requestAnimationFrame(autoScroll);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, isHovered]);


  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore Our Menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes crafted with passion. 
        Our mission is to satisfy your cravings and elevate your dining experience, 
        one delicious meal at a time.
      </p>

      <div 
        className="explore-menu-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          className="arrow left" 
          onClick={() => handleManualScroll("left")}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #ccc',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          &#8249;
        </button>
        
        <div 
          className="explore-menu-list" 
          ref={scrollRef}
        >
          {/* Triple the items for seamless infinite scroll */}
          {[...menu_list, ...menu_list, ...menu_list].map((item, index) => (
            <a href="#food-display">  
              <div
                onClick={() =>                                                                
                  setCategory(
                    category === item.menu_name ? "All" : item.menu_name
                  )
                }
                key={`${item.menu_name}-${index}`}
                className="explore-menu-list-item"
              >
                <img
                  className={category === item.menu_name ? "active" : ""}
                  src={item.menu_image}
                  alt={item.menu_name}
                />
                <p>{item.menu_name}</p>
              </div>
            </a>
          ))}
        </div>
        
        <button 
          className="arrow right" 
          onClick={() => handleManualScroll("right")}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #ccc',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          &#8250;
        </button>
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;