import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, ChevronDown, Menu, X, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../hooks/useCart.tsx';
import ProfileDropdown from './ProfileDropdown';
import sgLogo from '../../assets/sg 2.png';

const navPill = (active: boolean) =>
  `text-sm font-medium tracking-wide px-3 py-2 rounded-full transition-all duration-200 ${
    active
      ? 'bg-primary-100 text-primary-900 shadow-sm'
      : 'text-primary-800/95 hover:text-primary-900 hover:bg-primary-50/90'
  }`;

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const location = useLocation();

  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
  };

  const isActivePath = (path: string) => location.pathname === path;
  const isActivePrefix = (prefix: string) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`);

  const servicesPaths = ['/branding', '/textile-solutions', '/portfolio'];
  const servicesActive = servicesPaths.some((p) => isActivePrefix(p));
  const companyActive =
    isActivePath('/about') || isActivePath('/blog') || isActivePath('/stories') || isActivePath('/careers') ||
    isActivePath('/projects') || isActivePath('/volunteer');

  // Lock body scroll and hide WhatsApp buttons when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-card border-b-[3px] border-secondary-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-[4rem] md:min-h-[4.25rem] py-2 sm:py-3">
          <Link to="/" className="flex items-center gap-2.5 min-w-0 group">
            <img src={sgLogo} alt="" className="h-10 md:h-11 w-auto shrink-0 drop-shadow-sm" />
            <span className="hidden sm:block text-sm md:text-base font-bold text-primary-900 truncate tracking-tight group-hover:text-primary-800 transition-colors">
              S & G Embroidery
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-3">
            <Link to="/" className={navPill(isActivePath('/'))}>
              Home
            </Link>
            <Link
              to="/shop"
              className={navPill(isActivePath('/shop') || location.pathname.startsWith('/shop/'))}
            >
              Shop
            </Link>

            <div className="relative group">
              <button
                type="button"
                className={`inline-flex items-center gap-1 text-sm font-medium tracking-wide px-4 py-2 rounded-full transition-all ${
                  servicesActive
                    ? 'bg-primary-100 text-primary-900 shadow-sm'
                    : 'text-primary-800/95 hover:text-primary-900 hover:bg-primary-50/90'
                }`}
                aria-expanded="false"
                aria-haspopup="true"
              >
                Services
                <ChevronDown className="w-3.5 h-3.5 opacity-70" strokeWidth={2} />
              </button>
              <div
                className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[220px] transform group-hover:translate-y-0 translate-y-1"
                role="menu"
              >
                <div className="bg-white rounded-2xl shadow-float py-3 px-2 border border-primary-100/50">
                  <Link
                    to="/branding"
                    role="menuitem"
                    className="block px-3 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Branding
                  </Link>
                  <Link
                    to="/textile-solutions"
                    role="menuitem"
                    className="block px-3 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Textile solutions
                  </Link>
                  <Link
                    to="/portfolio"
                    role="menuitem"
                    className="block px-3 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Portfolio
                  </Link>
                </div>
              </div>
            </div>

            <Link to="/tools" className={navPill(isActivePath('/tools'))}>
              Tools & Resources
            </Link>

            <div className="relative group">
              <button
                type="button"
                className={`inline-flex items-center gap-1 text-sm font-medium tracking-wide px-4 py-2 rounded-full transition-all ${
                  companyActive || isActivePath('/projects') || isActivePath('/volunteer')
                    ? 'bg-primary-100 text-primary-900 shadow-sm'
                    : 'text-primary-800/95 hover:text-primary-900 hover:bg-primary-50/90'
                }`}
                aria-expanded="false"
                aria-haspopup="true"
              >
                About
                <ChevronDown className="w-3.5 h-3.5 opacity-70" strokeWidth={2} />
              </button>
              <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[220px] transform group-hover:translate-y-0 translate-y-1">
                <div className="bg-white rounded-2xl shadow-float py-3 px-2 border border-primary-100/50">
                  <div className="px-2 pb-2 border-b border-primary-100/50">
                    <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2">Company</p>
                  </div>
                  <Link
                    to="/about"
                    role="menuitem"
                    className="block px-3 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    About us
                  </Link>
                  <Link
                    to="/blog"
                    role="menuitem"
                    className="block px-3 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/careers"
                    role="menuitem"
                    className="block px-3 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Careers
                  </Link>
                  <div className="px-2 py-2 border-t border-primary-100/50">
                    <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2">Community</p>
                  </div>
                  <Link
                    to="/projects"
                    role="menuitem"
                    className="block px-3 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Projects
                  </Link>
                  <Link
                    to="/volunteer"
                    role="menuitem"
                    className="block px-3 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Volunteer
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/quote"
              className="hidden xl:inline-flex items-center px-4 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide bg-secondary-500 text-primary-900 shadow-md hover:bg-secondary-400 transition-colors"
            >
              Project quote
            </Link>

            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 text-primary-800 hover:bg-primary-50 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-[1.125rem] h-[1.125rem]" strokeWidth={2} />
            </button>

            <Link
              to="/cart"
              className="p-2.5 text-primary-800 hover:bg-primary-50 rounded-full transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-[1.125rem] h-[1.125rem]" strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[1.125rem] h-4 px-0.5 bg-accent-600 text-white text-[10px] leading-4 font-bold text-center rounded-full">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2 ml-1 pl-3">
                <ProfileDropdown />
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1 pl-3">
                <Link to="/login">
                  <button className="text-sm font-medium text-primary-800 hover:text-primary-600 px-3 py-2 rounded-full hover:bg-primary-50 transition-colors">
                    Log in
                  </button>
                </Link>
                <Link to="/register">
                  <button className="text-sm font-bold text-white bg-primary-800 px-4 py-2.5 rounded-full hover:bg-primary-900 transition-colors shadow-sm">
                    Sign up
                  </button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-1">
            <Link
              to="/quote"
              className="px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wide bg-secondary-500 text-primary-900 shadow-sm"
            >
              Quote
            </Link>
            <Link
              to="/cart"
              className="p-2 text-primary-800 hover:bg-primary-50 rounded-full relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[1.125rem] h-4 px-0.5 bg-accent-600 text-white text-[10px] leading-4 font-bold text-center rounded-full">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-primary-800 hover:bg-primary-50 rounded-full -mr-1"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="w-6 h-6" strokeWidth={2} /> : <Menu className="w-6 h-6" strokeWidth={2} />}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="hidden lg:block pb-4">
            <div className="relative pt-2">
              <input
                type="search"
                placeholder="Search products…"
                className="w-full text-sm py-3 px-4 rounded-2xl bg-surface border-0 shadow-card focus:ring-2 focus:ring-secondary-400/50 placeholder:text-primary-400 text-primary-900"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none" strokeWidth={2} />
            </div>
          </div>
        )}

        {/* Mobile Hamburger Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-primary-200 shadow-2xl z-[9999] max-h-[70vh] overflow-y-auto">
            <nav className="py-4 px-4 space-y-1">
              <Link
                to="/"
                className={`block py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  isActivePath('/') ? 'bg-primary-100 text-primary-900' : 'text-primary-800 hover:bg-primary-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`block py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  isActivePath('/shop') || location.pathname.startsWith('/shop/') ? 'bg-primary-100 text-primary-900' : 'text-primary-800 hover:bg-primary-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>

              <div className="pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-primary-500 mb-2 px-4">Services</div>
                <div className="space-y-1">
                  {[
                    ['/branding', 'Branding'],
                    ['/textile-solutions', 'Textile solutions'],
                    ['/portfolio', 'Portfolio'],
                  ].map(([href, label]) => (
                    <Link
                      key={href}
                      to={href}
                      className="block py-2.5 px-4 rounded-xl text-sm text-primary-800 hover:bg-primary-50 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/tools"
                className={`block py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  isActivePath('/tools') ? 'bg-primary-100 text-primary-900' : 'text-primary-800 hover:bg-primary-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Tools & Resources
              </Link>

              <div className="pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-primary-500 mb-2 px-4">About</div>
                <div className="space-y-1">
                  <div className="px-4 pb-1">
                    <p className="text-xs font-medium text-primary-400">Company</p>
                  </div>
                  {[
                    ['/about', 'About us'],
                    ['/blog', 'Blog'],
                    ['/careers', 'Careers'],
                  ].map(([href, label]) => (
                    <Link
                      key={href}
                      to={href}
                      className="block py-2.5 px-4 rounded-xl text-sm text-primary-800 hover:bg-primary-50 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                  <div className="px-4 py-1">
                    <p className="text-xs font-medium text-primary-400">Community</p>
                  </div>
                  {[
                    ['/projects', 'Projects'],
                    ['/volunteer', 'Volunteer'],
                  ].map(([href, label]) => (
                    <Link
                      key={href}
                      to={href}
                      className="block py-2.5 px-4 rounded-xl text-sm text-primary-800 hover:bg-primary-50 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-primary-200">
                <Link
                  to="/quote"
                  className="block py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wide bg-secondary-500 text-primary-900 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Project Quote
                </Link>
              </div>
            </nav>

            <div className="border-t border-primary-200 p-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 py-3 px-3 rounded-xl bg-surface mb-2">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-primary-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-primary-900">{user.name}</p>
                      <p className="text-xs text-primary-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 py-3 px-3 rounded-xl text-sm font-medium text-primary-800 hover:bg-surface"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" strokeWidth={2} />
                      Profile
                    </Link>
                    <Link
                      to="/my-activity"
                      className="flex items-center gap-3 py-3 px-3 rounded-xl text-sm font-medium text-primary-800 hover:bg-surface"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Package className="w-4 h-4" strokeWidth={2} />
                      My Activity
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left py-3 px-3 rounded-xl text-sm font-medium text-primary-800 hover:bg-surface"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" className="block">
                    <button
                      className="w-full py-3 rounded-2xl text-sm font-medium text-primary-900 bg-surface hover:bg-primary-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in
                    </button>
                  </Link>
                  <Link to="/register" className="block">
                    <button
                      className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-primary-800 hover:bg-primary-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
