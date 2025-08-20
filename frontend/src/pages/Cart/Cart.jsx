import "./Cart.css";
import React, { useContext } from "react";
import { StoreContext } from "../../components/context/StoreContext";
import { useNavigate, Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, addToCart } = useContext(StoreContext);
  const navigate = useNavigate();

  // Check if cart is empty
  const isCartEmpty = getTotalCartAmount() === 0;

  
  if (isCartEmpty) {
    return (
      <div className="cart">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          flexDirection: 'column'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '20px',
            opacity: '0.8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              fontSize: '4rem',
              position: 'relative',
              color: '#666'
            }}>🍽️</div>
            <div style={{
              position: 'absolute',
              bottom: '-5px',
              right: '-5px',
              width: '25px',
              height: '25px',
              backgroundColor: 'tomato',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              color: 'white',
              fontWeight: 'bold',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>0</div>
          </div>
          <h2 style={{
            color: '#333',
            fontSize: '2rem',
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            Your Cart is Empty
          </h2>
          <p style={{
            color: '#666',
            fontSize: '1.1rem',
            marginBottom: '30px',
            lineHeight: '1.5'
          }}>
            Start your food journey by adding some delicious items!
          </p>
          <button 
            onClick={() => navigate('/')}
            style={{
              border: 'none',
              color: 'white',
              backgroundColor: 'tomato',
              padding: '15px 30px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e74c3c'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'tomato'}
          >
            Continue Ordering
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <React.Fragment key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt="" />
                  <Link to={`/food/${item._id}`}>{item.name}</Link>
                  <p>${item.price}</p>
                  <div className="cart-quantity-controls">
                    <button onClick={() => removeFromCart(item._id)}>-</button>
                    <span>{cartItems[item._id]}</span>
                    <button onClick={() => addToCart(item._id)}>+</button>
                  </div>
                  <p>${item.price * cartItems[item._id]}</p>
                </div>
                <hr />
              </React.Fragment>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b><p>Total</p></b>
            <b><p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount()+2}</p></b>
          </div>
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promo-code">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input placeholder="Promo Code" type="text" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
