import React, { useState } from 'react';
import { MapPin, DollarSign, Clock, Briefcase, ExternalLink, ArrowLeft, Moon, Sun } from 'lucide-react';
import SEO from '../../../components/SEO';
import JobSchema from '../../../components/JobSchema';
import BreadcrumbSchema from '../../../components/BreadcrumbSchema';
import Link from 'next/link';
import { Pool } from 'pg';
import { formatSalary } from '../../../lib/formatSalary';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const formatDate = (dateString) => {
  if (!dateString) return 'Recently';

  try {
    const date = new Date(dateString);
    const now = new Date();

    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return '0d ago';
    if (diffDays === 0) return '0d ago';
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  } catch (e) {
    console.error('Date parsing error:', dateString, e);
    return 'Recently';
  }
};

const normalizeCategory = (cat) => {
  if (!cat) return 'Other';
  const c = cat.toLowerCase();

  if (c.includes('dev') || c.includes('engineer') || c.includes('software')) {
    return 'Software Development';
  }
  if (c.includes('design') || c.includes('ui') || c.includes('ux')) {
    return 'Design';
  }
  if (c.includes('marketing') || c.includes('growth')) {
    return 'Marketing';
  }
  if (c.includes('sales') || c.includes('business')) {
    return 'Sales / Business';
  }
  if (c.includes('support') || c.includes('customer')) {
    return 'Customer Service';
  }
  return 'Other';
};

