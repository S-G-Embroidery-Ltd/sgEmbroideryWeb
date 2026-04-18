import { Link } from 'react-router-dom';
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
          <div className="max-w-2xl mx-auto rounded-3xl bg-white p-8 shadow-card flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-secondary-100 flex items-center justify-center shrink-0">
              <Award className="w-8 h-8 text-secondary-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-1">2025</p>
              <h3 className="text-xl font-bold text-primary-900 font-display">Tony Elumelu Foundation</h3>
              <p className="text-primary-700 mt-3 leading-relaxed">
                Selected for the Tony Elumelu Foundation programme — recognition of our commitment to building a resilient,
                innovative embroidery and textile business in Kenya.
              </p>
              <a
                href="#news-updates"
                className="inline-flex mt-4 text-secondary-700 font-semibold hover:text-secondary-800 hover:underline underline-offset-2"
              >
                Read the full story
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* News & milestones in detail — single place for updates (replaces standalone Stories page) */}
      <section id="news-updates" className="scroll-mt-24 py-16 bg-white border-t border-primary-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="rounded-3xl bg-surface border border-primary-100 shadow-card p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary-100 flex items-center justify-center shrink-0">
                <Award className="w-8 h-8 text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-secondary-700 uppercase tracking-wide">2025 milestone</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary-900 font-display">Tony Elumelu Foundation</h2>
              </div>
            </div>
            <div className="text-primary-700 text-lg leading-relaxed">
              <p className="leading-relaxed mb-4">
                In 2025, S &amp; G Embroidery Ltd was selected for the Tony Elumelu Foundation programme — recognition of
                our work to grow a sustainable, quality-focused embroidery and textile business in Kenya.
              </p>
              <p className="leading-relaxed mb-4">
                This milestone belongs to our team, our clients, and everyone who has trusted us with their logos,
                uniforms, and creative projects. We continue to invest in better equipment, training, and service so every
                order reflects the standard you expect.
              </p>
              <p className="leading-relaxed">
                More stories and press updates will appear here as we grow. For partnerships or media enquiries, reach us
                through{' '}
                <Link to="/contact" className="text-secondary-700 font-semibold hover:underline">
                  Contact
                </Link>
                .
              </p>
            </div>
          </article>
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
              <p className="text-primary-700 mb-4 leading-relaxed">
                S & G Embroidery Ltd began as a dream shared by two passionate individuals who believed in the power of quality craftsmanship. What started in a small workshop has grown into a trusted name in the embroidery industry.
              </p>
              <p className="text-primary-700 mb-4 leading-relaxed">
                Over the years, we've built our reputation on attention to detail, innovative designs, and unwavering commitment to customer satisfaction. Every stitch tells a story of dedication and excellence.
              </p>
              <p className="text-primary-700 leading-relaxed">
                Today, we continue to honor our founding principles while embracing modern techniques and technologies to serve our clients better.
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
                <div className="w-32 h-32 bg-gradient-to-br from-primary-200 to-primary-400 rounded-full mb-6 flex items-center justify-center">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900 mb-2 font-sans">Father's Name</h3>
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
                <div className="w-32 h-32 bg-gradient-to-br from-secondary-200 to-secondary-400 rounded-full mb-6 flex items-center justify-center">
                  <Heart className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900 mb-2 font-sans">Mother's Name</h3>
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
                <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-300 rounded-full mb-6 flex items-center justify-center">
                  <Award className="w-16 h-16 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900 mb-2 font-sans">Brother 1 Name</h3>
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
                <div className="w-32 h-32 bg-gradient-to-br from-secondary-100 to-secondary-300 rounded-full mb-6 flex items-center justify-center">
                  <Target className="w-16 h-16 text-secondary-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900 mb-2 font-sans">Brother 2 Name</h3>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Team Member 1 */}
            <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-medium hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-1 font-sans">John Smith</h3>
                <p className="text-primary-600 font-semibold mb-3">Head Designer</p>
                <p className="text-primary-700 text-sm leading-relaxed">
                  Leading our design team with creative vision and technical expertise in embroidery patterns.
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">Design</span>
                  <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">Creative</span>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-medium hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full mb-4 flex items-center justify-center">
                  <Award className="w-12 h-12 text-secondary-600" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-1 font-sans">Sarah Johnson</h3>
                <p className="text-primary-600 font-semibold mb-3">Production Manager</p>
                <p className="text-primary-700 text-sm leading-relaxed">
                  Ensuring quality control and efficient production workflows for all embroidery projects.
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">Production</span>
                  <span className="px-2 py-1 bg-accent-100 text-accent-700 rounded-full text-xs">Quality</span>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-medium hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full mb-4 flex items-center justify-center">
                  <Target className="w-12 h-12 text-accent-600" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-1 font-sans">Michael Chen</h3>
                <p className="text-primary-600 font-semibold mb-3">Sales Director</p>
                <p className="text-primary-700 text-sm leading-relaxed">
                  Building client relationships and driving business growth through strategic sales initiatives.
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">Sales</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">Client Service</span>
                </div>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-medium hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mb-4 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-primary-700" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-1 font-sans">Emily Davis</h3>
                <p className="text-primary-600 font-semibold mb-3">Customer Relations</p>
                <p className="text-primary-700 text-sm leading-relaxed">
                  Providing exceptional customer service and ensuring client satisfaction throughout the project lifecycle.
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-accent-100 text-accent-700 rounded-full text-xs">Support</span>
                  <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">Communication</span>
                </div>
              </div>
            </div>

            {/* Team Member 5 */}
            <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-medium hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mb-4 flex items-center justify-center">
                  <TrendingUp className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-1 font-sans">David Wilson</h3>
                <p className="text-primary-600 font-semibold mb-3">Marketing Lead</p>
                <p className="text-primary-700 text-sm leading-relaxed">
                  Developing marketing strategies and promoting our brand across digital and traditional platforms.
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">Marketing</span>
                  <span className="px-2 py-1 bg-accent-100 text-accent-700 rounded-full text-xs">Branding</span>
                </div>
              </div>
            </div>

            {/* Team Member 6 */}
            <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-medium hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full mb-4 flex items-center justify-center">
                  <Award className="w-12 h-12 text-secondary-600" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-1 font-sans">Lisa Anderson</h3>
                <p className="text-primary-600 font-semibold mb-3">Finance Manager</p>
                <p className="text-primary-700 text-sm leading-relaxed">
                  Managing financial operations and ensuring sustainable business growth through strategic planning.
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">Finance</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">Planning</span>
                </div>
              </div>
            </div>

            {/* Team Member 7 */}
            <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-medium hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full mb-4 flex items-center justify-center">
                  <Target className="w-12 h-12 text-accent-600" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-1 font-sans">James Taylor</h3>
                <p className="text-primary-600 font-semibold mb-3">Technical Lead</p>
                <p className="text-primary-700 text-sm leading-relaxed">
                  Overseeing technical operations and implementing innovative embroidery technologies and techniques.
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-accent-100 text-accent-700 rounded-full text-xs">Technical</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">Innovation</span>
                </div>
              </div>
            </div>

            {/* Team Member 8 */}
            <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-medium hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mb-4 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-primary-700" />
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-1 font-sans">Rachel Brown</h3>
                <p className="text-primary-600 font-semibold mb-3">HR Manager</p>
                <p className="text-primary-700 text-sm leading-relaxed">
                  Managing human resources and fostering a positive work environment for our growing team.
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">HR</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">Team Building</span>
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
                To be the leading embroidery and textile solutions provider in East Africa, known for our exceptional quality, innovative designs, and commitment to customer satisfaction. We aim to set industry standards while preserving the artistry and tradition of embroidery.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-gradient-to-br from-secondary-50 to-white rounded-3xl p-8 border border-secondary-100">
              <div className="flex items-center mb-6">
                <Award className="w-8 h-8 text-secondary-600 mr-3" />
                <h3 className="text-2xl font-bold text-primary-900 font-sans">Our Mission</h3>
              </div>
              <p className="text-primary-700 leading-relaxed">
                To deliver exceptional embroidery and textile products that exceed customer expectations through innovative designs, quality craftsmanship, and personalized service. We honor our heritage while embracing innovation to create lasting value for our clients and community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
