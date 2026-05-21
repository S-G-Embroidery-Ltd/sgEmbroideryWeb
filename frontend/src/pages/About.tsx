import { Heart, Users, Target, Award, TrendingUp } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-900 mb-6 font-display">
              Our Story
            </h1>
            <p className="text-xl text-primary-700 max-w-3xl mx-auto">
              From humble beginnings to a thriving embroidery business, our journey is rooted in family, tradition, and excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-900 font-display text-center mb-10">Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Anzisha Prize 2026 */}
            <div className="rounded-3xl bg-white p-8 shadow-card flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-accent-100 flex items-center justify-center shrink-0">
                  <Award className="w-8 h-8 text-accent-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-accent-700 uppercase tracking-wide mb-1">2026</p>
                  <h3 className="text-xl font-bold text-primary-900 font-display">Anzisha Prize Selection</h3>
                </div>
              </div>
              <p className="text-primary-700 leading-relaxed">
                Selected for Africa's biggest Anzisha Prize 2026, with Gideon Noah representing S & G Embroidery Ltd. 
                This prestigious award recognizes very young entrepreneurs aged 15-22 across Africa.
              </p>
              {/* <a
                href="/anzisha-prize-2026"
                className="inline-flex text-accent-700 font-semibold hover:text-accent-800 hover:underline underline-offset-2"
              >
                View full story
              </a> */}
            </div>

            {/* Tony Elumelu Foundation 2025 */}
            <div className="rounded-3xl bg-white p-8 shadow-card flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary-100 flex items-center justify-center shrink-0">
                  <Award className="w-8 h-8 text-secondary-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-1">2025</p>
                  <h3 className="text-xl font-bold text-primary-900 font-display">Tony Elumelu Foundation</h3>
                </div>
              </div>
              <p className="text-primary-700 leading-relaxed">
                Selected for the Tony Elumelu Foundation programme, with Shem Tom representing our company. 
                Recognition of our commitment to building a resilient, innovative embroidery and textile business in Kenya.
              </p>
              {/* <a
                href="/tony-elumelu-foundation-2025"
                className="inline-flex text-secondary-700 font-semibold hover:text-secondary-800 hover:underline underline-offset-2"
              >
                View full story
              </a> */}
            </div>
          </div>
        </div>
      </section>

      {/* Our History */}
      <section className="py-16 bg-surfaceWarm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <TrendingUp className="w-8 h-8 text-primary-600 mr-3" />
                <h2 className="text-3xl font-bold text-primary-900 font-display">Our History</h2>
              </div>
              <p className="text-primary-700 leading-relaxed">
                Founded by two passionate individuals, S & G Embroidery Ltd grew from a small workshop into a trusted name in the embroidery industry. 
                Our reputation is built on quality craftsmanship, innovative designs, and unwavering customer commitment. 
                Today, we honor our founding principles while embracing modern techniques to better serve our clients across Kenya.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-card">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">25+</div>
                  <div className="text-primary-700">Years Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary-600 mb-2">10K+</div>
                  <div className="text-primary-700">Happy Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent-600 mb-2">50K+</div>
                  <div className="text-primary-700">Projects Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-900 mb-2">15</div>
                  <div className="text-primary-700">Team Members</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Parents Tribute */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-accent-600 mr-3" />
              <h2 className="text-3xl font-bold text-primary-900 font-sans">Our Founding Parents</h2>
            </div>
            <p className="text-lg text-primary-700 max-w-3xl mx-auto">
              The visionaries who laid the foundation of S & G Embroidery Ltd with their dedication and entrepreneurial spirit.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Father */}
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 border border-primary-100 shadow-medium hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <img src="/Dad 2.png" alt="Tom Achianja" className="w-32 h-32 rounded-full mb-6 object-cover" />
                <h3 className="text-2xl font-bold text-primary-900 mb-2 font-sans">Tom Achianja</h3>
                <p className="text-secondary-600 font-semibold mb-4">Co-Founder & Visionary</p>
                <div className="bg-white/80 rounded-2xl p-4 mb-4">
                  <p className="text-primary-800 italic">
                    "Quality is not an act, it is a habit. Every stitch we make reflects our commitment to excellence."
                  </p>
                </div>
                <p className="text-primary-700 text-sm leading-relaxed">
                  With over 30 years of experience in textile arts, our father brought unparalleled expertise and artistic vision to the business. His dedication to quality craftsmanship set the standard that continues to guide us today.
                </p>
              </div>
            </div>

            {/* Mother */}
            <div className="bg-gradient-to-br from-secondary-50 to-white rounded-3xl p-8 border border-secondary-100 shadow-medium hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <img src="/Judith.jpeg" alt="Judith Odira" className="w-32 h-32 rounded-full mb-6 object-cover" />
                <h3 className="text-2xl font-bold text-primary-900 mb-2 font-sans">Judith Odira</h3>
                <p className="text-secondary-600 font-semibold mb-4">Co-Founder & Business Mind</p>
                <div className="bg-white/80 rounded-2xl p-4 mb-4">
                  <p className="text-primary-800 italic">
                    "Success in business is about building relationships. Every client is part of our extended family."
                  </p>
                </div>
                <p className="text-primary-700 text-sm leading-relaxed">
                  Our mother's business acumen and customer-centric approach transformed a small workshop into a thriving enterprise. Her warmth and professionalism built lasting relationships that continue to sustain our business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Leadership */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-primary-600 mr-3" />
              <h2 className="text-3xl font-bold text-primary-900 font-sans">Current Leadership</h2>
            </div>
            <p className="text-lg text-primary-700 max-w-3xl mx-auto">
              The second generation carrying forward the legacy with innovation and excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Brother 1 */}
            <div className="bg-white rounded-3xl p-8 border border-primary-100 shadow-medium hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <img src="/Judith.jpeg" alt="Shem Tom" className="w-32 h-32 rounded-full mb-6 object-cover" />
                <h3 className="text-2xl font-bold text-primary-900 mb-2 font-sans">Shem Tom</h3>
                <p className="text-primary-600 font-semibold mb-4">Managing Director</p>
                <p className="text-primary-700 mb-4 leading-relaxed">
                  Leading the business with strategic vision and operational excellence. Combining traditional craftsmanship with modern business practices to drive growth and innovation.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Leadership</span>
                  <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">Strategy</span>
                  <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">Innovation</span>
                </div>
              </div>
            </div>

            {/* Brother 2 */}
            <div className="bg-white rounded-3xl p-8 border border-primary-100 shadow-medium hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <img src="/Judith.jpeg" alt="Gideon Noah" className="w-32 h-32 rounded-full mb-6 object-cover" />
                <h3 className="text-2xl font-bold text-primary-900 mb-2 font-sans">Gideon Noah</h3>
                <p className="text-primary-600 font-semibold mb-4">Operations Director</p>
                <p className="text-primary-700 mb-4 leading-relaxed">
                  Overseeing daily operations and quality assurance. Ensuring every project meets our high standards and delivers exceptional value to our clients.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Operations</span>
                  <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">Quality</span>
                  <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">Client Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-primary-600 mr-3" />
              <h2 className="text-3xl font-bold text-primary-900 font-sans">Our Team</h2>
            </div>
            <p className="text-lg text-primary-700 max-w-3xl mx-auto">
              Meet the talented individuals who bring their expertise and passion to every project we undertake.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Mutua Dan */}
            <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-medium hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-1 font-sans">Mutua Dan</h3>
                <p className="text-primary-600 font-semibold mb-3">Operator</p>
                <p className="text-primary-700 text-sm leading-relaxed">
                  Managing day-to-day operations and ensuring smooth workflow across all production processes.
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">Operations</span>
                  <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">Production</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 border border-primary-100">
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-primary-600 mr-3" />
                <h3 className="text-2xl font-bold text-primary-900 font-sans">Our Vision</h3>
              </div>
              <p className="text-primary-700 leading-relaxed">
                To be East Africa's leading embroidery and textile solutions provider, setting industry standards through exceptional quality, innovative designs, and preserving embroidery artistry and tradition.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-gradient-to-br from-secondary-50 to-white rounded-3xl p-8 border border-secondary-100">
              <div className="flex items-center mb-6">
                <Award className="w-8 h-8 text-secondary-600 mr-3" />
                <h3 className="text-2xl font-bold text-primary-900 font-sans">Our Mission</h3>
              </div>
              <p className="text-primary-700 leading-relaxed">
                Delivering exceptional embroidery and textile products through innovative designs, quality craftsmanship, and personalized service while honoring our heritage and embracing innovation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
