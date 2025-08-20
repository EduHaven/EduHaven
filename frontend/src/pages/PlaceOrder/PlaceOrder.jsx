// import React, { useContext } from "react";
// import "./PlaceOrder.css";
// import { StoreContext } from "../../components/context/StoreContext";
// const PlaceOrder = () => {
//     const {getTotalCartAmount} = useContext(StoreContext)
//   return (
//     <form className="place-order">
//       <div className="place-order-left">
//         <p className="title">Delivery Information</p>
//         <div className="multi-fields">
//           <input placeholder="First Name" type="text" />
//           <input placeholder="Last Name" type="text" />
//         </div>
//         <input placeholder="Email Adress" type="email" />
//         <input placeholder="Street" type="text" />
//         <div className="multi-fields">
//           <input placeholder="City" type="text" />
//           <input placeholder="State" type="text" />
//         </div>
//         <div className="multi-fields">
//           <input placeholder="Zip Code" type="text" />
//           <input placeholder="Country" type="text" />
//         </div>
//         <input type="text" placeholder="Phone" />
//       </div>
//       <div className="place-order-right">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div className="cart-total-details">
//             <p>Subtotal</p>
//             <p>${getTotalCartAmount()}</p>
//           </div>
//           <hr />
//           <div className="cart-total-details">
//             <p>Delivery Fee</p>
//             <p>${getTotalCartAmount() === 0? 0 : 2}</p>
//           </div>
//           <hr />
//           <div className="cart-total-details">
//             <b>
//               <p>Total</p>
//             </b>
//             <b>
//               <p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</p>
//             </b>
//           </div>
//           <button>
//             PROCEED TO PAYMENT
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PlaceOrder;



import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../components/context/StoreContext";
import Location from "./Location"; // Import the Location component

const PlaceOrder = () => {
    const { getTotalCartAmount } = useContext(StoreContext);
    const [showLocationPopup, setShowLocationPopup] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLocationSelect = (locationData) => {
        setFormData(prev => ({
            ...prev,
            street: locationData.street,
            city: locationData.city,
            state: locationData.state,
            zipCode: locationData.zipCode,
            country: locationData.country
        }));
        setShowLocationPopup(false);
    };

    const handleCloseLocationPopup = () => {
        setShowLocationPopup(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");
        if (!token) {
        alert("Please log in to place your order.");
        return;
        }

        const orderData = {
        ...formData,
        cartTotal: getTotalCartAmount(),
        deliveryFee: getTotalCartAmount() === 0 ? 0 : 2,
        };

        try {
        const response = await fetch("/api/orders/place", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) throw new Error("Order failed");

        const data = await response.json();
        alert("Order placed successfully!");
        console.log("Server response:", data);

        // Optional: navigate("/thankyou");
        } catch (error) {
        console.error("Order error:", error);
        alert("Failed to place order.");
        }
    };

    return (
        <>
            <form className="place-order" onSubmit={handleSubmit}>
                <div className="place-order-left">
                    <p className="title">Delivery Information</p>
                    
                   
                    
                    <div className="multi-fields">
                        <input 
                            name="firstName"
                            placeholder="First Name" 
                            type="text" 
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                        <input 
                            name="lastName"
                            placeholder="Last Name" 
                            type="text" 
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <input 
                        name="email"
                        placeholder="Email Address" 
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <input 
                        name="street"
                        placeholder="Street" 
                        type="text" 
                        value={formData.street}
                        onChange={handleInputChange}
                    />
                    <div className="multi-fields">
                        <input 
                            name="city"
                            placeholder="City" 
                            type="text" 
                            value={formData.city}
                            onChange={handleInputChange}
                        />
                        <input 
                            name="state"
                            placeholder="State" 
                            type="text" 
                            value={formData.state}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="multi-fields">
                        <input 
                            name="zipCode"
                            placeholder="Zip Code" 
                            type="text" 
                            value={formData.zipCode}
                            onChange={handleInputChange}
                        />
                        <input 
                            name="country"
                            placeholder="Country" 
                            type="text" 
                            value={formData.country}
                            onChange={handleInputChange}
                        />
                    </div>
                    <input 
                        name="phone"
                        type="text" 
                        placeholder="Phone" 
                        value={formData.phone}
                        onChange={handleInputChange}
                    />


                     {/* Location Button */}
                    <button 
                        type="button" 
                        className="select-location-btn"
                        onClick={() => setShowLocationPopup(true)}
                    >
                         Select Current Location
                    </button>
                </div>


                 



                <div className="place-order-right">
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
                            <b>
                                <p>Total</p>
                            </b>
                            <b>
                                <p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</p>
                            </b>
                        </div>
                        <button type="submit">
                            PROCEED TO PAYMENT
                        </button>
                    </div>
                </div>
            </form>

            {/* Location Popup */}
            {showLocationPopup && (
                <Location 
                    onLocationSelect={handleLocationSelect}
                    onClose={handleCloseLocationPopup}
                />
            )}
        </>
    );
};

export default PlaceOrder;