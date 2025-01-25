import React from 'react';
import { useNavigate } from 'react-router-dom'; // React Router v6+
import 'animate.css';

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="flex items-center justify-center min-screen pt-20 bg-gray-900 text-white">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105">
        <img
          src="../404-web-page.png" // Example 404 illustration, can be replaced with any custom image
          alt="404 Illustration"
          className="mx-auto mb-6 w-60 h-60 animate__animated animate__bounceInUp animate__delay-1s"
        />
        <h1 className="text-4xl font-bold mb-4 animate__animated animate__fadeIn animate__delay-1s">
          Oops! The page you're looking for doesn't exist. 
        </h1>
        <p className="text-lg mb-6 animate__animated animate__fadeIn animate__delay-1s">
        But you can click the button below to go back to the homepage.
        </p>
        <button
          onClick={handleRedirect}
          className="px-6 py-3 bg-orange-500 text-white text-lg rounded-md hover:bg-orange-400 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
