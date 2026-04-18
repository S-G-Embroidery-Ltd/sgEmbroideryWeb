import { Link } from 'react-router-dom';
import { Building2, Shirt, Palette, ArrowRight, Users } from 'lucide-react';

const Branding = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 sm:py-20 bg-gradient-to-b from-surface to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-3">Corporate & teams</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-900 font-display mb-6">Corporate branding & uniforms</h1>
          <p className="text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
            Logo programs, staff uniforms, and event apparel — consistent quality and colours across every stitch.
          </p>
        </div>
      </section>

      <section className="py-16 bg-surfaceWarm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary-900 font-display mb-4">What we deliver</h2>
              <p className="text-primary-700 leading-relaxed mb-6">
                From first mock-up to bulk delivery, we help you present a polished brand on polos, jackets, caps, and
                workwear — ideal for offices, retail, schools, and field teams.
              </p>
              <ul className="space-y-4 text-primary-800">
                <li className="flex gap-3">
                  <Building2 className="w-6 h-6 text-secondary-600 shrink-0 mt-0.5" />
                  <span>Volume pricing and repeat-order consistency</span>
                </li>
                <li className="flex gap-3">
                  <Palette className="w-6 h-6 text-secondary-600 shrink-0 mt-0.5" />
                  <span>Colour-matched threads and brand guidelines</span>
                </li>
                <li className="flex gap-3">
                  <Users className="w-6 h-6 text-secondary-600 shrink-0 mt-0.5" />
                  <span>Dedicated support for HR and procurement</span>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-card">
              <Shirt className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-primary-900 mb-2">Start with a conversation</h3>
              <p className="text-primary-700 mb-6">Share headcount, timelines, and garment types — we&apos;ll propose options and pricing.</p>
              <Link to="/quote" className="btn-secondary inline-flex items-center font-bold">
                Request a corporate quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
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
