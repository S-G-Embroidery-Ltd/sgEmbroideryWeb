import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { LOGO_ORIGINATION_KES } from '../config/pricing';

const faqs = [
  {
    q: 'How do I get a quote?',
    a: 'For bulk jobs, uniforms, or mixed orders, use Request a quote. If you only need your PNG or JPEG turned into an embroidery file (digitizing), use Embroidery from your logo instead — that has a fixed origination fee per design.',
  },
  {
    q: 'How much is logo origination (digitizing)?',
    a: `Logo origination — turning your PNG or JPEG into an embroidery-ready file — is KES ${LOGO_ORIGINATION_KES.toLocaleString()} per design (inclusive of VAT). Garment costs and stitching are quoted on top based on quantity and placement.`,
  },
  {
    q: 'What file formats can I upload for my logo?',
    a: `Upload PNG or JPEG logos for digitizing (origination KES ${LOGO_ORIGINATION_KES.toLocaleString()} per design, inclusive of VAT). Vector files (PDF, AI, EPS) are also helpful as reference. For production we use machine formats like DST — our team will guide you.`,
  },
  {
    q: 'What are typical turnaround times?',
    a: 'Turnaround depends on order size and complexity. We give a clear timeline with every quote and keep you updated at each step.',
  },
  {
    q: 'Do you ship outside Nairobi?',
    a: 'Yes — we can arrange delivery across Kenya. Shipping costs and timelines are confirmed before production starts.',
  },
  {
    q: 'How do payments work?',
    a: 'We confirm pricing in writing. For online checkout we support secure card payments; other arrangements can be discussed for corporate POs.',
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 sm:py-20 bg-gradient-to-b from-surface to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-900 font-display mb-6">Frequently asked questions</h1>
          <p className="text-xl text-primary-700">Quick answers about ordering, files, and delivery.</p>
        </div>
      </section>

      <section className="py-12 bg-surface pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="rounded-2xl bg-white shadow-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 font-semibold text-primary-900 hover:bg-surface/50 transition-colors"
                >
                  {item.q}
                  <ChevronDown className={`w-5 h-5 shrink-0 text-primary-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <div className="px-6 pb-5 pt-0 text-primary-700 leading-relaxed">{item.a}</div>}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default FAQ;
