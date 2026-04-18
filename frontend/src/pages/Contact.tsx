import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { whatsappChannelUrl, whatsappChannelHref } from '../config/site';

const Contact = () => {
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
                  <a href="tel:+254700000000" className="text-primary-700 hover:text-secondary-700 font-medium">
                    +254 700 000 000
                  </a>
                  <p className="text-sm text-primary-600 mt-1">Replace with your business number.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary-100 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <h2 className="font-bold text-primary-900 mb-1">Email</h2>
                  <a href="mailto:info@sgembroidery.com" className="text-primary-700 hover:text-secondary-700 font-medium">
                    info@sgembroidery.com
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
    </div>
  );
};

export default Contact;
