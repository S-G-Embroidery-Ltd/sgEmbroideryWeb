import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Auth Provider
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './hooks/useCart.tsx';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';

// Page Components
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Tools from './pages/Tools';
import About from './pages/About';
import Blog from './pages/Blog';
import Quote from './pages/Quote';
import MyActivity from './pages/MyActivity';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentVerify from './pages/PaymentVerify';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import SavedItems from './pages/SavedItems';
import PaymentMethods from './pages/PaymentMethods';
import Settings from './pages/Settings';
import OrderTracking from './pages/OrderTracking';
import Branding from './pages/Branding';
import TextileSolutions from './pages/TextileSolutions';
import Portfolio from './pages/Portfolio';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Stories from './pages/Stories';
import LogoEmbroidery from './pages/LogoEmbroidery';
import Careers from './pages/Careers';
import Projects from './pages/Projects';
import Volunteer from './pages/Volunteer';
import AnzishaPrize2026 from './pages/AnzishaPrize2026';
import TonyElumeluFoundation2025 from './pages/TonyElumeluFoundation2025';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-white flex flex-col">
              <Header />
              <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:id" element={<ProductDetail />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/branding" element={<Branding />} />
                <Route path="/textile-solutions" element={<TextileSolutions />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/volunteer" element={<Volunteer />} />
                <Route path="/anzisha-prize-2026" element={<AnzishaPrize2026 />} />
                <Route path="/tony-elumelu-foundation-2025" element={<TonyElumeluFoundation2025 />} />
                <Route path="/quote" element={<Quote />} />
                <Route path="/logo-embroidery" element={<LogoEmbroidery />} />
                <Route path="/orders/:id" element={<OrderTracking />} />
                <Route path="/my-activity" element={<MyActivity />} />
                <Route path="/orders" element={<Navigate to="/my-activity?tab=orders" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment/verify" element={<PaymentVerify />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/saved-items" element={<SavedItems />} />
                <Route path="/payment-methods" element={<PaymentMethods />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
              </main>
              <Footer />
              {/* WhatsApp Floating Buttons */}
              <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
                <a
                  href="https://whatsapp.com/channel/0029Va4crfrGE56p6B4WAO3E"
                  className="bg-green-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1.67-1.42-2.09-1.58-.21-.08-.42-.12-.62.08-.2.2-.76.76-.93.93-.17.17-.33.15-.51.05-.18-.1-.69-.33-1.34-.82-.65-.49-1.08-1.1-1.21-1.28-.13-.18-.13-.34-.02-.52.11-.18.38-.58.46-.78.08-.2.04-.38-.02-.57-.06-.19-.27-.66-.39-1.01-.12-.35-.05-.63.17-.87.22-.24.51-.39.85-.39.34 0 .67.01.74.01.18.01.33-.06.47-.24.14-.18.6-.73.6-.73.06-.11.11-.24.08-.38-.03-.14-.27-.84-.38-1.14-.11-.3-.22-.26-.3-.26-.08 0-.17-.01-.27-.01s-.25.03-.37.12c-.12.09-.46.43-.46 1.05 0 .62.45 1.23.51 1.32.06.09.88 1.35 2.13 1.91 1.25.56 1.25.56 1.34.59.09.03.17.02.24-.05.07-.07.27-.32.39-.51.12-.19.19-.37.15-.56-.04-.19-.16-.74-.38-1.15-.22-.41-.33-.62-.51-.75-.18-.13-.36-.21-.54-.26-.18-.05-.34-.08-.51-.08-.17 0-.44.06-.66.18-.22.12-.85.85-.85 2.07 0 1.22.89 2.39 1.01 2.56.12.17 1.76 2.67 4.26 3.73 2.5 1.06 2.5 1.06.53.11.9-.11.37-.22.58-.43.21-.21.26-.48.15-.56-.11-.08-.41-.48-.62-.89z"/>
                  </svg>
                  Join Channel
                </a>
                <a
                  href="https://wa.me/254710422557"
                  className="bg-secondary-500 text-primary-900 p-4 rounded-full shadow-lg hover:bg-secondary-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
