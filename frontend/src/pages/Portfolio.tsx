import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const placeholders = [
  { title: 'Hospitality uniforms', tag: 'Bulk order' },
  { title: 'School leavers batch', tag: 'Caps & polos' },
  { title: 'Retail launch', tag: 'Merch drop' },
  { title: 'Sports club kit', tag: 'Team branding' },
  { title: 'Corporate rebrand', tag: 'Logo refresh' },
  { title: 'Event giveaways', tag: 'Totes & tees' },
];

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 sm:py-20 bg-gradient-to-b from-surfaceWarm to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-900 font-display mb-6">Portfolio</h1>
          <p className="text-xl text-primary-700 max-w-2xl mx-auto">
            A sample of project types we support — imagery and client names can be added as your case studies grow.
          </p>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {placeholders.map((item) => (
              <article key={item.title} className="group rounded-2xl bg-white overflow-hidden shadow-card hover:shadow-float transition-all duration-300">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 via-surface to-secondary-100 flex items-center justify-center">
                  <span className="text-primary-400 text-sm font-medium uppercase tracking-wider">Photo placeholder</span>
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-secondary-700 uppercase tracking-wide">{item.tag}</span>
                  <h2 className="text-lg font-bold text-primary-900 mt-1">{item.title}</h2>
                  <p className="text-primary-600 text-sm mt-2">Case study copy can go here.</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-primary-700 mb-6">Want something similar for your brand?</p>
          <Link to="/quote" className="btn-secondary inline-flex items-center font-bold">
            Start a project
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
