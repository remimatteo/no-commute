import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, DollarSign, Briefcase, ExternalLink, Moon, Sun, Menu, X } from 'lucide-react';
import SEO from '../../components/SEO';
import Link from 'next/link';
import { generateJobSlug } from '../../lib/slugify';
import { formatSalary } from '../../lib/formatSalary';

const normalizeCategory = (cat) => {
  if (!cat) return 'Other';
  const c = cat.toLowerCase();

  if (c.includes('dev') || c.includes('engineer') || c.includes('software') || c.includes('frontend') ||
      c.includes('python') || c.includes('golang') || c.includes('web3') || c.includes('blockchain')) {
    return 'Software Development';
  }
  if (c.includes('design') || c.includes('ui') || c.includes('ux') || c.includes('3d')) {
    return 'Design';
  }
  if (c.includes('marketing') || c.includes('growth')) {
    return 'Marketing';
  }
  if (c.includes('sales') || c.includes('business')) {
    return 'Sales / Business';
  }
  if (c.includes('support') || c.includes('customer') || c.includes('happiness')) {
    return 'Customer Service';
  }
  if (c.includes('hr') || c.includes('human') || c.includes('recruiter')) {
    return 'Human Resources';
  }
  if (c.includes('writer') || c.includes('writing')) {
    return 'Writing';
  }
  if (c.includes('data') || c.includes('analyst')) {
    return 'Data Analysis';
  }
  if (c.includes('devops') || c.includes('sysadmin') || c.includes('system')) {
    return 'DevOps / Sysadmin';
  }
  if (c.includes('finance') || c.includes('financial')) {
    return 'Finance / Legal';
  }
  if (c.includes('product')) {
    return 'Product';
  }
  if (c.includes('project') || c.includes('manager') || c.includes('director')) {
    return 'Project Management';
  }
  if (c.includes('qa')) {
    return 'QA';
  }

  return 'Other';
};

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

const companyToDomain = (companyName) => {
  if (!companyName) return '';
  const name = companyName.toLowerCase().trim();
  const cleanName = name.replace(/[^a-z0-9]/g, '').replace(/inc$|llc$|ltd$|corp$|company$/g, '');
  return `${cleanName}.com`;
};

const locationConfig = {
  usa: {
    name: 'USA',
    fullName: 'United States',
    description: 'Find remote jobs in the USA with flexible work arrangements. Browse 1000+ verified remote positions from top US companies hiring across all states.',
    searchTerm: 'USA',
    keywords: 'remote jobs usa, work from home usa, remote positions united states, us remote work',
    emoji: '🇺🇸',
    benefits: [
      'No commute, work from anywhere in the US',
      'Competitive salaries (avg $95k for tech roles)',
      'Health insurance & 401k benefits',
      'Work across all 50 states'
    ]
  },
  europe: {
    name: 'Europe',
    fullName: 'Europe',
    description: 'Discover remote jobs across Europe. Browse 500+ verified remote positions from European companies with flexible work policies and competitive compensation.',
    searchTerm: 'Europe',
    keywords: 'remote jobs europe, european remote work, remote positions eu, work from home europe',
    emoji: '🇪🇺',
    benefits: [
      'Work from anywhere in Europe',
      'EU-compliant benefits',
      'Competitive European salaries',
      'Flexible timezone arrangements'
    ]
  },
  canada: {
    name: 'Canada',
    fullName: 'Canada',
    description: 'Explore remote jobs in Canada. Find 300+ verified remote positions from Canadian companies offering competitive salaries and excellent benefits.',
    searchTerm: 'Canada',
    keywords: 'remote jobs canada, canadian remote work, work from home canada, remote positions canada',
    emoji: '🇨🇦',
    benefits: [
      'Work from any Canadian province',
      'Canadian healthcare benefits',
      'Competitive CAD salaries',
      'Bilingual opportunities'
    ]
  },
  uk: {
    name: 'UK',
    fullName: 'United Kingdom',
    description: 'Browse remote jobs in the UK. Find 400+ verified remote positions from British companies with flexible work arrangements.',
    searchTerm: 'UK',
    keywords: 'remote jobs uk, british remote work, work from home uk, remote positions united kingdom',
    emoji: '🇬🇧',
    benefits: [
      'Work from anywhere in the UK',
      'NHS-compatible benefits',
      'Competitive GBP salaries',
      'London & regional opportunities'
    ]
  },
  australia: {
    name: 'Australia',
    fullName: 'Australia',
    description: 'Find remote jobs in Australia. Browse 200+ verified remote positions from Australian companies with flexible work policies.',
    searchTerm: 'Australia',
    keywords: 'remote jobs australia, australian remote work, work from home australia, remote positions aus',
    emoji: '🇦🇺',
    benefits: [
      'Work from anywhere in Australia',
      'Superannuation benefits',
      'Competitive AUD salaries',
      'Flexible timezone options'
    ]
  },
  asia: {
    name: 'Asia',
    fullName: 'Asia',
    description: 'Explore remote jobs across Asia. Find 250+ verified remote positions from Asian companies with global reach.',
    searchTerm: 'Asia',
    keywords: 'remote jobs asia, asian remote work, work from home asia, remote positions apac',
    emoji: '🌏',
    benefits: [
      'Work from anywhere in Asia',
      'APAC timezone friendly',
      'Competitive regional salaries',
      'Growing remote work market'
    ]
  }
};

