import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import sgLogo from '../../assets/sg.png';

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={sgLogo} alt="SG Embroidery" className="h-12 w-auto" />
              <h3 className="text-2xl font-bold text-white font-sans">
                S & G Embroidery Ltd
              </h3>
            </div>
            <p className="text-white mb-4 max-w-md leading-relaxed">
              Your trusted partner for quality embroidery, textile products, and branding solutions. 
              We bring your designs to life with precision and creativity.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-white hover:text-yellow-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                className="text-white hover:text-yellow-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                className="text-white hover:text-yellow-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                className="text-white hover:text-yellow-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shop"
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/tools"
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  Tools & Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-yellow-400" />
                <span className="text-white">+254 700 000 000</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span className="text-white">info@sgembroidery.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span className="text-white">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-8 pt-8 border-t border-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-lg font-semibold mb-2 text-white">Subscribe to Our Newsletter</h4>
              <p className="text-white">
                Get the latest updates on new products and exclusive offers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-black border border-black rounded-2xl text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-black text-center">
          <p className="text-white">
            © {new Date().getFullYear()} SG Embroidery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
