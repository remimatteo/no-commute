import { useState } from 'react';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, Moon, Sun } from 'lucide-react';
import SEO from '../../components/SEO';
import { getAllBlogPosts } from '../../data/blogPosts';

export default function Blog() {
  const [darkMode, setDarkMode] = useState(true);
  const blogPosts = getAllBlogPosts();

  return (
    <>
      <SEO 
        title="Remote Work Blog - Tips, Guides & Insights"
        description="Expert advice on finding remote jobs, productivity tips, work-life balance, and the latest remote work trends. Your guide to successful remote work."
        canonical="https://no-commute-jobs.com/blog"
        keywords="remote work blog, work from home tips, remote job advice, digital nomad guide, remote work productivity"
      />

      <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} transition-colors`}>
        {/* Header */}
        <header className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} sticky top-0 z-50 border-b backdrop-blur-sm bg-opacity-90 transition-colors`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-blue-600 p-2 rounded-xl">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                  <line x1="6" y1="2" x2="6" y2="4"></line>
                  <line x1="10" y1="2" x2="10" y2="4"></line>
                  <line x1="14" y1="2" x2="14" y2="4"></line>
                </svg>
              </div>
              <div>
                <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>No Commute</h1>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'} hover:scale-110 transition-transform`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link href="/" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-semibold transition-colors`}>
                Browse Jobs
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className={`${darkMode ? 'bg-black' : 'bg-gray-50'} py-16 sm:py-20 transition-colors`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Remote Work Blog
            </h2>
            <p className={`text-lg sm:text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Expert guides, tips, and insights to help you succeed in your remote work journey
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md hover:shadow-xl transition-all border overflow-hidden hover:scale-[1.02]`}
              >
                {/* Placeholder for blog image */}
                <div className={`h-48 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                  <div className={`text-6xl ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    📝
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`${darkMode ? 'bg-blue-900/30 text-blue-400 border-blue-700' : 'bg-blue-100 text-blue-700 border-blue-200'} text-xs px-3 py-1 rounded-full font-semibold border`}>
                      {post.category}
                    </span>
                  </div>

                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3 group-hover:text-blue-500 transition-colors line-clamp-2`}>
                    {post.title}
                  </h3>

                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-2`}>
                    {post.excerpt}
                  </p>

                  <div className={`flex items-center justify-between text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>

                  <div className={`mt-4 flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-semibold group-hover:gap-3 transition-all`}>
                    Read more
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}