export default function LocationJobs({ location, initialJobs = [], initialTotalJobs = 0 }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [visibleJobsCount, setVisibleJobsCount] = useState(30);

  const config = locationConfig[location] || locationConfig.usa;

  const filteredJobs = useMemo(() => jobs.filter(job => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return job.title.toLowerCase().includes(query) ||
           job.company.toLowerCase().includes(query) ||
           job.tags.some(tag => tag.toLowerCase().includes(query));
  }), [jobs, searchQuery]);

  return (
    <>
      <SEO
        title={`Remote Jobs in ${config.fullName} - 100% Work From Home`}
        description={config.description}
        canonical={`https://no-commute-jobs.com/remote-jobs/${location}`}
        keywords={config.keywords}
      />

      <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} transition-colors`}>
        <header className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} sticky top-0 z-50 border-b backdrop-blur-sm bg-opacity-90 transition-colors`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="No Commute Logo" className="w-10 h-10" />
              <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>No Commute</h1>
            </Link>

            <div className="hidden lg:flex items-center gap-2">
              <Link href="/blog" className={`px-4 py-2 rounded-lg font-semibold transition-all ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}>
                Blog
              </Link>
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'} hover:scale-110 transition-transform`}>
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link href="/post-job">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all font-semibold">
                  Post a Job
                </button>
              </Link>
            </div>

            <div className="lg:hidden flex items-center gap-2">
              <Link href="/post-job">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all font-semibold text-sm">
                  Post Job
                </button>
              </Link>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'} hover:scale-110 transition-transform`}>
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </header>

        <section className={`${darkMode ? 'bg-black' : 'bg-gray-50'} py-12 sm:py-16 transition-colors`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="text-6xl mb-4">{config.emoji}</div>
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Remote Jobs in {config.fullName}
            </h2>
            <p className={`text-lg sm:text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-3xl mx-auto`}>
              {config.description}
            </p>

            <div className="max-w-3xl mx-auto space-y-4">
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl p-2 flex items-center gap-2 border transition-colors`}>
                <Search className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-3`} />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 ${darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} px-4 py-3 outline-none text-lg`}
                />
              </div>
            </div>

            <div className={`mt-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'} rounded-2xl p-6 border transition-colors max-w-3xl mx-auto`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Why Work Remote in {config.name}?
              </h3>
              <ul className={`space-y-2 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {config.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex justify-between items-center mb-6">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredJobs.length} remote jobs in {config.name}
            </p>
            <Link href="/" className={`text-blue-500 hover:text-blue-600 font-medium`}>
              View all locations →
            </Link>
          </div>

          <div className="space-y-2">
            {filteredJobs.slice(0, visibleJobsCount).map(job => {
              const slug = job.slug || generateJobSlug(job.title, job.company);
              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}/${slug}`}
                  className={`group ${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} rounded-lg border transition-all cursor-pointer p-4 flex items-center gap-4 hover:border-blue-400 block`}
                >
                  <div className={`w-12 h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative`}>
                    <img
                      src={`https://logo.clearbit.com/${companyToDomain(job.company)}?size=80`}
                      alt={job.company}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (!e.target.dataset.fallbackAttempted) {
                          e.target.dataset.fallbackAttempted = 'true';
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&size=80&background=random&color=fff&bold=true`;
                        }
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
                    <div className="sm:col-span-5 min-w-0">
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-blue-500 transition-colors truncate`}>
                        {job.title}
                      </h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm truncate`}>{job.company}</p>
                    </div>

                    <div className="sm:col-span-2 min-w-0">
                      <span className={`${darkMode ? 'bg-blue-900/30 text-blue-400 border-blue-700' : 'bg-blue-100 text-blue-700 border-blue-200'} text-xs px-2 py-1 rounded-md font-medium inline-block border`}>
                        {normalizeCategory(job.category)}
                      </span>
                    </div>

                    <div className="sm:col-span-3 flex items-center gap-2 text-sm">
                      {job.salary && job.salary !== 'Competitive' && job.salary.match(/\d/) ? (
                        <>
                          <DollarSign className={`w-4 h-4 flex-shrink-0 ${darkMode ? 'text-green-500' : 'text-green-600'}`} />
                          <span className={`${darkMode ? 'text-green-400' : 'text-green-700'} font-semibold truncate`}>{formatSalary(job.salary)}</span>
                        </>
                      ) : (
                        <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs italic`}>Salary not listed</span>
                      )}
                    </div>

                    <div className="sm:col-span-2 text-right">
                      <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm whitespace-nowrap`}>
                        {formatDate(job.postedDate)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredJobs.length > visibleJobsCount && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleJobsCount(prev => prev + 30)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
              >
                Show 30 More Jobs
              </button>
            </div>
          )}

          {filteredJobs.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`} />
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>No jobs found</h3>
              <p className={`${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Try adjusting your search</p>
            </div>
          )}
        </section>

        <section className={`${darkMode ? 'bg-gray-900' : 'bg-white'} py-16 transition-colors border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              About Remote Work in {config.name}
            </h3>
            <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-4 text-lg`}>
              <p>
                Remote work in {config.fullName} has grown significantly, with thousands of companies now offering flexible work arrangements. Whether you're looking for fully remote positions or hybrid options, the {config.name} job market offers excellent opportunities across all industries.
              </p>
              <p>
                Our platform features verified remote jobs from top companies hiring in {config.name}. All positions are 100% remote, allowing you to work from anywhere while enjoying the benefits and protections specific to {config.fullName}.
              </p>
              <Link href="/blog" className="inline-block text-blue-500 hover:text-blue-600 font-semibold">
                Read our remote work guides →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const locations = ['usa', 'europe', 'canada', 'uk', 'australia', 'asia'];

  return {
    paths: locations.map(location => ({
      params: { location }
    })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { Pool } = require('pg');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  const { location } = params;
  const config = locationConfig[location] || locationConfig.usa;

  try {
    const result = await pool.query(`
      SELECT * FROM jobs
      WHERE location ILIKE $1
      ORDER BY
        COALESCE(featured, false) DESC,
        created_at DESC
      LIMIT 100
    `, [`%${config.searchTerm}%`]);

    const transformedJobs = result.rows.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location || 'Remote',
      salary: job.salary || 'Competitive',
      type: job.type || 'Full-time',
      category: job.category, // Use DB category directly - already normalized
      tags: job.tags || [],
      postedDate: job.posted_date || job.created_at,
      description: job.description || '',
      applyUrl: job.apply_url || job.url || '#',
      featured: job.featured || false,
      slug: job.slug
    }));

    await pool.end();

    return {
      props: {
        location,
        initialJobs: transformedJobs,
        initialTotalJobs: transformedJobs.length
      },
      revalidate: 21600 // Revalidate every 6 hours
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);

    try {
      await pool.end();
    } catch (e) {
      // Ignore
    }

    return {
      props: {
        location,
        initialJobs: [],
        initialTotalJobs: 0
      },
      revalidate: 3600
    };
  }
}
