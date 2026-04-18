const topics = ['Embroidery tips', 'Corporate', 'Care', 'Industry news', 'Behind the scenes'];

const skeletonPosts = [
  { id: 1, category: 'Tips', titleWidth: 'w-3/4' },
  { id: 2, category: 'Corporate', titleWidth: 'w-5/6' },
  { id: 3, category: 'Care', titleWidth: 'w-2/3' },
  { id: 4, category: 'News', titleWidth: 'w-4/5' },
  { id: 5, category: 'Studio', titleWidth: 'w-3/5' },
  { id: 6, category: 'Tips', titleWidth: 'w-11/12' },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <header className="mb-10 lg:mb-14 max-w-3xl">
          <p className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-2">Journal</p>
          <h1 className="text-4xl font-bold text-primary-900 font-display mb-4">Blog</h1>
          <p className="text-lg text-primary-700">
            Wireframe template — replace with real posts when your CMS or markdown pipeline is ready.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 mb-10">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              className="px-4 py-2 rounded-full text-sm font-medium bg-white text-primary-700 shadow-card hover:shadow-float transition-shadow"
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {skeletonPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl bg-white border border-dashed border-primary-200 p-5 shadow-card flex flex-col"
              >
                <div className="aspect-[16/10] rounded-xl bg-surface-muted mb-4 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">Image</span>
                </div>
                <span className="text-xs font-semibold text-secondary-700 uppercase mb-2">{post.category}</span>
                <div className={`h-5 rounded bg-primary-100 ${post.titleWidth} mb-2`} title="Title placeholder" />
                <div className="h-3 rounded bg-primary-50 w-full mb-1" />
                <div className="h-3 rounded bg-primary-50 w-4/5 mt-auto pt-4" />
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-white border border-dashed border-primary-200 p-6 shadow-card">
              <h2 className="font-bold text-primary-900 mb-4 font-display">Popular topics</h2>
              <ul className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-lg bg-surface-muted shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-primary-100 rounded w-3/4" />
                      <div className="h-2 bg-primary-50 rounded w-1/2" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-primary-900 text-white p-6 shadow-float">
              <p className="text-sm text-primary-200 mb-2">Newsletter</p>
              <div className="h-10 rounded-xl bg-white/10 mb-2" />
              <div className="h-10 rounded-xl bg-secondary-500/90 w-24" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;
