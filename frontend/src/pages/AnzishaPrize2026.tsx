import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Users, Globe } from 'lucide-react';
import { useEffect } from 'react';

const AnzishaPrize2026 = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link 
              to="/about#milestones" 
              className="inline-flex items-center gap-2 text-accent-700 hover:text-accent-800 font-semibold mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Milestones
            </Link>
            <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-accent-700" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-900 mb-6 font-display">
              Anzisha Prize 2026
            </h1>
            <p className="text-xl text-primary-700 max-w-3xl mx-auto mb-8">
              Africa's biggest award for young entrepreneurs recognizes S & G Embroidery Ltd's innovation and excellence
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-accent-100 px-4 py-2 rounded-full">
                <Globe className="w-4 h-4 text-accent-700" />
                <span className="text-accent-700 font-semibold">Pan-African Recognition</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full">
                <Users className="w-4 h-4 text-primary-700" />
                <span className="text-primary-700 font-semibold">Gideon Noah - Representative</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Details */}
      <section className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-card">
            <h2 className="text-3xl font-bold text-primary-900 font-display mb-6">2026 Selection Achievement</h2>
            
            {/* Competitive Selection Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center bg-surface rounded-2xl p-6">
                <div className="text-4xl font-bold text-accent-600 mb-2">290+</div>
                <div className="text-primary-700 font-medium">Total Alumni</div>
              </div>
              <div className="text-center bg-surface rounded-2xl p-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">54</div>
                <div className="text-primary-700 font-medium">African Countries</div>
              </div>
              <div className="text-center bg-surface rounded-2xl p-6">
                <div className="text-4xl font-bold text-secondary-600 mb-2">$140K+</div>
                <div className="text-primary-700 font-medium">Annual Prize Pool</div>
              </div>
            </div>

            <div className="space-y-4 text-primary-700 leading-relaxed">
              <p>
                S & G Embroidery Ltd selected for Africa's biggest young entrepreneur award. 
                Gideon Noah represented our company in this competitive program.
              </p>
              <p>
                Selection recognizes our innovative approach to embroidery and positions us among Africa's top young entrepreneurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Anzisha Prize */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-900 font-display text-center mb-12">About the Anzisha Prize</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-accent-50 to-white rounded-3xl p-8 border border-accent-100">
              <div className="flex items-center mb-4">
                <Globe className="w-8 h-8 text-accent-600 mr-3" />
                <h3 className="text-xl font-bold text-primary-900">Pan-African Impact</h3>
              </div>
              <p className="text-primary-700 leading-relaxed">
                The Anzisha Prize seeks to fundamentally and significantly increase the number of job generative entrepreneurs 
                in Africa. They believe entrepreneurship is the most powerful force to change the continent.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 border border-primary-100">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 text-primary-600 mr-3" />
                <h3 className="text-xl font-bold text-primary-900">Young Entrepreneurs</h3>
              </div>
              <p className="text-primary-700 leading-relaxed">
                The program targets very young entrepreneurs aged 15-22, providing them with business support, 
                mentorship, and access to a network of peers and industry leaders across Africa.
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-primary-900 font-display mb-6">Prize Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 mb-2">$140,000+</div>
                <div className="text-primary-700 font-medium">Annual Prize Money</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">290+</div>
                <div className="text-primary-700 font-medium">Entrepreneurs Supported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600 mb-2">54</div>
                <div className="text-primary-700 font-medium">African Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Representative */}
      <section className="py-16 bg-surfaceWarm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-900 font-display text-center mb-12">Our Representative</h2>
          <div className="bg-white rounded-3xl p-8 shadow-card">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center shrink-0">
                <Users className="w-16 h-16 text-accent-700" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-primary-900 mb-2">Gideon Noah</h3>
                <p className="text-accent-600 font-semibold mb-4">Operations Director & Anzisha Prize Representative</p>
                <div className="space-y-3 text-primary-700">
                  <p>
                    As Operations Director, Gideon Noah oversees daily operations and quality assurance at S & G Embroidery Ltd. 
                    His representation in the Anzisha Prize 2026 program showcases his leadership and entrepreneurial spirit.
                  </p>
                  <p>
                    Gideon's participation in this prestigious program demonstrates our company's commitment to innovation, 
                    excellence, and the development of young leadership in the African business landscape.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">Leadership</span>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Innovation</span>
                  <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">Quality Assurance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Status & Future */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-900 font-display text-center mb-12">Current Status & Future</h2>
          
          {/* Current Status */}
          <div className="bg-surface rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-primary-900 font-display mb-6">Onboarding Phase</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center bg-white rounded-2xl p-6 border border-accent-100">
                <div className="text-3xl font-bold text-accent-600 mb-2">Phase 1</div>
                <div className="text-primary-700 font-medium mb-3">Current Status</div>
                <div className="text-primary-700 text-sm">Orientation & community integration</div>
              </div>
              <div className="text-center bg-white rounded-2xl p-6 border border-primary-100">
                <div className="text-3xl font-bold text-primary-600 mb-2">290+</div>
                <div className="text-primary-700 font-medium mb-3">Alumni Network</div>
                <div className="text-primary-700 text-sm">Connecting across 54 countries</div>
              </div>
              <div className="text-center bg-white rounded-2xl p-6 border border-secondary-100">
                <div className="text-3xl font-bold text-secondary-600 mb-2">Pending</div>
                <div className="text-primary-700 font-medium mb-3">Main Programme</div>
                <div className="text-primary-700 text-sm">Mentorship & training starting soon</div>
              </div>
            </div>

            <div className="text-primary-700 leading-relaxed">
              <p>
                Currently in onboarding phase. Selection achieved - positioning us among Africa's top young entrepreneurs.
              </p>
            </div>
          </div>

          {/* Future Benefits */}
          <div className="bg-surface rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-primary-900 font-display mb-6">Future Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">Mentorship</div>
                <div className="text-primary-700 text-sm">Access to industry experts & successful entrepreneurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600 mb-2">Funding</div>
                <div className="text-primary-700 text-sm">Business support & growth capital opportunities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to About */}
      <section className="py-12 bg-surface border-t border-primary-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link 
            to="/about#milestones" 
            className="inline-flex items-center gap-2 bg-white text-primary-900 px-6 py-3 rounded-full font-bold border-2 border-primary-200 hover:bg-primary-50 transition-colors shadow-card"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to About Page
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AnzishaPrize2026;
