import { Link } from 'react-router-dom';
import { Layers, Scissors, Package, ArrowRight } from 'lucide-react';

const TextileSolutions = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 sm:py-20 bg-gradient-to-b from-surface to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-3">Materials & products</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-900 font-display mb-6">Textile solutions</h1>
          <p className="text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
            Quality fabrics, apparel, and accessories — paired with embroidery that lasts wash after wash.
          </p>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-white p-8 shadow-card">
              <Layers className="w-10 h-10 text-primary-600 mb-4" />
              <h2 className="text-xl font-bold text-primary-900 mb-2">Fabric guidance</h2>
              <p className="text-primary-700 leading-relaxed">
                We help you choose garments that take embroidery well — from cotton and blends to performance fabrics.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-card">
              <Scissors className="w-10 h-10 text-primary-600 mb-4" />
              <h2 className="text-xl font-bold text-primary-900 mb-2">Customization</h2>
              <p className="text-primary-700 leading-relaxed">
                Placement, backing, and stitch density tuned for each product so logos stay crisp.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-card">
              <Package className="w-10 h-10 text-primary-600 mb-4" />
              <h2 className="text-xl font-bold text-primary-900 mb-2">Fulfillment</h2>
              <p className="text-primary-700 leading-relaxed">
                Pack and label options for teams and retail — ask when you place your order.
              </p>
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
