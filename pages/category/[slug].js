import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, DollarSign, Briefcase, Moon, Sun, Menu, X } from 'lucide-react';
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
    return 'Recently';
  }
};

const companyToDomain = (companyName) => {
  if (!companyName) return '';
  const name = companyName.toLowerCase().trim();
  const cleanName = name.replace(/[^a-z0-9]/g, '').replace(/inc$|llc$|ltd$|corp$|company$/g, '');
  return `${cleanName}.com`;
};

const categoryConfig = {
  'software-development': {
    name: 'Software Development',
    displayName: 'Software Development',
    description: 'Find remote software development jobs. Browse 800+ verified remote developer positions including frontend, backend, full-stack, and mobile development roles.',
    keywords: 'remote software developer jobs, remote programming jobs, work from home developer, remote engineer positions',
    emoji: '💻',
    avgSalary: '$120k',
    topSkills: ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS'],
    about: 'Remote software development is one of the fastest-growing job categories. Companies worldwide are hiring talented developers to work on web applications, mobile apps, cloud infrastructure, and more - all from the comfort of home.'
  },
  'design': {
    name: 'Design',
    displayName: 'Design',
    description: 'Discover remote design jobs. Find 300+ verified remote positions for UI/UX designers, graphic designers, product designers, and more.',
    keywords: 'remote design jobs, ux designer remote, ui designer work from home, remote product design',
    emoji: '🎨',
    avgSalary: '$95k',
    topSkills: ['Figma', 'Adobe Creative Suite', 'UI/UX', 'Prototyping', 'User Research'],
    about: 'Remote design roles span UI/UX design, product design, graphic design, and brand design. With modern collaboration tools, designers can create beautiful products from anywhere in the world.'
  },
  'marketing': {
    name: 'Marketing',
    displayName: 'Marketing',
    description: 'Explore remote marketing jobs. Browse 400+ verified positions in digital marketing, content marketing, SEO, social media, and growth marketing.',
    keywords: 'remote marketing jobs, digital marketing remote, work from home marketing, remote growth marketing',
    emoji: '📈',
    avgSalary: '$85k',
    topSkills: ['SEO', 'Content Marketing', 'Social Media', 'Analytics', 'Copywriting'],
    about: 'Remote marketing professionals drive growth for companies worldwide. From content creation to performance marketing, these roles offer the flexibility to work from anywhere while making an impact.'
  },
  'sales': {
    name: 'Sales / Business',
    displayName: 'Sales & Business Development',
    description: 'Find remote sales jobs. Discover 250+ verified remote positions in sales, business development, account management, and customer success.',
    keywords: 'remote sales jobs, business development remote, account executive work from home',
    emoji: '💼',
    avgSalary: '$90k + commission',
    topSkills: ['Salesforce', 'Cold Outreach', 'Negotiation', 'CRM', 'Account Management'],
    about: 'Remote sales roles offer unlimited earning potential through commission structures. Build relationships with clients globally while working from your home office.'
  },
  'customer-service': {
    name: 'Customer Service',
    displayName: 'Customer Service & Support',
    description: 'Browse remote customer service jobs. Find 300+ verified remote support positions with flexible schedules and competitive pay.',
    keywords: 'remote customer service jobs, customer support work from home, remote help desk',
    emoji: '🎧',
    avgSalary: '$55k',
    topSkills: ['Communication', 'Problem Solving', 'CRM Software', 'Empathy', 'Multitasking'],
    about: 'Remote customer service roles are perfect for those who enjoy helping others. Work for global companies from home, often with flexible schedules and advancement opportunities.'
  },
  'product': {
    name: 'Product',
    displayName: 'Product Management',
    description: 'Explore remote product management jobs. Find 200+ verified remote product manager positions at top tech companies.',
    keywords: 'remote product manager jobs, product management remote, work from home pm',
    emoji: '🚀',
    avgSalary: '$130k',
    topSkills: ['Product Strategy', 'Roadmapping', 'User Stories', 'Analytics', 'Agile'],
    about: 'Remote product managers lead product development from concept to launch. Work with distributed teams to build products that users love.'
  },
  'data-analysis': {
    name: 'Data Analysis',
    displayName: 'Data Analysis & Science',
    description: 'Find remote data analyst jobs. Browse 250+ verified remote positions in data analysis, data science, and business intelligence.',
    keywords: 'remote data analyst jobs, data science remote, business intelligence work from home',
    emoji: '📊',
    avgSalary: '$105k',
    topSkills: ['SQL', 'Python', 'Tableau', 'Excel', 'Statistics', 'Machine Learning'],
    about: 'Remote data analysts help companies make data-driven decisions. Work with large datasets, build dashboards, and uncover insights from anywhere.'
  },
  'writing': {
    name: 'Writing',
    displayName: 'Writing & Content Creation',
    description: 'Discover remote writing jobs. Find 200+ verified positions in content writing, copywriting, technical writing, and editing.',
    keywords: 'remote writing jobs, content writer work from home, freelance writing remote',
    emoji: '✍️',
    avgSalary: '$70k',
    topSkills: ['Copywriting', 'SEO Writing', 'Editing', 'Research', 'Content Strategy'],
    about: 'Remote writing roles let you craft compelling content from anywhere. From blog posts to technical documentation, turn your writing skills into a flexible career.'
  }
};

