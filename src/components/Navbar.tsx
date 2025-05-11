import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, Briefcase as BriefcaseBusiness, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-blue-900 font-bold text-xl">
            <BriefcaseBusiness size={28} />
            <span>JobConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/jobs" className={`text-gray-600 hover:text-blue-700 transition ${location.pathname === '/jobs' ? 'font-medium text-blue-700' : ''}`}>
              Job Listings
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'job_seeker' ? (
                  <Link to="/seeker-dashboard" className={`text-gray-600 hover:text-blue-700 transition ${location.pathname === '/seeker-dashboard' ? 'font-medium text-blue-700' : ''}`}>
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/recruiter-dashboard" className={`text-gray-600 hover:text-blue-700 transition ${location.pathname === '/recruiter-dashboard' ? 'font-medium text-blue-700' : ''}`}>
                      Dashboard
                    </Link>
                    <Link to="/post-job" className={`text-gray-600 hover:text-blue-700 transition ${location.pathname === '/post-job' ? 'font-medium text-blue-700' : ''}`}>
                      Post a Job
                    </Link>
                  </>
                )}
                
                <div className="relative group">
                  <button className="flex items-center text-gray-600 hover:text-blue-700 focus:outline-none">
                    <User size={18} className="mr-1" />
                    <span>Account</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 invisible group-hover:visible transition-all duration-300 ease-in-out">
                    <div className="py-2">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-blue-700 hover:text-blue-800 font-medium">
                  Log In
                </Link>
                <Link to="/register" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition btn">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-700 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/jobs" 
                className={`text-gray-600 hover:text-blue-700 transition py-2 ${location.pathname === '/jobs' ? 'font-medium text-blue-700' : ''}`}
                onClick={closeMenu}
              >
                Job Listings
              </Link>
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'job_seeker' ? (
                    <Link 
                      to="/seeker-dashboard" 
                      className={`text-gray-600 hover:text-blue-700 transition py-2 ${location.pathname === '/seeker-dashboard' ? 'font-medium text-blue-700' : ''}`}
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link 
                        to="/recruiter-dashboard" 
                        className={`text-gray-600 hover:text-blue-700 transition py-2 ${location.pathname === '/recruiter-dashboard' ? 'font-medium text-blue-700' : ''}`}
                        onClick={closeMenu}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/post-job" 
                        className={`text-gray-600 hover:text-blue-700 transition py-2 ${location.pathname === '/post-job' ? 'font-medium text-blue-700' : ''}`}
                        onClick={closeMenu}
                      >
                        Post a Job
                      </Link>
                    </>
                  )}
                  
                  <Link 
                    to="/profile" 
                    className={`text-gray-600 hover:text-blue-700 transition py-2 ${location.pathname === '/profile' ? 'font-medium text-blue-700' : ''}`}
                    onClick={closeMenu}
                  >
                    Profile
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-gray-600 hover:text-blue-700 py-2 transition"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-2">
                  <Link 
                    to="/login" 
                    className="text-blue-700 hover:text-blue-800 font-medium py-2"
                    onClick={closeMenu}
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition w-max btn"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;