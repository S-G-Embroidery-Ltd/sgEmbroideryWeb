import { Link } from 'react-router-dom';
import { Layers, Package, ArrowRight, Shirt } from 'lucide-react';

const TextileSolutions = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 sm:py-20 bg-gradient-to-b from-surface to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-3">Materials & products</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-900 font-display mb-6">Textile Solutions</h1>
          <p className="text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
            High-quality textile wear including tracksuits, fleece jackets, and t-shirts. More products coming soon including sweaters and uniforms.
          </p>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-900 font-display text-center mb-12">Our Current Products</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Tracksuits */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="h-64 relative overflow-hidden">
                <img 
                  src="https://i.pinimg.com/736x/84/59/5d/84595db5f621474af12ca1c1c02c3985.jpg" 
                  alt="Tracksuits" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <Shirt className="w-6 h-6 mb-2" />
                  <h3 className="text-xl font-bold">Tracksuits</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-primary-700 leading-relaxed">
                  Comfortable and durable tracksuits perfect for sports teams, schools, and casual wear. Available in various colors and sizes.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">Sports Teams</span>
                  <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">Schools</span>
                  <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs">Casual Wear</span>
                </div>
              </div>
            </div>

            {/* Fleece Jackets */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="h-64 relative overflow-hidden">
                <img 
                  src="https://i.pinimg.com/1200x/cb/2c/21/cb2c21788732690ec94194b091364370.jpg" 
                  alt="Fleece Jackets" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <Package className="w-6 h-6 mb-2" />
                  <h3 className="text-xl font-bold">Fleece Jackets</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-primary-700 leading-relaxed">
                  Warm and stylish fleece jackets ideal for cooler weather. Great for corporate branding and team uniforms.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">Corporate</span>
                  <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">Team Wear</span>
                  <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs">Winter Wear</span>
                </div>
              </div>
            </div>

            {/* T-Shirts */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="h-64 relative overflow-hidden">
                <img 
                  src="https://i.pinimg.com/1200x/61/c9/9b/61c99b63185de0f11133f13064ee701a.jpg" 
                  alt="T-Shirts" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <Layers className="w-6 h-6 mb-2" />
                  <h3 className="text-xl font-bold">T-Shirts</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-primary-700 leading-relaxed">
                  Quality round neck and v-neck t-shirts for local production. Also offering improved t-shirts and polo shirts.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">Round Neck</span>
                  <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">V-Neck</span>
                  <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs">Polo Shirts</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 max-w-2xl mx-auto border border-primary-100">
              <div className="mb-6">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8 text-accent-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-3">Coming Soon</h3>
              <p className="text-primary-700 mb-6">
                We're expanding our textile solutions to include sweaters, school uniforms, and other professional textile wear. Stay tuned for more options!
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="bg-white/80 rounded-xl p-3 text-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shirt className="w-4 h-4 text-primary-600" />
                  </div>
                  <p className="text-sm font-medium text-primary-800">Sweaters</p>
                </div>
                <div className="bg-white/80 rounded-xl p-3 text-center">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Package className="w-4 h-4 text-secondary-600" />
                  </div>
                  <p className="text-sm font-medium text-primary-800">Uniforms</p>
                </div>
                <div className="bg-white/80 rounded-xl p-3 text-center">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Layers className="w-4 h-4 text-accent-600" />
                  </div>
                  <p className="text-sm font-medium text-primary-800">More</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surfaceWarm">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-primary-700 mb-6">Ready to match products to your brand?</p>
          <Link to="/shop" className="btn-primary inline-flex items-center">
            Browse the shop
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TextileSolutions;
