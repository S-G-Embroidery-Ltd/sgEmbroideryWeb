import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Eye, 
  Play, 
  Image as ImageIcon, 
  ArrowRight,
  CheckCircle,
  Target,
  Lightbulb,
  HandHeart
} from 'lucide-react';

const Projects = () => {
  const [selectedMedia, setSelectedMedia] = useState<'video' | 'image'>('video');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-900 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Community Impact Projects
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-6">
              Empowering Through
              <span className="text-secondary-600"> Tactile Learning</span>
            </h1>
            <p className="text-xl text-primary-600 max-w-3xl mx-auto mb-8">
              Using embroidery as a medium to create accessible learning tools for visually impaired students, 
              transforming education through touch and texture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/volunteer"
                className="inline-flex items-center gap-2 bg-secondary-500 text-primary-900 px-6 py-3 rounded-full font-bold hover:bg-secondary-400 transition-colors"
              >
                <Users className="w-5 h-5" />
                Join Our Mission
              </Link>
              <button className="inline-flex items-center gap-2 bg-white text-primary-900 px-6 py-3 rounded-full font-bold border-2 border-primary-200 hover:bg-primary-50 transition-colors">
                <Play className="w-5 h-5" />
                Watch Our Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tactile Learning Project Spotlight */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent-100 text-accent-900 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                Featured Project
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
                Tactile Learning Initiative
              </h2>
              
              {/* Problem Statement */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-secondary-500" />
                  The Challenge
                </h3>
                <p className="text-primary-600 leading-relaxed">
                  Visually impaired students often face significant barriers in accessing educational materials. 
                  Traditional learning tools rely heavily on visual elements, leaving these students without 
                  effective ways to understand complex concepts through touch and interaction.
                </p>
              </div>

              {/* Our Solution */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-secondary-500" />
                  Our Solution
                </h3>
                <p className="text-primary-600 leading-relaxed mb-4">
                  We're developing embroidered tactile learning aids that transform abstract concepts into 
                  tangible, touch-friendly educational tools. Each piece combines different textures, 
                  raised patterns, and Braille elements to create multi-sensory learning experiences.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-primary-900">Interactive Maps:</strong> Geographical features with different textures for terrain
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-primary-900">Mathematical Concepts:</strong> Numbers and shapes through raised patterns
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-primary-900">Biological Models:</strong> Plant and animal structures with textured details
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="bg-primary-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-primary-900 mb-2">Current Status: Ideation Phase</h3>
                <p className="text-primary-600 mb-4">
                  We're currently in the research and development phase, collaborating with educators 
                  and accessibility experts to design the most effective tactile learning tools.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-secondary-100 text-secondary-900 px-3 py-1 rounded-full text-sm font-medium">
                    Research & Development
                  </span>
                  <span className="bg-secondary-100 text-secondary-900 px-3 py-1 rounded-full text-sm font-medium">
                    Prototype Testing
                  </span>
                  <span className="bg-secondary-100 text-secondary-900 px-3 py-1 rounded-full text-sm font-medium">
                    Partner Collaboration
                  </span>
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div>
              <div className="bg-surface rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-primary-900">Behind the Scenes</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedMedia('video')}
                      className={`p-2 rounded-lg transition-colors ${
                        selectedMedia === 'video' 
                          ? 'bg-primary-100 text-primary-900' 
                          : 'text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedMedia('image')}
                      className={`p-2 rounded-lg transition-colors ${
                        selectedMedia === 'image' 
                          ? 'bg-primary-100 text-primary-900' 
                          : 'text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {selectedMedia === 'video' ? (
                  <div className="aspect-video bg-primary-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-12 h-12 text-primary-400 mx-auto mb-3" />
                      <p className="text-primary-600 font-medium">Project Development Video</p>
                      <p className="text-primary-500 text-sm">Coming soon</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-primary-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-primary-400 mx-auto mb-3" />
                      <p className="text-primary-600 font-medium">Design Sketches Gallery</p>
                      <p className="text-primary-500 text-sm">Coming soon</p>
                    </div>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square bg-primary-100 rounded-lg flex items-center justify-center">
                      {selectedMedia === 'video' ? (
                        <Play className="w-6 h-6 text-primary-400" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-primary-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Anticipated Impact
            </h2>
            <p className="text-xl text-primary-600 max-w-3xl mx-auto">
              Our tactile learning initiative aims to transform educational accessibility for visually impaired students.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-card">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-2">500+</h3>
              <p className="text-primary-600">Students Impacted Annually</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-card">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-2">50+</h3>
              <p className="text-primary-600">Learning Tools Developed</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-card">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HandHeart className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-2">10+</h3>
              <p className="text-primary-600">Partner Schools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">
            Be Part of the Solution
          </h2>
          <p className="text-xl text-primary-600 mb-8">
            Whether you're an educator, designer, or passionate about accessibility, 
            your skills can help make learning accessible to all.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-2 bg-secondary-500 text-primary-900 px-6 py-3 rounded-full font-bold hover:bg-secondary-400 transition-colors"
            >
              <HandHeart className="w-5 h-5" />
              Volunteer Your Skills
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary-800 text-white px-6 py-3 rounded-full font-bold hover:bg-primary-900 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
