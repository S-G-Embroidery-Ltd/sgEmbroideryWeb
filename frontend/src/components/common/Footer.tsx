import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import sgLogo from '../../assets/sg.png';
import { whatsappChannelUrl, whatsappChannelHref } from '../../config/site';

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={sgLogo} alt="SG Embroidery" className="h-12 w-auto" />
              <h3 className="text-2xl font-bold text-white font-display">S & G Embroidery Ltd</h3>
            </div>
            <p className="text-primary-100 mb-6 max-w-md leading-relaxed">
              Your trusted partner for quality embroidery, textile products, and branding solutions. We bring your
              designs to life with precision and creativity.
            </p>
            <a
              href={whatsappChannelHref()}
              {...(whatsappChannelUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-secondary-500/20 text-secondary-300 font-semibold hover:bg-secondary-500/30 transition-colors mb-6"
            >
              <MessageCircle className="w-5 h-5" />
              Join WhatsApp community
            </a>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://facebook.com"
                className="text-white hover:text-secondary-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                className="text-white hover:text-secondary-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                className="text-white hover:text-secondary-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                className="text-white hover:text-secondary-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white font-display">Explore</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/shop" className="text-primary-100 hover:text-secondary-400 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/branding" className="text-primary-100 hover:text-secondary-400 transition-colors">
                  Corporate branding
                </Link>
              </li>
              <li>
                <Link to="/textile-solutions" className="text-primary-100 hover:text-secondary-400 transition-colors">
                  Textile solutions
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-primary-100 hover:text-secondary-400 transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-primary-100 hover:text-secondary-400 transition-colors">
                  Tools & Resources
                </Link>
              </li>
              <li>
                <Link to="/logo-embroidery" className="text-primary-100 hover:text-secondary-400 transition-colors">
                  Logo embroidery (your image)
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-100 hover:text-secondary-400 transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-primary-100 hover:text-secondary-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-primary-100 hover:text-secondary-400 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white font-display">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-secondary-400 shrink-0 mt-0.5" />
                <span className="text-primary-100">+254 700 000 000</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-secondary-400 shrink-0 mt-0.5" />
                <span className="text-primary-100">info@sgembroidery.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-secondary-400 shrink-0 mt-0.5" />
                <span className="text-primary-100">Nairobi, Kenya</span>
              </div>
              <div>
                <Link to="/faq" className="text-secondary-400 hover:text-secondary-300 font-medium">
                  FAQ
                </Link>
                <span className="text-primary-400 mx-2">·</span>
                <Link to="/contact" className="text-secondary-400 hover:text-secondary-300 font-medium">
                  Contact page
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            <div>
              <h4 className="text-lg font-semibold mb-2 text-white font-display">Newsletter</h4>
              <p className="text-primary-100 text-sm">New products and offers — no spam.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 rounded-2xl text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-secondary-400"
              />
              <button
                type="button"
                className="px-6 py-3 bg-secondary-500 text-primary-900 rounded-2xl hover:bg-secondary-400 transition-colors font-bold"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 text-center">
          <p className="text-primary-200 text-sm">© {new Date().getFullYear()} SG Embroidery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
