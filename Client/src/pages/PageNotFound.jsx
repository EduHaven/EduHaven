import { Link } from 'react-router-dom'; // Make sure to import Link

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {/* We will add an SVG or image here later */}

      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-lg mb-6">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link to="/" className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors">
        Go Back to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;