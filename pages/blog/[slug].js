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
          <div className="prose prose-lg max-w-none mb-12">
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