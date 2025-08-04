import React from 'react';
import { useNavigate } from 'react-router-dom'; // React Router v6+
import 'animate.css';

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="m-6 flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105">
        <div className="mx-auto mb-6 w-60 h-60 flex items-center justify-center text-gray-400">
          <span className="text-8xl font-bold">404</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 animate__animated animate__fadeIn animate__delay-1s">
          Oops!
        </h1>
        <p className="text-lg mb-6 animate__animated animate__fadeIn animate__delay-1s">
          This page cannot be found. Don’t worry, you can head back home with a click!
        </p>
        <button
          onClick={handleRedirect}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white"
        >
          Back to Home &gt;
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;