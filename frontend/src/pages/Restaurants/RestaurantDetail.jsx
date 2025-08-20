import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const restaurants = [
    {
      id: 1,
      name: "The Golden Plate",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
      rating: 4.5,
      discount: "20% OFF",
      cuisine: "Italian",
      deliveryTime: "25-35 min",
      location: "Downtown",
      description: "Authentic Italian cuisine with fresh ingredients and traditional recipes.",
    },
    {
      id: 2,
      name: "Spice Garden",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=400&fit=crop",
      rating: 4.2,
      discount: "15% OFF",
      cuisine: "Indian",
      deliveryTime: "30-45 min",
      location: "Midtown",
      description: "Exotic Indian flavors with aromatic spices and rich curries.",
    },
    {
      id: 3,
      name: "Ocean's Catch",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop",
      rating: 4.7,
      discount: "25% OFF",
      cuisine: "Seafood",
      deliveryTime: "20-30 min",
      location: "Harbor District",
      description: "Fresh seafood and coastal cuisine with stunning ocean views.",
    },
    {
      id: 4,
      name: "Burger Haven",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=400&fit=crop",
      rating: 4.3,
      discount: "10% OFF",
      cuisine: "American",
      deliveryTime: "15-25 min",
      location: "Westside",
      description: "Gourmet burgers and comfort food with premium ingredients.",
    },
  ];

  const restaurant = restaurants.find((rest) => rest.id === parseInt(id, 10));

  if (!restaurant) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Restaurant not found</h2>
        <button onClick={() => navigate("/restaurants")}>Back to list</button>
      </div>
    );
  }

  const sampleReviews = [
    { id: 1, username: "JaneDoe", rating: 5, comment: "Amazing food and cozy atmosphere!" },
    { id: 2, username: "FoodLover99", rating: 4, comment: "Great taste but a bit slow service." },
    { id: 3, username: "ChefMaster", rating: 3, comment: "Decent flavors, but could be better." },
  ];

  const [showReviews, setShowReviews] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="#FFD700" color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} fill="#FFD700" color="#FFD700" style={{ opacity: 0.5 }} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} color="#ddd" />);
    }

    return stars;
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "1rem" }}>
      <button 
        onClick={() => navigate("/restaurants")}
         style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#3b82f6",
    border: "none",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    color: "white",
    fontSize: "1rem",
    fontWeight: "500",
    boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  }}
      >
        Back to Restaurants
      </button>

      <img
        src={restaurant.image}
        alt={restaurant.name}
        style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
      />
      <h1 style={{ marginTop: "1rem" }}>{restaurant.name}</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {renderStars(restaurant.rating)}
        <span>{restaurant.rating.toFixed(1)}</span>
        <span
          style={{
            backgroundColor: "#FF6347",
            color: "white",
            padding: "0.2rem 0.5rem",
            borderRadius: "4px",
            marginLeft: "auto",
          }}
        >
          {restaurant.discount}
        </span>
      </div>

      <p style={{ fontStyle: "italic", color: "#555" }}>
        {restaurant.cuisine} · {restaurant.deliveryTime} · {restaurant.location}
      </p>

      <p style={{ marginTop: "1rem" }}>{restaurant.description}</p>

      <button
        onClick={() => setShowReviews(!showReviews)}
        style={{
          marginTop: "1rem",
          cursor: "pointer",
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {showReviews ? "Hide Reviews ▲" : "Show Reviews ▼"}
      </button>

      {showReviews && (
        <div style={{ marginTop: "1rem" }}>
          {sampleReviews.map((review) => (
            <div
              key={review.id}
              style={{ borderTop: "1px solid #ddd", padding: "0.5rem 0", marginTop: "0.5rem" }}
            >
              <strong>{review.username}</strong>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                {renderStars(review.rating)}
                <span>{review.rating}</span>
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
