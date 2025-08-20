import React, { useContext, useState, useEffect } from "react";
import "./CartSummaryBar.css";
import { StoreContext } from "../context/StoreContext";
import { useNavigate, useLocation } from "react-router-dom"; //  import useLocation
import { food_list } from "../../assets/frontend_assets/assets";
import { ShoppingCart, DollarSign } from "lucide-react"; // Add Lucide icons

const FREE_DELIVERY_THRESHOLD = 150; // You can adjust this value as needed

const CartSummaryBar = () => {
  const { cartItems, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false); // to show the preview cart dropdown
  const [isVisible, setIsVisible] = useState(false); // to show the cart summary bar

  const totalItems = Object.values(cartItems).reduce(
    (sum, item) => sum + item,
    0
  );
  const totalAmount = getTotalCartAmount();
  const deliveryProgress = Math.min(totalAmount / FREE_DELIVERY_THRESHOLD, 1);
  const amountLeft = Math.max(FREE_DELIVERY_THRESHOLD - totalAmount, 0);

  // Handle slide-in and slide-out animations
  useEffect(() => {
    if (totalItems > 0 && location.pathname !== "/cart") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [totalItems, location.pathname]);

  // Get cart item details
  const cartDetails = Object.entries(cartItems)
    .filter(([id, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = food_list.find((f) => f._id === id);
      return item ? { ...item, qty } : null;
    })
    .filter(Boolean);

  return (
    <div
      className={`cart-summary-bar ${isVisible ? "slide-in" : "slide-out"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cart-summary-info">
        <div className="cart-info-item">
          <ShoppingCart size={18} className="cart-icon" />
          <span className="cart-text">
            {totalItems} {totalItems === 1 ? "item" : "items"} in cart
          </span>
        </div>
        <div className="cart-info-divider"></div>
        <div className="cart-info-item">
          <DollarSign size={18} className="price-icon" />
          <span className="cart-text">Total: ${totalAmount.toFixed(2)}</span>
        </div>
      </div>
      {/* Free Delivery Progress Bar */}
      <div className="free-delivery-progress-container">
        <div className="free-delivery-progress-bar-bg">
          <div
            className="free-delivery-progress-bar-fill"
            style={{ width: `${deliveryProgress * 100}%` }}
          ></div>
        </div>
        <div className="free-delivery-progress-text">
          {deliveryProgress < 1 ? (
            <span>
              Add <b>${amountLeft.toFixed(2)}</b> more for <b>Free Delivery</b>!
            </span>
          ) : (
            <span>
              🎉 <b>Congratulations!</b> You have unlocked <b>Free Delivery</b>!
            </span>
          )}
        </div>
      </div>
      {/* View Cart Button */}
      <button className="view-cart-btn" onClick={() => navigate("/cart")}>
        VIEW CART
      </button>
      {isHovered && (
        <div className="mini-cart-dropdown">
          {cartDetails.length === 0 ? (
            <div className="mini-cart-empty">Your cart is empty.</div>
          ) : (
            <>
              <ul>
                {cartDetails.map((item) => (
                  <li key={item._id} className="mini-cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="mini-cart-thumb"
                    />
                    <span>{item.name}</span>
                    <span>x{item.qty}</span>
                    <span>${item.price * item.qty}</span>
                  </li>
                ))}
              </ul>
              <div className="mini-cart-footer">
                <div className="mini-cart-total">
                  <span>Total: ${totalAmount}</span>
                </div>
                <button
                  className="proceed-checkout-btn"
                  onClick={() => navigate("/order")}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartSummaryBar;
