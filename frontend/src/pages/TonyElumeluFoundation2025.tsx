import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Users, Globe, Target, Building } from 'lucide-react';
import { useEffect } from 'react';

const TonyElumeluFoundation2025 = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link 
              to="/about#milestones" 
              className="inline-flex items-center gap-2 text-secondary-700 hover:text-secondary-800 font-semibold mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Milestones
            </Link>
            <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-secondary-700" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-900 mb-6 font-display">
              Tony Elumelu Foundation 2025
            </h1>
            <p className="text-xl text-primary-700 max-w-3xl mx-auto mb-8">
              Africa's foremost entrepreneurship foundation recognizes S & G Embroidery Ltd's potential and innovation
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-secondary-100 px-4 py-2 rounded-full">
                <Building className="w-4 h-4 text-secondary-700" />
                <span className="text-secondary-700 font-semibold">Pan-African Foundation</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full">
                <Users className="w-4 h-4 text-primary-700" />
                <span className="text-primary-700 font-semibold">Shem Tom - Representative</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Details */}
      <section className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-card">
            <h2 className="text-3xl font-bold text-primary-900 font-display mb-6">2025 Selection Achievement</h2>
            
            {/* Competitive Selection Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center bg-surface rounded-2xl p-6">
                <div className="text-4xl font-bold text-secondary-600 mb-2">3,200+</div>
                <div className="text-primary-700 font-medium">Annual Applicants</div>
              </div>
              <div className="text-center bg-surface rounded-2xl p-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">54</div>
                <div className="text-primary-700 font-medium">African Countries</div>
              </div>
              <div className="text-center bg-surface rounded-2xl p-6">
                <div className="text-4xl font-bold text-accent-600 mb-2">1%</div>
                <div className="text-primary-700 font-medium">Selection Rate</div>
              </div>
            </div>

            <div className="space-y-4 text-primary-700 leading-relaxed">
              <p>
                S & G Embroidery Ltd selected from 3,200+ applicants across 54 African countries. 
                Shem Tom represented our company in this competitive program.
              </p>
              <p>
                This selection validates our business model and positions us among Africa's top young entrepreneurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Tony Elumelu Foundation */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-900 font-display text-center mb-12">About the Foundation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-secondary-50 to-white rounded-3xl p-8 border border-secondary-100">
              <div className="flex items-center mb-4">
                <Globe className="w-8 h-8 text-secondary-600 mr-3" />
                <h3 className="text-xl font-bold text-primary-900">African Empowerment</h3>
              </div>
              <p className="text-primary-700 leading-relaxed">
                The Tony Elumelu Foundation is the leading philanthropy catalyzing youth entrepreneurship across Africa. 
                For 16 years, they've empowered young African entrepreneurs across all 54 African countries.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 border border-primary-100">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-primary-600 mr-3" />
                <h3 className="text-xl font-bold text-primary-900">Entrepreneurship Programme</h3>
              </div>
              <p className="text-primary-700 leading-relaxed">
                The flagship Entrepreneurship Programme provides training, mentorship, and funding to young entrepreneurs 
                who are transforming Africa through their innovative business ideas and solutions.
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-primary-900 font-display mb-6">Program Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600 mb-2">3,200+</div>
                <div className="text-primary-700 font-medium">Annual Opportunities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">54</div>
                <div className="text-primary-700 font-medium">African Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 mb-2">16</div>
                <div className="text-primary-700 font-medium">Years of Impact</div>
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
              <div className="w-32 h-32 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center shrink-0">
                <Users className="w-16 h-16 text-secondary-700" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-primary-900 mb-2">Shem Tom</h3>
                <p className="text-secondary-600 font-semibold mb-4">Managing Director & TEF Programme Representative</p>
                <div className="space-y-3 text-primary-700">
                  <p>
                    As Managing Director, Shem Tom leads S & G Embroidery Ltd with strategic vision and operational excellence. 
                    His representation in the Tony Elumelu Foundation programme showcases his leadership capabilities and 
                    entrepreneurial acumen.
                  </p>
                  <p>
                    Shem's participation in this prestigious program demonstrates our company's commitment to innovation, 
                    sustainable growth, and the development of business leadership in Africa's textile industry.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">Leadership</span>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Strategy</span>
                  <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">Innovation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact Numbers */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-900 font-display text-center mb-12">Our Impact</h2>
          
          {/* Direct Impact Metrics */}
          <div className="bg-surface rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-primary-900 font-display mb-6">Tangible Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-primary-100">
                <div className="text-3xl font-bold text-primary-600 mb-2">2</div>
                <div className="text-primary-700 font-medium mb-3">New Jobs Created</div>
                <div className="space-y-2 text-sm text-primary-600">
                  <div>• 1 Machine Operator</div>
                  <div>• 1 Machine Technician</div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-secondary-100">
                <div className="text-3xl font-bold text-secondary-600 mb-2">100%</div>
                <div className="text-primary-700 font-medium mb-3">Equipment Upgraded</div>
                <div className="space-y-2 text-sm text-primary-600">
                  <div>• Complete machine maintenance</div>
                  <div>• Enhanced production capacity</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-1">Faster</div>
                <div className="text-primary-700 text-sm">Turnaround Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600 mb-1">Higher</div>
                <div className="text-primary-700 text-sm">Quality Output</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600 mb-1">More</div>
                <div className="text-primary-700 text-sm">Clients Served</div>
              </div>
            </div>
          </div>

          {/* Programme Benefits */}
          <div className="bg-surface rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-primary-900 font-display mb-6">Programme Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">Business Training</div>
                <div className="text-primary-700 text-sm">World-class mentorship & scaling strategies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600 mb-2">Network Access</div>
                <div className="text-primary-700 text-sm">3,200+ entrepreneurs across 54 countries</div>
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

export default TonyElumeluFoundation2025;
