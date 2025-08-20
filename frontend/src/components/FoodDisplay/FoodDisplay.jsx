import React, { useContext, useState } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [filterType, setFilterType] = useState('all'); // all | veg | non-veg

  const handleToggle = (type) => {
    setFilterType(type);
  };

  const filteredFoodList = food_list.filter((item) => {
    const matchCategory = category === item.category || category === 'All';
    const matchType =
      filterType === 'all' ||
      (filterType === 'veg' && item.type === 'veg') ||
      (filterType === 'non-veg' && item.type === 'nonveg');
    return matchCategory && matchType;
  });

  return (
    <div className='food-display' id='food-display'>
      <h2>Top Dishes Near You</h2>
      
      {/* Toggle Buttons */}
      <div className="filter-toggle">
        <button
          className={filterType === 'all' ? 'active' : ''}
          onClick={() => handleToggle('all')}
        >
          All
        </button>
        <button
          className={filterType === 'veg' ? 'active' : ''}
          onClick={() => handleToggle('veg')}
        >
          Veg
        </button>
        <button
          className={filterType === 'non-veg' ? 'active' : ''}
          onClick={() => handleToggle('non-veg')}
        >
          Non-Veg
        </button>
      </div>

      <div className='food-display-list'>
        {filteredFoodList.map((item, index) => (
          <FoodItem
            key={index}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay