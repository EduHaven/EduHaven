import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './List.css';

const List = ({ url }) => {
    const [list, setList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchList = async () => {
        const response = await axios.get(`${url}api/food/list`);
        if (response.data.success) {
            setList(response.data.data);
        } else {
            toast.error("Error fetching food list");
        }
    };

    const removeFood = async (foodId) => {
        const response = await axios.post(`${url}api/food/remove`, { id: foodId });
        if (response.data.success) {
            toast.success(response.data.message);
            await fetchList();
        } else {
            toast.error("Error removing food item");
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    // Filtered list based on search term
    const filteredList = list.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='list add flex-col'>
            <p>All Foods List</p>

            {/* 🔍 Search Bar */}
            <input
                type='text'
                placeholder='Search recipes by name...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='search-input'
                style={{
                    padding: '10px',
                    marginBottom: '20px',
                    width: '100%',
                    maxWidth: '400px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ccc'
                }}
            />

            <div className='list-table'>
                <div className='list-table-format title'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>

                {filteredList.length === 0 ? (
                    <p style={{ padding: '20px', fontStyle: 'italic' }}>No recipes found.</p>
                ) : (
                    filteredList.map((item, index) => (
                        <div className='list-table-format' key={index}>
                            <img src={`${url}images/${item.image}`} alt={item.name} />
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>${item.price}</p>
                            <button onClick={() => removeFood(item._id)} className='remove-btn'>
                                X
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default List;
