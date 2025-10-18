import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '../../components/SEO';
import { blogPosts } from '../../data/blogPosts';

export default function BlogPost({ post }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-blue-600 hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${post.title} - No Commute Jobs Blog`}
        description={post.excerpt}
        canonical={`https://no-commute-jobs.com/blog/${post.slug}`}
        ogImage={post.image}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <article className="max-w-4xl mx-auto px-4">
          {/* Back Link */}
          <Link href="/blog" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center text-gray-600 text-sm mb-6">
              <span className="font-medium">{post.author}</span>
              <span className="mx-2">•</span>
              <time dateTime={post.date}>{post.date}</time>
              <span className="mx-2">•</span>
              <span>{post.readTime}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

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
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Footer Navigation */}
          <footer className="border-t pt-8 mt-12">
            <Link
              href="/blog"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Read More Articles
            </Link>
          </footer>
        </article>
      </div>
    </>
  );
}

// Generate static paths for all blog posts
export async function getStaticPaths() {
  const paths = blogPosts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: false, // Show 404 for non-existent posts
  };
}

// Get blog post data
export async function getStaticProps({ params }) {
  const post = blogPosts.find((post) => post.slug === params.slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 86400, // Revalidate once per day (24 hours)
  };
}