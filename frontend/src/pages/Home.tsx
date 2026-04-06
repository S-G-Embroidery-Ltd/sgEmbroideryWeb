import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Scissors, Palette, Download, CheckCircle, Truck, Shield, Users, Package, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import heroBg from '../assets/Shop 2.jpg';

const Home = () => {
  const [currentService, setCurrentService] = useState(0);
  const services = [
    "Textile Solutions",
    "Custom Embroidery", 
    "Branding Design",
    "Quality Products"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentService((prev) => (prev + 1) % services.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [services.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Printful Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          <img 
            src={heroBg} 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center bg-secondary-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-white font-semibold text-sm">🚀 KENYA'S PREMIER EMBROIDERY SERVICE</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 font-sans leading-tight">
                Quality Embroidery &<br />
                <span className="text-yellow-400 text-animate">{services[currentService]}</span>
              </h1>
              <p className="text-xl mb-8 text-white/90 leading-relaxed max-w-lg">
                Transform your ideas into premium embroidered designs. From custom logos to complete textile products, we deliver excellence with every stitch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/shop"
                  className="btn-primary inline-flex items-center justify-center text-lg px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black transform hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  <span className="font-bold">START DESIGNING</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/quote"
                  className="btn-outline inline-flex items-center justify-center text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
                >
                  GET QUOTE
                </Link>
              </div>
              <div className="flex items-center space-x-8">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-white font-semibold">4.9/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-white" />
                  <span className="ml-1 text-white font-semibold">10,000+ Happy Clients</span>
                </div>
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-white" />
                  <span className="ml-1 text-white font-semibold">50,000+ Orders</span>
                </div>
              </div>
            </div>
            
            {/* Right Side - Product Preview */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 transform hover:scale-105 transition-all duration-500">
                <div className="aspect-square bg-gradient-to-br from-secondary-400/20 to-primary-600/20 rounded-2xl flex items-center justify-center mb-6">
                  <Package className="w-24 h-24 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Premium Quality Guaranteed</h3>
                <p className="text-white/80 mb-4">Professional embroidery with attention to every detail</p>
                <div className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 mr-2 text-secondary-400" />
                  <span>Satisfaction Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick turnaround on all orders</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600">Premium materials & craftsmanship</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Team</h3>
              <p className="text-gray-600">Skilled embroidery professionals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Growing Business</h3>
              <p className="text-gray-600">Trusted by thousands of clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-sans">Our Embroidery Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Complete embroidery solutions for businesses and individuals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Scissors className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Embroidery</h3>
              <p className="text-gray-600 mb-4">Personalized designs for any garment</p>
              <Link to="/shop" className="text-secondary-600 font-semibold hover:text-secondary-700 inline-flex items-center">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Design Services</h3>
              <p className="text-gray-600 mb-4">Professional logo and design creation</p>
              <Link to="/tools" className="text-secondary-600 font-semibold hover:text-secondary-700 inline-flex items-center">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Textile Products</h3>
              <p className="text-gray-600 mb-4">Quality apparel and accessories</p>
              <Link to="/shop" className="text-secondary-600 font-semibold hover:text-secondary-700 inline-flex items-center">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resources</h3>
              <p className="text-gray-600 mb-4">Design tools and templates</p>
              <Link to="/tools" className="text-secondary-600 font-semibold hover:text-secondary-700 inline-flex items-center">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-sans">Featured Products</h2>
            <p className="text-xl text-gray-600">Discover our most popular embroidery items</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-medium overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Custom T-Shirts</h3>
                <p className="text-gray-600 mb-4">Premium quality with custom embroidery</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600">KES 1,500</span>
                  <Link to="/shop" className="btn-primary">Order Now</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-medium overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-secondary-100 to-accent-100"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Embroidered Caps</h3>
                <p className="text-gray-600 mb-4">Professional caps with custom logos</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600">KES 800</span>
                  <Link to="/shop" className="btn-primary">Order Now</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-medium overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-accent-100 to-primary-100"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Corporate Uniforms</h3>
                <p className="text-gray-600 mb-4">Complete uniform solutions</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600">KES 2,200</span>
                  <Link to="/shop" className="btn-primary">Order Now</Link>
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

      {/* Quote Request Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-32 h-32 bg-secondary-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-secondary-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <span className="text-secondary-300 font-semibold text-sm">LIMITED TIME OFFER</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 font-sans">
              Get a <span className="text-secondary-400">Custom Quote</span>
            </h2>
            <p className="text-xl text-primary-100 leading-relaxed max-w-3xl mx-auto">
              Transform your embroidery ideas into reality with our expert team. Get personalized quotes tailored to your unique needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-secondary-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Design</h3>
              <p className="text-primary-200">Complimentary design consultation for all projects</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-secondary-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-primary-200">Competitive pricing with no hidden fees</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-secondary-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-primary-200">Quick turnaround times on all orders</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link
              to="/quote"
              className="btn-secondary inline-flex items-center justify-center text-lg px-8 py-4 bg-secondary-500 hover:bg-secondary-400 text-white transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              <span className="font-bold">GET YOUR FREE QUOTE NOW</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <p className="text-primary-200 mt-4 text-sm">
              ⏰ Limited time offer - Get 20% off your first order!
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-sans">Trusted by Leading Brands</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied customers</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">10K+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">50K+</div>
              <p className="text-gray-600">Orders Completed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">15+</div>
              <p className="text-gray-600">Years Experience</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">4.9★</div>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary-600 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 font-sans">Stay Updated</h2>
          <p className="text-lg mb-8 text-primary-100">
            Subscribe to our newsletter for the latest products, tips, and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent"
            />
            <button className="px-6 py-3 bg-secondary-500 text-gray-900 rounded-2xl hover:bg-secondary-400 transition-colors font-bold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
