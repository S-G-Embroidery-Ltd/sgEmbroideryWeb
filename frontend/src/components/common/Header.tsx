import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, Package, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.tsx';
import { useCart } from '../../hooks/useCart.tsx';
import sgLogo from '../../assets/sg 2.png';

const navPill = (active: boolean) =>
  `text-sm font-medium tracking-wide px-3 py-2 rounded-full transition-all duration-200 ${
    active
      ? 'bg-primary-100 text-primary-900 shadow-sm'
      : 'text-primary-800/95 hover:text-primary-900 hover:bg-primary-50/90'
  }`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActivePath = (path: string) => location.pathname === path;
  const isActivePrefix = (prefix: string) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`);

  const toolsOrQuote =
    isActivePath('/tools') || isActivePath('/quote') || isActivePath('/logo-embroidery');
  const servicesPaths = ['/branding', '/textile-solutions', '/portfolio', '/faq', '/contact'];
  const servicesActive = servicesPaths.some((p) => isActivePrefix(p));
  const companyActive =
    isActivePath('/about') || isActivePath('/blog') || isActivePath('/stories') || isActivePath('/careers');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-card border-b-[3px] border-secondary-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-[4rem] md:min-h-[4.25rem] py-2">
          <Link to="/" className="flex items-center gap-2.5 min-w-0 group">
            <img src={sgLogo} alt="" className="h-10 md:h-11 w-auto shrink-0 drop-shadow-sm" />
            <span className="hidden sm:block text-sm md:text-base font-bold text-primary-900 truncate tracking-tight group-hover:text-primary-800 transition-colors">
              S & G Embroidery
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
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
                className={`inline-flex items-center gap-1 text-sm font-medium tracking-wide px-3 py-2 rounded-full transition-all ${
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
                className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,visibility] duration-200 z-50 min-w-[220px]"
                role="menu"
              >
                <div className="bg-white rounded-2xl shadow-float py-2 px-1">
                  <Link
                    to="/branding"
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Corporate branding
                  </Link>
                  <Link
                    to="/textile-solutions"
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Textile solutions
                  </Link>
                  <Link
                    to="/portfolio"
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Portfolio
                  </Link>
                  <Link
                    to="/faq"
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    FAQ
                  </Link>
                  <Link
                    to="/contact"
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button
                type="button"
                className={`inline-flex items-center gap-1 text-sm font-medium tracking-wide px-3 py-2 rounded-full transition-all ${
                  toolsOrQuote
                    ? 'bg-primary-100 text-primary-900 shadow-sm'
                    : 'text-primary-800/95 hover:text-primary-900 hover:bg-primary-50/90'
                }`}
                aria-expanded="false"
                aria-haspopup="true"
              >
                Resources
                <ChevronDown className="w-3.5 h-3.5 opacity-70" strokeWidth={2} />
              </button>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,visibility] duration-200 z-50 min-w-[200px]">
                <div className="bg-white rounded-2xl shadow-float py-2 px-1">
                  <Link
                    to="/tools"
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Tools & Resources
                  </Link>
                  <Link
                    to="/quote"
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Project quote
                  </Link>
                  <Link
                    to="/logo-embroidery"
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Logo embroidery (your image)
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button
                type="button"
                className={`inline-flex items-center gap-1 text-sm font-medium tracking-wide px-3 py-2 rounded-full transition-all ${
                  companyActive
                    ? 'bg-primary-100 text-primary-900 shadow-sm'
                    : 'text-primary-800/95 hover:text-primary-900 hover:bg-primary-50/90'
                }`}
                aria-expanded="false"
                aria-haspopup="true"
              >
                Company
                <ChevronDown className="w-3.5 h-3.5 opacity-70" strokeWidth={2} />
              </button>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,visibility] duration-200 z-50 min-w-[200px]">
                <div className="bg-white rounded-2xl shadow-float py-2 px-1">
                  <Link
                    to="/about"
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    About us
                  </Link>
                  <Link
                    to="/blog"
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/careers"
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                  >
                    Careers
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
              <div className="relative group ml-1 pl-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-900 hover:text-primary-700 transition-colors max-w-[140px] px-2 py-1.5 rounded-full hover:bg-primary-50"
                >
                  <User className="w-[1.125rem] h-[1.125rem] shrink-0" strokeWidth={2} />
                  <span className="truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0" strokeWidth={2} />
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,visibility] duration-200 z-50">
                  <div className="w-48 bg-white rounded-2xl shadow-float py-2 px-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-activity"
                      className="block px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                    >
                      My activity
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1 pl-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-primary-800 hover:text-primary-600 px-3 py-2 rounded-full hover:bg-primary-50 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold text-white bg-primary-800 px-4 py-2.5 rounded-full hover:bg-primary-900 transition-colors shadow-sm"
                >
                  Sign up
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

        {isMenuOpen && (
          <div className="lg:hidden pb-5">
            <nav className="flex flex-col gap-1 pt-2">
              <Link
                to="/"
                className={`py-3 px-3 rounded-xl text-sm font-medium ${navPill(isActivePath('/'))}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`py-3 px-3 rounded-xl text-sm font-medium ${navPill(isActivePath('/shop'))}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <div className="py-2 px-1">
                <div className="text-xs font-bold uppercase tracking-wider text-primary-500 mb-2 px-2">Services</div>
                {[
                  ['/branding', 'Corporate branding'],
                  ['/textile-solutions', 'Textile solutions'],
                  ['/portfolio', 'Portfolio'],
                  ['/faq', 'FAQ'],
                  ['/contact', 'Contact'],
                ].map(([href, label]) => (
                  <Link
                    key={href}
                    to={href}
                    className="block py-2.5 px-3 rounded-xl text-sm text-primary-800 hover:bg-surface"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <div className="py-2 px-1">
                <div className="text-xs font-bold uppercase tracking-wider text-primary-500 mb-2 px-2">Resources</div>
                <Link
                  to="/tools"
                  className="block py-2.5 px-3 rounded-xl text-sm text-primary-800 hover:bg-surface"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tools & Resources
                </Link>
                <Link
                  to="/quote"
                  className="block py-2.5 px-3 rounded-xl text-sm text-primary-800 hover:bg-surface"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Project quote
                </Link>
                <Link
                  to="/logo-embroidery"
                  className="block py-2.5 px-3 rounded-xl text-sm text-primary-800 hover:bg-surface"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Logo embroidery (your image)
                </Link>
              </div>
              <div className="py-2 px-1">
                <div className="text-xs font-bold uppercase tracking-wider text-primary-500 mb-2 px-2">Company</div>
                <Link
                  to="/about"
                  className="block py-2.5 px-3 rounded-xl text-sm text-primary-800 hover:bg-surface"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About us
                </Link>
                <Link
                  to="/blog"
                  className="block py-2.5 px-3 rounded-xl text-sm text-primary-800 hover:bg-surface"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  to="/careers"
                  className="block py-2.5 px-3 rounded-xl text-sm text-primary-800 hover:bg-surface"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Careers
                </Link>
              </div>
            </nav>

            <div className="mt-4 pt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 py-3 px-3 rounded-xl text-sm font-medium text-primary-800 hover:bg-surface"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" strokeWidth={2} />
                    {user.name}
                  </Link>
                  <Link
                    to="/my-activity"
                    className="flex items-center gap-2 py-3 px-3 rounded-xl text-sm font-medium text-primary-800 hover:bg-surface"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Package className="w-4 h-4" strokeWidth={2} />
                    My activity
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left py-3 px-3 rounded-xl text-sm font-medium text-primary-800 hover:bg-surface"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="text-center py-3 rounded-2xl text-sm font-medium text-primary-900 bg-surface hover:bg-primary-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="text-center py-3 rounded-2xl text-sm font-bold text-white bg-primary-800 hover:bg-primary-900 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
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
