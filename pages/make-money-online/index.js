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
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                  {/* Category & Read Time */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {hustle.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {hustle.readTime}
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
                </div>
              </article>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Looking for Steady Income Instead?
            </h2>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Side hustles are great for extra cash, but if you want stable, consistent income with benefits, explore our remote job listings. Many positions offer the flexibility of freelancing with the security of a paycheck.
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg"
            >
              Browse 2000+ Remote Jobs
            </Link>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  How much can I realistically make with side hustles?
                </h3>
                <p className="text-gray-600">
                  It varies widely based on the hustle and time invested. Many people make $300-1,000/month working 10-15 hours per week. With focused effort, $2,000-5,000/month is achievable. Check each guide for realistic income expectations.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Do I need experience to start a side hustle?
                </h3>
                <p className="text-gray-600">
                  Most side hustles we cover require minimal experience. We focus on opportunities anyone can start with basic skills and internet access. Our guides walk you through the process step-by-step.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  How quickly can I start making money?
                </h3>
                <p className="text-gray-600">
                  Some options (like surveys and micro tasks) pay immediately. Others (like digital products and content creation) take 1-3 months to build momentum. Our guides include realistic timelines for each opportunity.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Can side hustles become full-time income?
                </h3>
                <p className="text-gray-600">
                  Yes, many people transition successful side hustles into full-time work. However, we recommend starting part-time while keeping your main income source. Once your side income is consistent and sustainable, you can consider going full-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
