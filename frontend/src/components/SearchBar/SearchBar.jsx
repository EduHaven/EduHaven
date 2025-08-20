import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import "./SearchBar.css";

const SearchBar = ({
  placeholder = "Search for food, restaurants, cuisines...",
  onSearch,
  suggestions = [],
  recentSearches = [],
  popularSearches = [],
  showSuggestions = true,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Sample data for demonstration
  const defaultSuggestions = useMemo(
    () => [
      "Pizza Margherita",
      "Chicken Biryani",
      "Pasta Carbonara",
      "Sushi Roll",
      "Burger Deluxe",
      "Thai Green Curry",
      "Caesar Salad",
      "Fish and Chips",
      "Tacos",
      "Ramen Noodles",
    ],
    []
  );

  const defaultRecentSearches = useMemo(
    () => ["Pizza", "Chinese food", "Desserts"],
    []
  );

  const defaultPopularSearches = useMemo(
    () => ["Pizza", "Burger", "Sushi", "Biryani", "Pasta"],
    []
  );

  // Use useMemo to prevent recreation on every render
  const allSuggestions = useMemo(
    () => (suggestions.length > 0 ? suggestions : defaultSuggestions),
    [suggestions, defaultSuggestions]
  );

  const allRecentSearches = useMemo(
    () => (recentSearches.length > 0 ? recentSearches : defaultRecentSearches),
    [recentSearches, defaultRecentSearches]
  );

  const allPopularSearches = useMemo(
    () =>
      popularSearches.length > 0 ? popularSearches : defaultPopularSearches,
    [popularSearches, defaultPopularSearches]
  );

  useEffect(() => {
    if (query.trim()) {
      const filtered = allSuggestions.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 8));
    } else {
      setFilteredSuggestions([]);
    }
  }, [query, allSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      onSearch && onSearch(searchQuery.trim());
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className={`search-bar-container ${className}`} ref={searchRef}>
      <div className="search-bar">
        <div className="search-input-wrapper">
          <div className="search-icon-sb">
            <Search size={20} />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={placeholder}
            className="search-input"
          />
          {query && (
            <button className="clear-button" onClick={handleClear}>
              <X size={28} />
            </button>
          )}
        </div>
        <button className="search-button" onClick={() => handleSearch()}>
          Search
        </button>
      </div>

      {isOpen && showSuggestions && (
        <div className="search-dropdown">
          {query.trim() ? (
            <div className="suggestions-section">
              {filteredSuggestions.length > 0 ? (
                <>
                  <div className="section-header">
                    <Search size={16} />
                    <span>Suggestions</span>
                  </div>
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Search size={16} className="suggestion-icon" />
                      <span className="suggestion-text">
                        {suggestion
                          .split(new RegExp(`(${query})`, "gi"))
                          .map((part, i) =>
                            part.toLowerCase() === query.toLowerCase() ? (
                              <mark key={i}>{part}</mark>
                            ) : (
                              part
                            )
                          )}
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="no-results">
                  <span>No suggestions found for "{query}"</span>
                </div>
              )}
            </div>
          ) : (
            <div className="default-suggestions">
              {allRecentSearches.length > 0 && (
                <div className="suggestions-section">
                  <div className="section-header">
                    <Clock size={16} />
                    <span>Recent Searches</span>
                  </div>
                  {allRecentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="suggestion-item recent-item"
                      onClick={() => handleSuggestionClick(search)}
                    >
                      <Clock size={16} className="suggestion-icon" />
                      <span className="suggestion-text">{search}</span>
                    </div>
                  ))}
                </div>
              )}

              {allPopularSearches.length > 0 && (
                <div className="suggestions-section">
                  <div className="section-header">
                    <TrendingUp size={16} />
                    <span>Popular Searches</span>
                  </div>
                  {allPopularSearches.map((search, index) => (
                    <div
                      key={index}
                      className="suggestion-item popular-item"
                      onClick={() => handleSuggestionClick(search)}
                    >
                      <TrendingUp size={16} className="suggestion-icon" />
                      <span className="suggestion-text">{search}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
