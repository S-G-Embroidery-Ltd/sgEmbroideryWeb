import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

const openings = [
  {
    title: 'Embroidery machine operator',
    type: 'Full-time',
    location: 'Nairobi',
    summary:
      'Run multi-head embroidery machines, load designs, monitor quality, and maintain daily production schedules.',
  },
  {
    title: 'Digitizing / embroidery file specialist',
    type: 'Full-time',
    location: 'Nairobi',
    summary:
      'Convert client artwork into production-ready embroidery files (DST/EMB etc.), collaborate with production on stitch quality.',
  },
  {
    title: 'Production assistant — textiles',
    type: 'Full-time',
    location: 'Nairobi',
    summary:
      'Support hooping, trimming, quality checks, and packing. Prior experience in apparel or embroidery is a plus.',
  },
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-surface">
      <section className="relative bg-gradient-to-br from-primary-50 to-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary-100 text-secondary-700 mb-6">
            <Briefcase className="w-7 h-7" strokeWidth={1.75} />
          </div>
          <h1 className="text-4xl font-bold text-primary-900 mb-4 font-display">Careers</h1>
          <p className="text-lg text-primary-700 leading-relaxed">
            Join S &amp; G Embroidery Ltd. We value craftsmanship, reliability, and growth. Explore open roles below and tell us
            how you&apos;d like to contribute.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-primary-900 font-display mb-8">Open positions</h2>
          <ul className="space-y-6">
            {openings.map((job) => (
              <li
                key={job.title}
                className="rounded-2xl border border-primary-100 bg-white p-6 sm:p-8 shadow-card hover:shadow-float transition-shadow"
              >
                <h3 className="text-xl font-bold text-primary-900 font-display mb-2">{job.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-primary-600 mb-4">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 shrink-0" />
                    {job.type}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 shrink-0" />
                    {job.location}
                  </span>
                </div>
                <p className="text-primary-700 leading-relaxed mb-6">{job.summary}</p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-secondary-700 font-semibold hover:text-secondary-800"
                >
                  Apply via Contact
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center text-primary-600 text-sm">
            Don&apos;t see a perfect fit? Send your CV and a short note through{' '}
            <Link to="/contact" className="text-secondary-700 font-semibold hover:underline">
              Contact
            </Link>{' '}
            — we keep talent on file for future roles.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Careers;
