import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  HandHeart, 
  GraduationCap,
  Palette,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle,
  Send,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const Volunteer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    volunteerType: '',
    skills: '',
    availability: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Sending volunteer application via serverless function:', formData);

      const response = await fetch('http://localhost:3000/api/volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Volunteer application sent successfully:', result);
        
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          volunteerType: '',
          skills: '',
          availability: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Volunteer form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const volunteerOpportunities = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'Educational Support',
      description: 'Help develop and test tactile learning materials with students and educators.',
      skills: ['Teaching', 'Special Education', 'Curriculum Development'],
      timeCommitment: '2-4 hours/week'
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Embroidery Assistance',
      description: 'Create embroidered tactile learning aids using your embroidery skills.',
      skills: ['Embroidery', 'Design', 'Attention to Detail'],
      timeCommitment: 'Flexible'
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Administrative Support',
      description: 'Help with project coordination, outreach, and organizational tasks.',
      skills: ['Organization', 'Communication', 'Project Management'],
      timeCommitment: '3-5 hours/week'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Outreach',
      description: 'Connect with schools, organizations, and potential partners.',
      skills: ['Public Speaking', 'Networking', 'Social Media'],
      timeCommitment: '1-3 hours/week'
    }
  ];

  const supportWays = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Financial Support',
      description: 'Donate to help us purchase materials and develop new learning tools.',
      action: 'Make a Donation'
    },
    {
      icon: <HandHeart className="w-6 h-6" />,
      title: 'In-Kind Support',
      description: 'Provide embroidery materials, equipment, or professional services.',
      action: 'Provide Materials'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Partnership',
      description: 'Partner with us as a school, organization, or corporate sponsor.',
      action: 'Become a Partner'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary-50 to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-secondary-100 text-secondary-900 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Join Our Community
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-6">
              Volunteer With Us
            </h1>
            <p className="text-xl text-primary-600 max-w-3xl mx-auto mb-8">
              Your time, skills, and support can help create accessible learning tools that transform 
              education for visually impaired students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 bg-primary-800 text-white px-6 py-3 rounded-full font-bold hover:bg-primary-900 transition-colors"
              >
                View Our Projects
              </Link>
              <a
                href="#volunteer-form"
                className="inline-flex items-center gap-2 bg-secondary-500 text-primary-900 px-6 py-3 rounded-full font-bold hover:bg-secondary-400 transition-colors"
              >
                <Send className="w-5 h-5" />
                Apply to Volunteer
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Volunteer Opportunities
            </h2>
            <p className="text-xl text-primary-600 max-w-3xl mx-auto">
              Find the perfect way to contribute your skills and time to our mission.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {volunteerOpportunities.map((opportunity, index) => (
              <div key={index} className="bg-white border border-primary-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 flex-shrink-0">
                    {opportunity.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary-900 mb-3">{opportunity.title}</h3>
                    <p className="text-primary-600 mb-4">{opportunity.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-primary-800 mb-2">Skills Needed:</p>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-primary-600">
                      <Clock className="w-4 h-4" />
                      <span>{opportunity.timeCommitment}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Other Ways to Support
            </h2>
            <p className="text-xl text-primary-600 max-w-3xl mx-auto">
              Can't volunteer? There are many ways to support our mission.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {supportWays.map((support, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-card">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary-600">
                  {support.icon}
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-3">{support.title}</h3>
                <p className="text-primary-600 mb-6">{support.description}</p>
                <button className="bg-secondary-500 text-primary-900 px-6 py-2 rounded-full font-bold hover:bg-secondary-400 transition-colors">
                  {support.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Form */}
      <section id="volunteer-form" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-primary-600">
              Fill out the form below and we'll get in touch with you about volunteer opportunities.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-secondary-50 border border-secondary-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-secondary-700" />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-2">Thank You!</h3>
              <p className="text-primary-600 mb-6">
                We've received your application and will be in touch with you soon about next steps.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="btn-primary text-center"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary-800 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-secondary-400/50 focus:border-secondary-400 transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-800 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-secondary-400/50 focus:border-secondary-400 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-800 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-secondary-400/50 focus:border-secondary-400 transition-colors"
                    placeholder="+254 700 000 000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-800 mb-2">
                    Volunteer Opportunity *
                  </label>
                  <select
                    name="volunteerType"
                    value={formData.volunteerType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-secondary-400/50 focus:border-secondary-400 transition-colors"
                  >
                    <option value="">Select an opportunity</option>
                    <option value="educational">Educational Support</option>
                    <option value="embroidery">Embroidery Assistance</option>
                    <option value="administrative">Administrative Support</option>
                    <option value="outreach">Community Outreach</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-800 mb-2">
                    Relevant Skills
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-secondary-400/50 focus:border-secondary-400 transition-colors"
                    placeholder="e.g., Teaching, Embroidery, Design"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-800 mb-2">
                    Availability
                  </label>
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-secondary-400/50 focus:border-secondary-400 transition-colors"
                    placeholder="e.g., Weekends, 2-4 hours/week"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-primary-800 mb-2">
                  Tell us about yourself and why you want to volunteer *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-secondary-400/50 focus:border-secondary-400 transition-colors"
                  placeholder="Share your motivation and any relevant experience..."
                />
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-secondary-500 text-primary-900 px-6 py-3 rounded-full font-bold hover:bg-secondary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-900 mb-8">
            Have Questions?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Phone className="w-8 h-8 text-secondary-600 mb-3" />
              <h3 className="font-bold text-primary-900 mb-1">Phone</h3>
              <p className="text-primary-600">+254 710 422 557</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="w-8 h-8 text-secondary-600 mb-3" />
              <h3 className="font-bold text-primary-900 mb-1">Email</h3>
              <p className="text-primary-600">sgembroideryltd@gmail.com</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-8 h-8 text-secondary-600 mb-3" />
              <h3 className="font-bold text-primary-900 mb-1">Location</h3>
              <p className="text-primary-600">Nairobi, Kenya</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Volunteer;
