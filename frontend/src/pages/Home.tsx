import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  ShoppingBag,
  Scissors,
  Palette,
  Download,
  Truck,
  Shield,
  Users,
  Package,
  TrendingUp,
  Award,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import heroBg from '../assets/Shop 2.jpg';
import { whatsappChannelUrl, whatsappChannelHref } from '../config/site';
import { LOGO_ORIGINATION_KES } from '../config/pricing';
import { customerLogos } from '../config/customerLogos';
import CustomerLogoMarquee from '../components/home/CustomerLogoMarquee';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — blurred photo background + copy (no side panel) */}
      <section className="relative min-h-[min(85vh,920px)] flex items-center overflow-hidden border-b border-primary-100">
        <div className="absolute inset-0" aria-hidden>
          <img
            src={heroBg}
            alt=""
            className="h-full w-full object-cover object-center scale-105 blur-[3px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/35" />
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <p className="inline-flex rounded-full bg-secondary-500/20 px-4 py-2 text-sm font-semibold tracking-wide text-white backdrop-blur-sm mb-6">
            🚀 KENYA&apos;S PREMIER EMBROIDERY SERVICE
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-sans leading-[1.1] mb-6">
            Quality Embroidery &<br />
            <span className="text-secondary-300">Quality Products</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mb-10">
            Transform your ideas into premium embroidered designs. From custom logos to complete textile products, we
            deliver excellence with every stitch.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-12">
            <Link
              to="/shop"
              className="btn-secondary inline-flex items-center justify-center text-base px-8 py-3.5 font-bold uppercase tracking-wide shadow-lg"
            >
              SHOP NOW
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/quote"
              className="inline-flex items-center justify-center text-base px-8 py-3.5 font-bold uppercase tracking-wide rounded-2xl border-2 border-white text-white hover:bg-white hover:text-primary-900 transition-all duration-200"
            >
              GET QUOTE
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 sm:gap-10 text-white">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 shrink-0 fill-secondary-400 text-secondary-400" aria-hidden />
              <span className="font-semibold">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary-300 shrink-0" strokeWidth={2} />
              <span className="font-semibold">10,000+ Happy Clients</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-secondary-300 shrink-0" strokeWidth={2} />
              <span className="font-semibold">50,000+ Orders</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-card flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-2">Fast Delivery</h3>
              <p className="text-primary-700">Quick turnaround on all orders</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-card flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-2">Quality Assured</h3>
              <p className="text-primary-700">Premium materials & craftsmanship</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-card flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-2">Expert Team</h3>
              <p className="text-primary-700">Skilled embroidery professionals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-card flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-2">Growing Business</h3>
              <p className="text-primary-700">Trusted by thousands of clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-900 mb-4 font-display">Our Embroidery Services</h2>
            <p className="text-xl text-primary-700 max-w-3xl mx-auto">
              Complete embroidery solutions for businesses and individuals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-surface rounded-2xl p-8 text-center shadow-card hover:shadow-float transition-all duration-300">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Scissors className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">Custom Embroidery</h3>
              <p className="text-primary-700 mb-4">Personalized designs for any garment</p>
              <Link to="/shop" className="text-secondary-700 font-semibold hover:text-secondary-800 inline-flex items-center">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="bg-surface rounded-2xl p-8 text-center shadow-card hover:shadow-float transition-all duration-300">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">Design Services</h3>
              <p className="text-primary-700 mb-4">
                Upload PNG or JPEG logos — we digitize them into embroidery files from KES {LOGO_ORIGINATION_KES.toLocaleString()}{' '}
                per design (incl. VAT).
              </p>
              <Link
                to="/logo-embroidery"
                className="text-secondary-700 font-semibold hover:text-secondary-800 inline-flex items-center"
              >
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="bg-surface rounded-2xl p-8 text-center shadow-card hover:shadow-float transition-all duration-300">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">Textile Products</h3>
              <p className="text-primary-700 mb-4">Quality apparel and accessories</p>
              <Link to="/textile-solutions" className="text-secondary-700 font-semibold hover:text-secondary-800 inline-flex items-center">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="bg-surface rounded-2xl p-8 text-center shadow-card hover:shadow-float transition-all duration-300">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">Resources</h3>
              <p className="text-primary-700 mb-4">Design tools and templates</p>
              <Link to="/tools" className="text-secondary-700 font-semibold hover:text-secondary-800 inline-flex items-center">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-surfaceWarm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-900 mb-4 font-display">Featured Products</h2>
            <p className="text-xl text-primary-700">Discover our most popular embroidery items</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-float transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-900 mb-2">Custom T-Shirts</h3>
                <p className="text-primary-700 mb-4">Premium quality with custom embroidery</p>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-2xl font-bold text-primary-600">KES 1,500</span>
                  <Link to="/shop" className="btn-primary text-sm">
                    Order Now
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-float transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-secondary-100 to-accent-100" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-900 mb-2">Embroidered Caps</h3>
                <p className="text-primary-700 mb-4">Professional caps with custom logos</p>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-2xl font-bold text-primary-600">KES 800</span>
                  <Link to="/shop" className="btn-primary text-sm">
                    Order Now
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-float transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-accent-100 to-primary-100" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-900 mb-2">Corporate Uniforms</h3>
                <p className="text-primary-700 mb-4">Complete uniform solutions</p>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-2xl font-bold text-primary-600">KES 2,200</span>
                  <Link to="/branding" className="btn-primary text-sm">
                    Order Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/shop" className="btn-primary inline-flex items-center justify-center">
              View All Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tony Elumelu Foundation highlight */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-primary-800 to-primary-900 text-white shadow-float p-8 sm:p-10 lg:p-12 lg:flex lg:items-center lg:gap-12">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-secondary-500/25 flex items-center justify-center mb-6 lg:mb-0">
              <Award className="w-9 h-9 text-secondary-400" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <p className="text-secondary-300 text-sm font-semibold tracking-wide uppercase mb-2">Our achievements</p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">Major Milestones 2025-2026</h2>
              <p className="text-primary-100 leading-relaxed max-w-2xl mb-6">
                Selected for the Tony Elumelu Foundation 2025 and Anzisha Prize 2026 — recognizing our innovation 
                and excellence in Kenya's embroidery industry from 3,200+ applicants across 54 African countries.
              </p>
              <Link
                to="/about#milestones"
                className="inline-flex items-center gap-2 text-secondary-300 font-semibold hover:text-secondary-200 transition-colors"
              >
                View our milestones
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp community */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white shadow-card p-8 sm:p-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary-100 text-secondary-700 mb-5">
              <MessageCircle className="w-7 h-7" strokeWidth={1.75} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary-900 mb-3">Join our WhatsApp community</h2>
            <p className="text-primary-700 leading-relaxed mb-8">
              Get product drops, embroidery tips, exclusive offers, and quick answers from our team — all in one calm,
              friendly channel.
            </p>
            <a
              href={whatsappChannelHref()}
              {...(whatsappChannelUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="btn-secondary inline-flex items-center justify-center font-bold uppercase tracking-wide px-8"
            >
              Join the channel
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            {!whatsappChannelUrl && (
              <p className="text-sm text-primary-600 mt-4">
                Channel link coming soon — or{' '}
                <Link to="/contact" className="text-secondary-700 font-semibold underline-offset-2 hover:underline">
                  contact us
                </Link>{' '}
                to stay in touch.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Project estimate CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-secondary-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-500" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-secondary-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <span className="text-secondary-300 font-semibold text-sm">BULK &amp; CORPORATE</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 font-display">
              Get a <span className="text-secondary-400">project estimate</span>
            </h2>
            <p className="text-xl text-primary-100 leading-relaxed max-w-3xl mx-auto">
              Tell us what you need — uniforms, quantities, timelines, and delivery. We&apos;ll send a clear cost estimate
              for the full job so you can plan your budget with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-center hover:bg-white/15 transition-all duration-300 shadow-card">
              <div className="w-16 h-16 bg-secondary-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold" aria-hidden>
                  📋
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Scope-based pricing</h3>
              <p className="text-primary-200">Estimates reflect your quantities, materials, and timeline — not a one-size-fits-all number.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-center hover:bg-white/15 transition-all duration-300 shadow-card">
              <div className="w-16 h-16 bg-secondary-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold" aria-hidden>
                  💰
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparent breakdown</h3>
              <p className="text-primary-200">Understand what drives cost before you commit — no surprise line items.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-center hover:bg-white/15 transition-all duration-300 shadow-card">
              <div className="w-16 h-16 bg-secondary-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold" aria-hidden>
                  ⚡
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast response</h3>
              <p className="text-primary-200">We typically reply within 24 hours with next steps and pricing guidance.</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/quote"
              className="btn-secondary inline-flex items-center justify-center text-lg px-8 py-4 transform hover:scale-[1.02] transition-all duration-300 shadow-float"
            >
              <span className="font-bold">REQUEST A PROJECT ESTIMATE</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <p className="text-primary-200 mt-4 text-sm max-w-lg mx-auto">
              For a single logo file (digitizing only), use Logo embroidery — fixed origination fee per design.
            </p>
          </div>
        </div>
      </section>

      {/* Why brands choose us — distinct from hero stats */}
      <section className="py-20 bg-surfaceWarm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-900 mb-4 font-display">Why brands choose us</h2>
            <p className="text-xl text-primary-700 max-w-2xl mx-auto">
              Beyond the numbers — how we make corporate and retail orders effortless
            </p>
          </div>

          <CustomerLogoMarquee logos={customerLogos} />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center rounded-2xl bg-white/80 p-6 shadow-card">
              <div className="text-3xl lg:text-4xl font-bold text-primary-700 mb-2 font-display">48hr</div>
              <p className="text-primary-700 text-sm sm:text-base">Typical quote response</p>
            </div>
            <div className="text-center rounded-2xl bg-white/80 p-6 shadow-card">
              <div className="text-3xl lg:text-4xl font-bold text-primary-700 mb-2 font-display">12+</div>
              <p className="text-primary-700 text-sm sm:text-base">Industries served</p>
            </div>
            <div className="text-center rounded-2xl bg-white/80 p-6 shadow-card">
              <div className="text-3xl lg:text-4xl font-bold text-primary-700 mb-2 font-display">500+</div>
              <p className="text-primary-700 text-sm sm:text-base">Corporate & bulk programs</p>
            </div>
            <div className="text-center rounded-2xl bg-white/80 p-6 shadow-card">
              <div className="text-3xl lg:text-4xl font-bold text-primary-700 mb-2 font-display">DST</div>
              <p className="text-primary-700 text-sm sm:text-base">Professional file handling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-primary-700 to-primary-800 text-white shadow-float px-6 py-12 sm:px-10 sm:py-14 text-center">
            <h2 className="text-3xl font-bold mb-4 font-display">Stay Updated</h2>
            <p className="text-lg mb-8 text-primary-100">
              Subscribe for new products, care tips, and subscriber-only offers — no spam.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/15 backdrop-blur-sm rounded-2xl text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-secondary-400"
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
      </section>
    </div>
  );
};

export default Home;
