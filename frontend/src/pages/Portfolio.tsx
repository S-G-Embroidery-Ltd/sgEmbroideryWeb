import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

const portfolioVideos = [
  { 
    title: 'Kilua Hotel', 
    tag: 'Hospitality',
    videoUrl: 'https://www.tiktok.com/@sg_embroidery_ltd/video/7375053846000717062',
    videoId: '7375053846000717062'
  },
  { 
    title: 'Tech Kidz Africa', 
    tag: 'Education',
    videoUrl: 'https://www.tiktok.com/@sg_embroidery_ltd/video/7530500113030974726',
    videoId: '7530500113030974726'
  },
  { 
    title: 'KidsBuddy', 
    tag: 'Education',
    videoUrl: 'https://www.tiktok.com/@sg_embroidery_ltd/video/7526484899096808710',
    videoId: '7526484899096808710'
  },
  { 
    title: 'J & M Spa', 
    tag: 'Wellness',
    videoUrl: 'https://www.tiktok.com/@sg_embroidery_ltd/video/7527650720422563077',
    videoId: '7527650720422563077'
  },
  { 
    title: 'Loretor School', 
    tag: 'Education',
    videoUrl: 'https://www.tiktok.com/@sg_embroidery_ltd/video/7491226588965621047',
    videoId: '7491226588965621047'
  },
  { 
    title: 'Additional Project', 
    tag: 'Corporate',
    videoUrl: 'https://www.tiktok.com/@sg_embroidery_ltd/video/7402232751157464326',
    videoId: '7402232751157464326'
  },
];

const Portfolio = () => {
  useEffect(() => {
    // Set up video monitoring for TikTok iframes
    const iframes = document.querySelectorAll('iframe[src*="tiktok.com/embed"]') as NodeListOf<HTMLIFrameElement>;
    
    // Store intervals for cleanup
    const intervals: number[] = [];
    
    // Add refresh functionality to all TikTok iframes
    iframes.forEach((iframe) => {
      // Refresh video every 60 seconds to keep it playing
      const refreshInterval = setInterval(() => {
        try {
          const currentSrc = iframe.src;
          // Clear and reset src to restart the video
          iframe.src = '';
          setTimeout(() => {
            iframe.src = currentSrc;
          }, 100);
        } catch (error) {
          console.log('Video refresh error:', error);
        }
      }, 60000); // Refresh every 60 seconds
      
      intervals.push(refreshInterval);
    });

    // Cleanup intervals on component unmount
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, []);

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
            {portfolioVideos.map((item) => (
              <article key={item.videoId} className="group rounded-2xl bg-white overflow-hidden shadow-card hover:shadow-float transition-all duration-300">
                <div className="aspect-[9/16] bg-black relative">
                  <iframe
                    src={`https://www.tiktok.com/embed/${item.videoId}`}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-secondary-700 uppercase tracking-wide">{item.tag}</span>
                  <h2 className="text-lg font-bold text-primary-900 mt-1">{item.title}</h2>
                  <p className="text-primary-600 text-sm mt-2">Custom embroidery design for {item.title.toLowerCase()}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* View More Section */}
      <section className="py-12 bg-surface border-t border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-700 mb-6">Want to see more of our work?</p>
          <a 
            href="https://www.tiktok.com/@sg_embroidery_ltd" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary-900 px-6 py-3 rounded-full font-bold border-2 border-primary-200 hover:bg-primary-50 transition-colors shadow-card"
          >
            View more projects on TikTok
            <ArrowRight className="w-4 h-4" />
          </a>
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
