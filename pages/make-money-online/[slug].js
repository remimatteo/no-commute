import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '../../components/SEO';
import { sideHustles } from '../../data/sideHustles';
import { ChevronLeft, Clock, Tag } from 'lucide-react';

export default function SideHustlePage() {
  const router = useRouter();
  const { slug } = router.query;

  const hustle = sideHustles.find(h => h.slug === slug);

  if (!hustle) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Guide Not Found</h1>
          <p className="text-gray-600 mb-8">This side hustle guide does not exist or has been moved.</p>
          <Link href="/make-money-online" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-block">
            Back to Side Hustles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${hustle.title} - No Commute`}
        description={hustle.excerpt}
        canonical={`https://no-commute-jobs.com/make-money-online/${hustle.slug}`}
        ogImage={hustle.image}
        keywords={`${hustle.category}, side hustles, make money online, passive income, online jobs`}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            <Link
              href="/make-money-online"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-4 transition"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Side Hustles
            </Link>
          </div>
        </div>

        {/* Article */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* Featured Image */}
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={hustle.image}
              alt={hustle.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-flex items-center text-sm text-gray-600">
              <Tag className="w-4 h-4 mr-1.5" />
              {hustle.category}
            </span>
            <span className="inline-flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1.5" />
              {hustle.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {hustle.title}
          </h1>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:my-6 prose-li:my-2 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-4 prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: hustle.content }}
          />

          {/* Bottom CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Want Stable Remote Work Instead?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Explore 2000+ verified remote job listings across tech, marketing, design, customer support, and more.
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Browse Remote Jobs
            </Link>
          </div>

          {/* Related Guides */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              More Side Hustle Guides
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {sideHustles
                .filter(h => h.slug !== slug)
                .slice(0, 4)
                .map(relatedHustle => (
                  <Link
                    key={relatedHustle.slug}
                    href={`/make-money-online/${relatedHustle.slug}`}
                    className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition group"
                  >
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block mb-3">
                      {relatedHustle.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                      {relatedHustle.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedHustle.excerpt}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