export default function JobDetailPage({ job, similarJobs = [] }) {
  const [darkMode, setDarkMode] = useState(false);

  if (!job) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Job Not Found</h1>
          <p className="text-gray-400 mb-8">This job posting may have been removed or expired.</p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl inline-block">
            Browse All Jobs
          </Link>
        </div>
      </div>
    );
  }

  const transformedJob = {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location || 'Remote',
    salary: job.salary || 'Competitive',
    type: job.type || 'Full-time',
    category: normalizeCategory(job.category),
    tags: job.tags || [],
    postedDate: job.posted_date || job.created_at,
    description: job.description || '',
    applyUrl: job.apply_url || job.url || '#',
    company_url: job.company_url || job.url || '',
    source: job.source || 'RemoteOK',
    created_at: job.created_at
  };

  return (
    <>
      <SEO
        title={`${transformedJob.title} at ${transformedJob.company} - Remote Job`}
        description={`Remote ${transformedJob.type} position: ${transformedJob.title} at ${transformedJob.company}. ${transformedJob.location}. ${transformedJob.salary}. Apply now on No Commute Jobs.`}
        canonical={`https://no-commute-jobs.com/jobs/${job.id}/${job.slug}`}
        keywords={`${transformedJob.title}, ${transformedJob.company}, remote job, ${transformedJob.category}, ${transformedJob.tags.join(', ')}, work from home`}
        ogType="article"
      />

      <JobSchema job={transformedJob} />
      <BreadcrumbSchema jobTitle={transformedJob.title} jobId={job.id} slug={job.slug} />

      <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} transition-colors`}>
        {/* Header */}
        <header className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} sticky top-0 z-50 border-b backdrop-blur-sm bg-opacity-90 transition-colors`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src="/logo.png"
                alt="No Commute Logo"
                className="w-10 h-10"
              />
              <div>
                <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>No Commute</h1>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/blog"
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Blog
              </Link>
              <Link
                href="/forum"
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Forum
              </Link>
              <Link
                href="/make-money-online"
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                Side Hustles
              </Link>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'} hover:scale-110 transition-transform`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/"
            className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} mb-6 flex items-center font-semibold text-lg group transition-colors`}
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to all jobs
          </Link>

          <div className="mb-8">
            <h2 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
              {transformedJob.title}
            </h2>
            <p className={`text-xl sm:text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold mb-6`}>
              {transformedJob.company}
            </p>

            {/* Job Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className={`flex items-center ${darkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} p-4 rounded-xl transition-colors`}>
                <MapPin className={`w-5 h-5 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} font-medium`}>Location</p>
                  <p className="font-semibold">{transformedJob.location}</p>
                </div>
              </div>
              <div className={`flex items-center ${darkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} p-4 rounded-xl transition-colors`}>
                <DollarSign className={`w-5 h-5 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} font-medium`}>Salary</p>
                  <p className="font-semibold">{formatSalary(transformedJob.salary)}</p>
                </div>
              </div>
              <div className={`flex items-center ${darkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} p-4 rounded-xl transition-colors`}>
                <Clock className={`w-5 h-5 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} font-medium`}>Posted</p>
                  <p className="font-semibold">{formatDate(transformedJob.postedDate)}</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`${darkMode ? 'bg-green-900/30 text-green-400 border-green-700' : 'bg-green-100 text-green-700 border-green-200'} px-4 py-2 rounded-full font-semibold border`}>
                {transformedJob.type}
              </span>
              <span className={`${darkMode ? 'bg-purple-900/30 text-purple-400 border-purple-700' : 'bg-purple-100 text-purple-700 border-purple-200'} px-4 py-2 rounded-full font-semibold border`}>
                {transformedJob.category}
              </span>
            </div>

            {/* Apply Button - Top */}
            <a
              href={transformedJob.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl inline-flex items-center justify-center gap-3 text-lg transition-all transform hover:scale-105 shadow-lg mb-2"
            >
              Apply on Company Website
              <ExternalLink className="w-5 h-5" />
            </a>

            {/* Job Description - Only show if description exists and has content */}
            {transformedJob.description && transformedJob.description.trim().length > 50 && (
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 sm:p-8 shadow-lg mb-6 border transition-colors`}>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>About the Role</h3>
                <div
                  className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed prose prose-invert max-w-none job-description`}
                  dangerouslySetInnerHTML={{ __html: transformedJob.description }}
                />
              </div>
            )}

            {/* Skills & Tags */}
            {transformedJob.tags.length > 0 && (
              <div className="mb-8">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Skills & Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {transformedJob.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`${darkMode ? 'bg-blue-900/30 text-blue-300 border-blue-700' : 'bg-blue-50 text-blue-700 border-blue-200'} px-4 py-2 rounded-full font-medium border transition-colors`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Button - Bottom */}
            <a
              href={transformedJob.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl inline-flex items-center justify-center gap-3 text-lg transition-all transform hover:scale-105 shadow-lg mb-2"
            >
              Apply on Company Website
              <ExternalLink className="w-5 h-5" />
            </a>
            {/* Display Apply URL */}
            <div className="mb-4 text-center">
              <a
                href={transformedJob.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} break-all transition-colors`}
              >
                {transformedJob.applyUrl}
              </a>
            </div>

            {/* Job Source */}
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'} text-center mt-2`}>
              Job sourced from {transformedJob.source}
            </p>
          </div>
        </div>

        {/* Similar Jobs Section */}
        {similarJobs && similarJobs.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Similar {normalizeCategory(transformedJob.category)} Jobs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarJobs.map(similarJob => {
                const jobSlug = similarJob.slug || `${similarJob.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-at-${similarJob.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                return (
                  <Link href={`/jobs/${similarJob.id}/${jobSlug}`} key={similarJob.id}>
                    <div className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-400'} border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer h-full`}>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2 line-clamp-2`}>
                        {similarJob.title}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                        {similarJob.company}
                      </p>
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                            {similarJob.location}
                          </span>
                        </div>
                        {similarJob.salary && similarJob.salary !== 'Competitive' && similarJob.salary.match(/\d/) && (
                          <div className="flex items-center gap-2">
                            <DollarSign className={`w-4 h-4 ${darkMode ? 'text-green-500' : 'text-green-600'}`} />
                            <span className={`${darkMode ? 'text-green-400' : 'text-green-700'} font-medium truncate`}>
                              {formatSalary(similarJob.salary)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs`}>
                            {formatDate(similarJob.posted_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link href={`/?category=${encodeURIComponent(transformedJob.category)}`}>
                <button className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold px-6 py-3 rounded-lg transition-colors`}>
                  View All {normalizeCategory(transformedJob.category)} Jobs →
                </button>
              </Link>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t transition-colors mt-12`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="mb-2">© 2025 No Commute. Work from anywhere, live everywhere.</p>
              <Link href="/" className="text-blue-500 hover:text-blue-400 transition-colors">
                Browse all remote jobs
              </Link>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .job-description h1,
        .job-description h2,
        .job-description h3,
        .job-description h4 {
          margin-top: 1.5em;
          margin-bottom: 0.75em;
          font-weight: 600;
        }

        .job-description p {
          margin-bottom: 1em;
        }

        .job-description ul,
        .job-description ol {
          margin-left: 1.5em;
          margin-bottom: 1em;
        }

        .job-description li {
          margin-bottom: 0.5em;
        }

        .job-description a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .job-description strong {
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

// Pre-generate the 200 most recent job pages at build time
export async function getStaticPaths() {
  try {
    const result = await pool.query(
      'SELECT id, slug FROM jobs ORDER BY created_at DESC LIMIT 200'
    );
    
    const paths = result.rows.map(job => ({
      params: {
        id: job.id.toString(),
        slug: job.slug || 'job'
      }
    }));
    
    return {
      paths,
      fallback: 'blocking' // Generate other pages on-demand
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

export async function getStaticProps({ params }) {
  const { id, slug } = params;

  try {
    const result = await pool.query(
      'SELECT * FROM jobs WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return {
        notFound: true,
        revalidate: 3600 // Recheck in 1 hour
      };
    }

    const job = result.rows[0];

    // Redirect to correct slug if slug doesn't match
    if (slug !== job.slug && job.slug) {
      return {
        redirect: {
          destination: `/jobs/${id}/${job.slug}`,
          permanent: true
        }
      };
    }

    // Fetch similar jobs - OPTIMIZED: Replaced ORDER BY RANDOM() with indexed query
    // Random offset provides variety without the 5+ second performance penalty
    const offset = Math.floor(Math.random() * 20);
    const similarJobsResult = await pool.query(
      `SELECT id, title, company, location, salary, slug, category, posted_date
       FROM jobs
       WHERE category = $1
         AND id != $2
         AND created_at >= NOW() - INTERVAL '60 days'
       ORDER BY created_at DESC
       OFFSET $3
       LIMIT 6`,
      [job.category, id, offset]
    );

    return {
      props: {
        job: JSON.parse(JSON.stringify(job)),
        similarJobs: JSON.parse(JSON.stringify(similarJobsResult.rows))
      },
      revalidate: 21600 // Revalidate every 6 hours (same as homepage)
    };
  } catch (error) {
    console.error('Error fetching job:', error);
    return {
      notFound: true,
      revalidate: 3600
    };
  }
}
