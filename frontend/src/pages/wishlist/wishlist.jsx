import { useEffect, useState, useContext } from 'react';
import { StoreContext } from '../../components/context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';
import "./wishlist.css";

const Wishlist = () => {
  const { food_list, wishlistItems } = useContext(StoreContext);
  const [wishlistedItems, setWishlistedItems] = useState([]);

  // Update wishlist items whenever wishlistItems or food_list changes
  useEffect(() => {
    const filtered = food_list.filter(food => wishlistItems[food._id]);
    setWishlistedItems(filtered);
  }, [wishlistItems, food_list]);

  return (
    <div className="wishlist-page">
      <div className="wishlist-header"style={{ padding: '20px' }}>
        <h2>Your Wishlist</h2>
        <div style={{ fontSize: '15px', color: '#666', marginBottom: '10px' }}>
          Items in wishlist: {wishlistedItems.length}
        </div>
      </div>

      {wishlistedItems.length === 0 ? (
        <p>No items wishlisted yet!</p>
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
              // Heart click in FoodItem will handle add/remove from wishlist
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