export default function CategoryJobs({ category, initialJobs = [] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [visibleJobsCount, setVisibleJobsCount] = useState(30);

  const config = categoryConfig[category] || categoryConfig['software-development'];

  // Debug: Log jobs on mount
  useEffect(() => {
    console.log(`[CategoryJobs] Category: ${category}`);
    console.log(`[CategoryJobs] Initial jobs count: ${initialJobs.length}`);
    console.log(`[CategoryJobs] Config name: ${config.name}`);
    if (initialJobs.length === 0) {
      console.warn(`[CategoryJobs] WARNING: No jobs received for ${category}!`);
    }
  }, []);

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
        title={`Remote ${config.displayName} Jobs - Work From Home`}
        description={config.description}
        canonical={`https://no-commute-jobs.com/category/${category}`}
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
          </div>
        </header>

        <section className={`${darkMode ? 'bg-black' : 'bg-gray-50'} py-12 sm:py-16 transition-colors`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="text-6xl mb-4">{config.emoji}</div>
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Remote {config.displayName} Jobs
            </h2>
            <p className={`text-lg sm:text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-3xl mx-auto`}>
              {config.description}
            </p>

            <div className="max-w-3xl mx-auto">
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

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {config.avgSalary}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average Salary</div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {filteredJobs.length}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Open Positions</div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  100%
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fully Remote</div>
              </div>
            </div>

            <div className={`mt-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'} rounded-2xl p-6 border max-w-3xl mx-auto`}>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                Top Skills for {config.displayName}
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {config.topSkills.map((skill, index) => (
                  <span key={index} className={`${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'} px-3 py-1 rounded-full text-sm font-medium`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex justify-between items-center mb-6">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredJobs.length} remote {config.displayName.toLowerCase()} jobs
            </p>
            <Link href="/" className="text-blue-500 hover:text-blue-600 font-medium">
              View all categories →
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
                    <div className="sm:col-span-6 min-w-0">
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-blue-500 transition-colors truncate`}>
                        {job.title}
                      </h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm truncate`}>{job.company}</p>
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

                    <div className="sm:col-span-3 flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>{job.location}</span>
                      </div>
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
              About Remote {config.displayName} Jobs
            </h3>
            <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-4 text-lg`}>
              <p>{config.about}</p>
              <Link href="/blog" className="inline-block text-blue-500 hover:text-blue-600 font-semibold">
                Read our career guides →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const categories = [
    'software-development',
    'design',
    'marketing',
    'sales',
    'customer-service',
    'product',
    'data-analysis',
    'writing'
  ];

  return {
    paths: categories.map(category => ({
      params: { slug: category }
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

  const { slug } = params;
  const config = categoryConfig[slug] || categoryConfig['software-development'];

  try {
    // Fetch ALL jobs first, then filter in JavaScript after normalizing
    // This is necessary because the database stores raw category names
    // but we need to match against normalized category names
    const result = await pool.query(`
      SELECT * FROM jobs
      ORDER BY
        COALESCE(featured, false) DESC,
        created_at DESC
      LIMIT 1000
    `);

    console.log(`[getStaticProps] Category: ${slug}, Fetched ${result.rows.length} total jobs from database`);

    // Transform and filter jobs by normalized category
    const transformedJobs = result.rows
      .map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location || 'Remote',
        salary: job.salary || 'Competitive',
        type: job.type || 'Full-time',
        category: normalizeCategory(job.category),
        tags: job.tags || [],
        postedDate: job.posted_date || job.created_at,
        applyUrl: job.apply_url || job.url || '#',
        slug: job.slug,
        originalCategory: job.category // Keep original for debugging
      }))
      .filter(job => job.category === config.name)
      .slice(0, 100); // Limit to 100 after filtering

    console.log(`[getStaticProps] Category: ${slug}, Filtered to ${transformedJobs.length} jobs matching "${config.name}"`);

    await pool.end();

    // Ensure we're returning serializable data (no undefined values)
    const serializedJobs = transformedJobs.map(job => ({
      ...job,
      tags: job.tags || [],
      postedDate: job.postedDate?.toString() || new Date().toISOString(),
      applyUrl: job.applyUrl || '#',
      slug: job.slug || ''
    }));

    return {
      props: {
        category: slug,
        initialJobs: serializedJobs
      },
      revalidate: 300 // Revalidate every 5 minutes (faster updates)
    };
  } catch (error) {
    console.error(`[${slug}] Error in getStaticProps:`, error);

    try {
      await pool.end();
    } catch (e) {
      // Ignore
    }

    return {
      props: {
        category: slug,
        initialJobs: []
      },
      revalidate: 3600
    };
  }
}
