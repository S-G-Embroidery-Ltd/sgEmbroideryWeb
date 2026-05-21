import { MapPin, Phone, Mail, MessageCircle, Send, Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { whatsappChannelUrl, whatsappChannelHref } from '../config/site';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
      console.log('Sending contact email via serverless function:', formData);

      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Email sent successfully:', result);
        
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 sm:py-20 bg-gradient-to-b from-surfaceWarm to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-900 font-display mb-6">Contact us</h1>
          <p className="text-xl text-primary-700 max-w-2xl mx-auto">
            Visit, call, email, or join our WhatsApp community — we&apos;re here to help with orders and questions.
          </p>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="rounded-3xl bg-white p-8 shadow-card space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h2 className="font-bold text-primary-900 mb-1">Location</h2>
                  <p className="text-primary-700 leading-relaxed">
                    Update with your street, city, and county. Map embed can be added below when you have coordinates.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary-100 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h2 className="font-bold text-primary-900 mb-1">Phone</h2>
                  <a href="tel:+254710422557" className="text-primary-700 hover:text-secondary-700 font-medium">
                    +254 710 422 557
                  </a>
                  <p className="text-sm text-primary-600 mt-1">Calls & WhatsApp</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary-100 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h2 className="font-bold text-primary-900 mb-1">Email</h2>
                  <a href="mailto:sgembroideryltd@gmail.com" className="text-primary-700 hover:text-secondary-700 font-medium">
                    sgembroideryltd@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-primary-900 text-white p-8 shadow-float flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                  <MessageCircle className="w-6 h-6 text-secondary-400" />
                </div>
                <h2 className="text-2xl font-bold font-display mb-3">WhatsApp community</h2>
                <p className="text-primary-100 leading-relaxed mb-6">
                  Join for updates, tips, and quick questions — separate from one-to-one chat on the floating button.
                </p>
              </div>
              <div>
                <a
                  href={whatsappChannelHref()}
                  {...(whatsappChannelUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-secondary-500 text-primary-900 font-bold rounded-2xl hover:bg-secondary-400 transition-colors"
                >
                  Join the channel
                </a>
                {!whatsappChannelUrl && (
                  <p className="text-sm text-primary-200 mt-4">
                    Set <code className="text-secondary-300">VITE_WHATSAPP_CHANNEL_URL</code> in your environment for the
                    invite link.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-surface-muted min-h-[200px] flex items-center justify-center text-primary-500 text-sm">
            Map placeholder — embed Google Maps when ready
          </div>

          <p className="text-center mt-10 text-primary-700">
            Prefer a structured request?{' '}
            <Link to="/quote" className="text-secondary-700 font-semibold hover:underline">
              Get a quote
            </Link>
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-900 font-display mb-4">Send us a message</h2>
            <p className="text-lg text-primary-700">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-secondary-50 border border-secondary-200 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-secondary-700" />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-2">Message Sent!</h3>
              <p className="text-primary-700 mb-6">
                Thank you for contacting us. We've received your message and will respond within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="btn-primary text-center"
                >
                  Send Another Message
                </button>
                <Link to="/" className="btn-outline text-center">
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface rounded-3xl p-8 shadow-card">
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
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-secondary-400/50 focus:border-secondary-400 transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Quote Request">Quote Request</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Partnership">Partnership Opportunity</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-primary-800 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-secondary-400/50 focus:border-secondary-400 transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-secondary-500 text-primary-900 px-6 py-3 rounded-full font-bold hover:bg-secondary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-sm text-primary-600 mt-4">
                Or call us directly at <a href="tel:+254710422557" className="font-semibold text-secondary-700 hover:text-secondary-800">+254 710 422 557</a>
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contact;
