import { Link } from 'react-router-dom';
import { Building2, Shirt, Palette, ArrowRight, Printer, Zap } from 'lucide-react';

const Branding = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 sm:py-20 bg-gradient-to-b from-surface to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-3">Corporate & teams</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-900 font-display mb-6">Branding Services</h1>
          <p className="text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
            Choose your preferred branding method - embroidery, DTF, screen printing, or sublimation. We'll help you select the best option for your needs and budget.
          </p>
        </div>
      </section>

      <section className="py-16 bg-surfaceWarm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-900 font-display text-center mb-12">Our Branding Services</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Embroidery */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
                <img 
                  src="https://i.pinimg.com/1200x/e2/7b/c9/e27bc914c5db41b42a134b0b81aa062c.jpg" 
                  alt="Embroidery work" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <Shirt className="w-6 h-6 mb-2" />
                  <h3 className="text-lg font-bold">Embroidery</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-primary-700 text-sm">Premium thread embroidery for polos, jackets, caps and workwear</p>
              </div>
            </div>

            {/* DTF Printing */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-secondary-100 to-secondary-200 relative overflow-hidden">
                <img 
                  src="https://i.pinimg.com/736x/ed/22/5f/ed225fcc5808eb9991a56cb8972d38c6.jpg" 
                  alt="DTF printing" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <Printer className="w-6 h-6 mb-2" />
                  <h3 className="text-lg font-bold">DTF Printing</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-primary-700 text-sm">Direct-to-film printing for vibrant, detailed designs</p>
              </div>
            </div>

            {/* Screen Printing */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-accent-100 to-accent-200 relative overflow-hidden">
                <img 
                  src="https://i.pinimg.com/1200x/76/e7/c9/76e7c93b5d94d64dd705b8a81c733bec.jpg" 
                  alt="Screen printing" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <Palette className="w-6 h-6 mb-2" />
                  <h3 className="text-lg font-bold">Screen Printing</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-primary-700 text-sm">Cost-effective for bulk orders and simple designs</p>
              </div>
            </div>

            {/* Sublimation */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1578632292375-270c76fc0195?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&w=400&h=300&fit=crop" 
                  alt="Sublimation printing" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <Zap className="w-6 h-6 mb-2" />
                  <h3 className="text-lg font-bold">Sublimation</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-primary-700 text-sm">All-over printing for polyester garments and sportswear</p>
              </div>
            </div>
          </div>

          <div className="bg-secondary-50 border border-secondary-200 rounded-3xl p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-secondary-900 mb-3">Need Help with Your Design?</h3>
            <p className="text-secondary-800 mb-2">
              <strong>Design service:</strong> Want us to create or improve your logo? We can help for just <strong>KES 1,000</strong> per design.
            </p>
            <p className="text-secondary-700 text-sm">
              We'll work with you to create the perfect design, show you a preview before we start, and make any changes you need. No surprises - just great results!
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-card text-center max-w-2xl mx-auto">
            <Building2 className="w-12 h-12 text-primary-600 mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-primary-900 mb-2">Get Your Brand Quote</h3>
            <p className="text-primary-700 mb-6">Tell us about your branding needs and we'll recommend the best solution for your budget and timeline.</p>
            <Link to="/quote" className="btn-secondary inline-flex items-center font-bold">
              Request a branding quote
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Link to="/portfolio" className="text-secondary-700 font-semibold hover:text-secondary-800 inline-flex items-center">
            See example work <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Branding;
