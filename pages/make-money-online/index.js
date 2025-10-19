import Link from 'next/link';
import SEO from '../../components/SEO';
import { sideHustles } from '../../data/sideHustles';

export default function MakeMoneyOnline() {
  return (
    <>
      <SEO
        title="Make Money Online: Side Hustles & Passive Income Ideas"
        description="Discover proven side hustles and ways to make money online. Real strategies from surveys to digital products that actually work."
        canonical="https://no-commute-jobs.com/make-money-online"
        keywords="side hustles, make money online, passive income, online jobs, freelance work, survey sites, digital products, AI side hustles"
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Make Money Online
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Real, tested strategies to earn extra income online. No get-rich-quick schemes, just proven methods that actually work.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ← Back to Job Board
            </Link>
          </div>

          {/* Side Hustle Guides Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sideHustles.map((hustle) => (
              <article
                key={hustle.slug}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              >
                {/* Image */}
                <img
                  src={hustle.image}
                  alt={hustle.title}
                  className="w-full h-48 object-cover"
                />

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {hustle.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    <Link
                      href={`/make-money-online/${hustle.slug}`}
                      className="hover:text-blue-600 transition"
                    >
                      {hustle.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {hustle.excerpt}
                  </p>

                  {/* Meta - Read Time */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{hustle.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
