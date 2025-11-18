import Link from 'next/link';
import SEO from '../../components/SEO';
import { sideHustles } from '../../data/sideHustles';
import { ChevronLeft, Clock, Tag } from 'lucide-react';

export default function SideHustlePage({ hustle }) {

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
          <div className="prose prose-lg prose-blue max-w-none mb-12
            prose-headings:font-bold
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-gray-200
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
            prose-ul:my-6 prose-ul:space-y-3
            prose-ol:my-6 prose-ol:space-y-3
            prose-li:text-gray-700 prose-li:leading-relaxed prose-li:text-lg
            prose-a:text-blue-600 prose-a:no-underline prose-a:font-semibold hover:prose-a:text-blue-700 hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:my-6
            prose-code:bg-gray-100 prose-code:text-gray-900 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-table:my-8 prose-th:bg-gray-100 prose-th:p-3 prose-td:p-3 prose-td:border prose-td:border-gray-200
            prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
            [&>div>h2]:text-3xl [&>div>h2]:mt-12 [&>div>h2]:mb-6 [&>div>h2]:pb-3 [&>div>h2]:border-b-2 [&>div>h2]:border-gray-200 [&>div>h2]:font-bold
            [&>div>h3]:text-2xl [&>div>h3]:mt-8 [&>div>h3]:mb-4 [&>div>h3]:font-bold
            [&>div>p]:text-gray-700 [&>div>p]:leading-relaxed [&>div>p]:mb-6 [&>div>p]:text-lg
            [&>div>ul]:my-6 [&>div>ul]:space-y-3 [&>div>ul]:pl-6
            [&>div>ol]:my-6 [&>div>ol]:space-y-3 [&>div>ol]:pl-6
            [&>div>li]:text-gray-700 [&>div>li]:leading-relaxed [&>div>li]:text-lg
            [&>div>blockquote]:border-l-4 [&>div>blockquote]:border-blue-500 [&>div>blockquote]:pl-6 [&>div>blockquote]:italic [&>div>blockquote]:bg-blue-50 [&>div>blockquote]:py-4 [&>div>blockquote]:my-6 [&>div>blockquote]:rounded-r-lg
            [&>div>table]:w-full [&>div>table]:my-8 [&>div>table]:border [&>div>table]:border-gray-200 [&>div>table]:rounded-lg [&>div>table]:overflow-hidden
            [&>div>table>thead>tr>th]:bg-gray-100 [&>div>table>thead>tr>th]:p-3 [&>div>table>thead>tr>th]:font-bold [&>div>table>thead>tr>th]:text-left
            [&>div>table>tbody>tr>td]:p-3 [&>div>table>tbody>tr>td]:border-t [&>div>table>tbody>tr>td]:border-gray-200
          ">
            <div dangerouslySetInnerHTML={{ __html: hustle.content }} />
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 bg-white rounded-xl p-8 text-center border border-gray-200 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Want Stable Remote Work Instead?
            </h2>
            <p className="text-lg mb-6 text-gray-700">
              Explore 2000+ verified remote job listings across tech, marketing, design, customer support, and more.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
                .filter(h => h.slug !== hustle.slug)
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

export async function getStaticPaths() {
  const paths = sideHustles.map((hustle) => ({
    params: { slug: hustle.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const hustle = sideHustles.find(h => h.slug === params.slug);

  if (!hustle) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      hustle,
    },
  };
}
