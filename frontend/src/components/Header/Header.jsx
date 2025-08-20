import SearchBar from "../SearchBar/SearchBar";

import "./Header.css";
import { Star, Clock, MapPin, ArrowRight, Play } from "lucide-react";
const Header = () => {
  return (
    <div className="hero-container">
      <SearchBar />
      <div className="hero-background"></div>

      <div className="hero-content">
        <div className="hero-main">
          <h1 className="hero-title">
            <span className="title-line-1">Craving Something</span>
            <span className="title-line-2 gradient-text">Delicious?</span>
          </h1>

          <p className="hero-description">
            Discover a world of flavors with dishes made fresh, fast, and
            flawlessly. From comfort food to gourmet delights, we serve joy on
            every plate.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <MapPin size={16} />
              </div>
              <span className="stat-number">500+</span>
              <span className="stat-label">Restaurants</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-icon">
                <Clock size={16} />
              </div>
              <span className="stat-number">30min</span>
              <span className="stat-label">Avg Delivery</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-icon">
                <Star size={16} />
              </div>
              <span className="stat-number">4.8★</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>

          <div className="hero-actions">
            <a href="#explore-menu">
              <button className="cta-primary">
                <span>View Menu</span>
                <ArrowRight size={16} className="button-icon" />
                <div className="button-shine"></div>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
