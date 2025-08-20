import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { StoreContext } from '../../components/context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';
import "./wishlist.css";

const SharedWishlist = () => {
  const { food_list } = useContext(StoreContext);
  const { userId } = useParams();
  const [wishlistedItems, setWishlistedItems] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const loadSharedWishlist = () => {
      try {
        // Get the shared wishlist data from localStorage
        const sharedWishlistData = localStorage.getItem(`shared_wishlist_${userId}`);
        
        if (!sharedWishlistData) {
          setError('Wishlist not found or has expired');
          setLoading(false);
          return;
        }

        const { wishlistIds, userName: ownerName, createdAt, viewCount = 0 } = JSON.parse(sharedWishlistData);
        
        // Check if the link has expired (24 hours)
        const now = new Date().getTime();
        const linkAge = now - createdAt;
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (linkAge > twentyFourHours) {
          setError('This shared wishlist link has expired');
          setLoading(false);
          return;
        }

        // Update view count
        const updatedData = {
          wishlistIds,
          userName: ownerName,
          createdAt,
          viewCount: viewCount + 1
        };
        localStorage.setItem(`shared_wishlist_${userId}`, JSON.stringify(updatedData));

        setUserName(ownerName);
        setViewCount(viewCount + 1);
        
        // Filter food items based on the shared wishlist IDs
        const filtered = food_list.filter(food => wishlistIds.includes(food._id));
        setWishlistedItems(filtered);
        setLoading(false);
      } catch (err) {
        setError('Failed to load wishlist');
        setLoading(false);
      }
    };

    loadSharedWishlist();
  }, [userId, food_list]);

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="loading">Loading shared wishlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <div className="error-message">
          <h2>❌ {error}</h2>
          <p>The link may be invalid or the wishlist may have been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page shared-wishlist">
      <div className="shared-wishlist-header">
        <h2>🎁 You're viewing {userName}'s wishlist</h2>
        <p className="shared-wishlist-subtitle">
          This is a shared wishlist. You can view the items but cannot modify them.
        </p>
        <div className="view-count">
          👁️ Viewed {viewCount} time{viewCount !== 1 ? 's' : ''}
        </div>
      </div>
      
      {wishlistedItems.length === 0 ? (
        <p>No items in this wishlist!</p>
      ) : (
        <div className="food-display-list">
          {wishlistedItems.map(item => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              isShared={true} // This will disable wishlist functionality
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedWishlist; 