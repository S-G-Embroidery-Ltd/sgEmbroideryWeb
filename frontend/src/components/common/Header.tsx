import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.tsx';
import { useCart } from '../../hooks/useCart.tsx';
import sgLogo from '../../assets/sg 2.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const cartCount = getCartCount();
  console.log('Cart count in header:', cartCount);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-black shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={sgLogo} alt="SG Embroidery" className="h-14 w-auto" />
            <div className="text-xl font-bold text-black font-sans">
              S & G Embroidery Ltd
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-black hover:text-primary-600 transition-colors font-medium ${
                isActivePath('/') ? 'text-primary-600 border-b-2 border-primary-600' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`text-black hover:text-primary-600 transition-colors font-medium ${
                isActivePath('/shop') || isActivePath('/shop/') ? 'text-primary-600 border-b-2 border-primary-600' : ''
              }`}
            >
              Shop
            </Link>
            
            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="text-black hover:text-primary-600 transition-colors font-medium flex items-center">
                Resources
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-black rounded-2xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/tools"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-50 rounded-xl"
                >
                  Tools & Resources
                </Link>
                <Link
                  to="/quote"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-50 rounded-xl"
                >
                  Get Quote
                </Link>
              </div>
            </div>
            <Link
              to="/about"
              className={`text-black hover:text-primary-600 transition-colors font-medium ${
                isActivePath('/about') ? 'text-primary-600 border-b-2 border-primary-600' : ''
              }`}
            >
              About Us
            </Link>
            <Link
              to="/blog"
              className={`text-black hover:text-primary-600 transition-colors font-medium ${
                isActivePath('/blog') ? 'text-primary-600 border-b-2 border-primary-600' : ''
              }`}
            >
              Blog
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-black hover:text-primary-600 transition-colors rounded-xl hover:bg-gray-50"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 text-black hover:text-primary-600 transition-colors relative rounded-xl hover:bg-gray-50"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-black hover:text-primary-600 transition-colors rounded-xl hover:bg-gray-50">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-black rounded-2xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-50 rounded-xl"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-50 rounded-xl"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-50 rounded-xl"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-black hover:text-primary-600 transition-colors border border-black hover:border-primary-600 rounded-2xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-black hover:text-primary-600 transition-colors rounded-xl hover:bg-gray-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search Bar (Desktop) */}
        {isSearchOpen && (
          <div className="hidden md:block py-4 border-t border-black">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-10 border border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-black" />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-black">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`text-black hover:text-primary-600 transition-colors font-medium ${
                  isActivePath('/') ? 'text-primary-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`text-black hover:text-primary-600 transition-colors font-medium ${
                  isActivePath('/shop') ? 'text-primary-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              
              {/* Mobile Resources Section */}
              <div className="space-y-2">
                <div className="text-black font-medium">Resources</div>
                <div className="ml-4 space-y-2">
                  <Link
                    to="/tools"
                    className={`text-black hover:text-primary-600 transition-colors text-sm ${
                      isActivePath('/tools') ? 'text-primary-600' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tools & Resources
                  </Link>
                  <Link
                    to="/quote"
                    className={`text-black hover:text-primary-600 transition-colors text-sm ${
                      isActivePath('/quote') ? 'text-primary-600' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
              <Link
                to="/about"
                className={`text-black hover:text-primary-600 transition-colors font-medium ${
                  isActivePath('/about') ? 'text-primary-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/blog"
                className={`text-black hover:text-primary-600 transition-colors font-medium ${
                  isActivePath('/blog') ? 'text-primary-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
            </nav>

            <div className="mt-4 pt-4 border-t border-black flex flex-col space-y-3">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-black hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>{user.name}</span>
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center space-x-2 text-black hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Package className="w-5 h-5" />
                    <span>My Orders</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-center px-4 py-2 text-sm font-medium text-black hover:text-primary-600 transition-colors border border-black hover:border-primary-600 rounded-2xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-center px-4 py-2 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
