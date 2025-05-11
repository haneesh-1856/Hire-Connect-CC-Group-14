import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 animate-fade-in">
      <div className="bg-blue-100 p-4 rounded-full mb-4">
        <AlertCircle size={48} className="text-blue-700" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link
          to="/"
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-medium text-center btn"
        >
          Go to Home
        </Link>
        
        <Link
          to="/jobs"
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-md font-medium text-center"
        >
          Browse Jobs
        </Link>
      </div>
    </div>
  );
};

export default NotFound;