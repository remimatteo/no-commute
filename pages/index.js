import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, Briefcase, ExternalLink, Filter, X, TrendingUp, Zap, Moon, Sun } from 'lucide-react';
import SEO from '../components/SEO';
import { WebsiteSchema, OrganizationSchema } from '../components/schema';
import FAQSchema from '../components/FAQSchema';
import Link from 'next/link';
import { generateJobSlug } from '../lib/slugify';

const categories = [
  "All",
  "Software Development", 
  "Design",
  "Marketing",
  "Sales / Business",
  "Customer Service",
  "Product",
  "Data Analysis",
  "DevOps / Sysadmin",
  "Finance / Legal",
  "Human Resources",
  "Writing",
  "Project Management",
  "QA",
  "Other"
];

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
  
  const domainMap = {
    '1inch': '1inch.io',
    'gitlab': 'gitlab.com',
    'github': 'github.com',
    'stripe': 'stripe.com',
    'shopify': 'shopify.com',
    'amazon': 'amazon.com',
    'google': 'google.com',
    'microsoft': 'microsoft.com',
    'meta': 'meta.com',
    'facebook': 'facebook.com',
    'apple': 'apple.com',
    'netflix': 'netflix.com',
    'spotify': 'spotify.com',
    'airbnb': 'airbnb.com',
    'uber': 'uber.com',
    'lyft': 'lyft.com',
    'coinbase': 'coinbase.com',
    'openai': 'openai.com',
    'anthropic': 'anthropic.com'
  };
  
  if (domainMap[name]) {
    return domainMap[name];
  }
  
  const cleanName = name
    .replace(/[^a-z0-9]/g, '')
    .replace(/inc$|llc$|ltd$|corp$|company$/g, '');
  
  return `${cleanName}.com`;
};

const extractDomain = (url) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    category: "All",
    location: "USA",
    type: "All",
    salaryListed: "All"
  });
  const [typedText, setTypedText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [visibleJobsCount, setVisibleJobsCount] = useState(30);
  
  const phrases = [
    "Find Your Dream Remote Job",
    "Work From Anywhere",
    "Skip The Commute",
    "Join Remote Teams"
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typingSpeed = isDeleting ? 25 : 60;
    const pauseBeforeDelete = 1200;
    const pauseBeforeType = 150;

    const timer = setTimeout(() => {
      if (!isDeleting && typingIndex < currentPhrase.length) {
        setTypedText(currentPhrase.slice(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      } else if (!isDeleting && typingIndex === currentPhrase.length) {
        setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
      } else if (isDeleting && typingIndex > 0) {
        setTypedText(currentPhrase.slice(0, typingIndex - 1));
        setTypingIndex(typingIndex - 1);
      } else if (isDeleting && typingIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex((phraseIndex + 1) % phrases.length);
        setTimeout(() => {}, pauseBeforeType);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typingIndex, isDeleting, phraseIndex]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs');
      const data = await response.json();
      
      const transformedJobs = data.map((job) => ({
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
        requirements: [],
        applyUrl: job.apply_url || job.url || '#',
        featured: job.featured || false,
        company_url: job.company_url || job.url || '',
        source: job.source || 'RemoteOK'
      }));
      
      setJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setEmailSubmitting(true);
    
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbzrHhbwmSwmXrSA96JDYYJGimIk-EhDCbrb7YIIQVM7taCHRUzL9uimrFQDf403sWiS/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      setEmailSubmitted(true);
      setEmail('');
      setTimeout(() => setEmailSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting email:', error);
    } finally {
      setEmailSubmitting(false);
    }
  };

  // Reset visible jobs count when search/filters change
  useEffect(() => {
    setVisibleJobsCount(30);
  }, [searchQuery, activeFilters]);

  // Smart search with operators
  const filteredJobs = jobs
    .filter(job => {
      let matchesSearch = true;

      if (searchQuery.trim()) {
        const query = searchQuery.trim();

        // Check for search operators
        if (query.includes(':')) {
          // Support operators: title:, company:, category:, tag:
          const operatorRegex = /(title|company|category|tag):([^\s]+)/gi;
          let matches = [...query.matchAll(operatorRegex)];

          if (matches.length > 0) {
            matchesSearch = matches.every(match => {
              const [, field, value] = match;
              const lowerValue = value.toLowerCase();

              switch (field.toLowerCase()) {
                case 'title':
                  return job.title.toLowerCase().includes(lowerValue);
                case 'company':
                  return job.company.toLowerCase().includes(lowerValue);
                case 'category':
                  return job.category.toLowerCase().includes(lowerValue);
                case 'tag':
                  return job.tags.some(tag => tag.toLowerCase().includes(lowerValue));
                default:
                  return true;
              }
            });
          } else {
            // No valid operators, fall back to regular search
            matchesSearch = job.title.toLowerCase().includes(query.toLowerCase()) ||
                           job.company.toLowerCase().includes(query.toLowerCase()) ||
                           job.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
          }
        } else if (query.includes('|')) {
          // OR operator: "react | vue | angular"
          const terms = query.split('|').map(t => t.trim().toLowerCase());
          matchesSearch = terms.some(term =>
            job.title.toLowerCase().includes(term) ||
            job.company.toLowerCase().includes(term) ||
            job.tags.some(tag => tag.toLowerCase().includes(term))
          );
        } else if (query.startsWith('-')) {
          // NOT operator: "-junior"
          const excludeTerm = query.substring(1).toLowerCase();
          matchesSearch = !(
            job.title.toLowerCase().includes(excludeTerm) ||
            job.company.toLowerCase().includes(excludeTerm) ||
            job.tags.some(tag => tag.toLowerCase().includes(excludeTerm))
          );
        } else {
          // Regular search
          matchesSearch = job.title.toLowerCase().includes(query.toLowerCase()) ||
                         job.company.toLowerCase().includes(query.toLowerCase()) ||
                         job.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
        }
      }

      const matchesCategory = activeFilters.category === "All" || job.category === activeFilters.category;
      const matchesLocation = activeFilters.location === "All" ||
                             job.location.toLowerCase().includes(activeFilters.location.toLowerCase());
      const matchesType = activeFilters.type === "All" || job.type === activeFilters.type;
      const hasSalary = job.salary && job.salary !== 'Competitive' && job.salary.match(/\d/);
      const matchesSalary = activeFilters.salaryListed === "All" ||
                           (activeFilters.salaryListed === "Yes" && hasSalary) ||
                           (activeFilters.salaryListed === "No" && !hasSalary);

      return matchesSearch && matchesCategory && matchesLocation && matchesType && matchesSalary;
    })
    .sort((a, b) => {
      // Prioritize high-value jobs
      const hasSalaryA = a.salary && a.salary !== 'Competitive' && a.salary.match(/\d/);
      const hasSalaryB = b.salary && b.salary !== 'Competitive' && b.salary.match(/\d/);

      // Extract salary numbers for comparison (rough estimate)
      const getSalaryValue = (salary) => {
        if (!salary || salary === 'Competitive') return 0;
        // Handle formats like "160k-300k" or "$80k - $120k"
        const cleanSalary = salary.toLowerCase().replace(/[$,\s]/g, '');
        const numbers = cleanSalary.match(/(\d+)k?/g);
        if (!numbers) return 0;
        // Parse numbers and convert k to thousands
        const parsed = numbers.map(n => {
          const num = parseInt(n.replace('k', ''));
          return n.includes('k') ? num : num;
        });
        // Take the highest number found (usually max salary)
        return Math.max(...parsed);
      };

      const salaryA = getSalaryValue(a.salary);
      const salaryB = getSalaryValue(b.salary);

      // Priority categories (Software Dev, Product, etc.)
      const topCategories = ['Software Development', 'Product', 'Design', 'DevOps / Sysadmin'];
      const isTopCategoryA = topCategories.includes(a.category);
      const isTopCategoryB = topCategories.includes(b.category);

      // Check if job is USA-based or worldwide (good for US users)
      const locationA = a.location ? a.location.toLowerCase() : '';
      const locationB = b.location ? b.location.toLowerCase() : '';

      const isUSA_A = locationA.includes('usa') ||
                      locationA.includes('united states') ||
                      locationA.includes('us only') ||
                      locationA === 'remote' ||
                      locationA.includes('anywhere') ||
                      locationA.includes('worldwide');

      const isUSA_B = locationB.includes('usa') ||
                      locationB.includes('united states') ||
                      locationB.includes('us only') ||
                      locationB === 'remote' ||
                      locationB.includes('anywhere') ||
                      locationB.includes('worldwide');

      // Exclude jobs that explicitly mention non-USA locations
      const isNonUSA_A = locationA.includes('vietnam') ||
                         locationA.includes('poland') ||
                         locationA.includes('europe only') ||
                         locationA.includes('uk only') ||
                         locationA.includes('asia only') ||
                         (locationA.includes('uk') && !locationA.includes('anywhere')) ||
                         (locationA.includes('germany') && !locationA.includes('anywhere')) ||
                         (locationA.includes('spain') && !locationA.includes('anywhere'));

      const isNonUSA_B = locationB.includes('vietnam') ||
                         locationB.includes('poland') ||
                         locationB.includes('europe only') ||
                         locationB.includes('uk only') ||
                         locationB.includes('asia only') ||
                         (locationB.includes('uk') && !locationB.includes('anywhere')) ||
                         (locationB.includes('germany') && !locationB.includes('anywhere')) ||
                         (locationB.includes('spain') && !locationB.includes('anywhere'));

      // Sort logic:
      // 1. USA/Worldwide jobs first (huge priority), but penalize explicit non-USA locations
      // 2. Top categories with good salaries (100k+)
      // 3. Other jobs with good salaries
      // 4. Top categories without salary info
      // 5. Rest sorted by date
      const usaBoostA = isUSA_A && !isNonUSA_A ? 10000 : 0;
      const usaBoostB = isUSA_B && !isNonUSA_B ? 10000 : 0;
      const scoreA = usaBoostA + (isTopCategoryA ? 1000 : 0) + (salaryA > 100 ? salaryA : 0);
      const scoreB = usaBoostB + (isTopCategoryB ? 1000 : 0) + (salaryB > 100 ? salaryB : 0);

      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }

      // If scores are equal, sort by date
      return new Date(b.postedDate) - new Date(a.postedDate);
    });

  if (loading) {
    return (
      <>
        <SEO />
        <WebsiteSchema />
        <OrganizationSchema />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Loading remote jobs...</p>
          </div>
        </div>
      </>
    );
  }


  return (
    <>
      <SEO
        title={`No Commute Jobs - ${jobs.length}+ Remote Job Opportunities`}
        description={`Find your perfect remote job from ${jobs.length}+ verified listings. Browse remote positions across tech, marketing, design, customer support and more. Updated daily.`}
        canonical="https://no-commute-jobs.com"
        keywords="remote jobs, work from home, remote work, telecommute, remote positions, online jobs, distributed teams, remote developer jobs, remote designer jobs"
      />
      
      <WebsiteSchema />
      <OrganizationSchema />
      <FAQSchema />

      <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} transition-colors`}>
        <header className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} sticky top-0 z-50 border-b backdrop-blur-sm bg-opacity-90 transition-colors`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${darkMode ? 'bg-white' : 'bg-gray-900'}`}>
                <img
                  src="/logo.png"
                  alt="No Commute Logo"
                  className={`w-8 h-8 ${darkMode ? '' : 'invert'}`}
                />
              </div>
              <div>
                <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>No Commute</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
  <Link 
    href="/blog"
    className={`px-4 py-2 rounded-lg font-semibold transition-all ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
  >
    Blog
  </Link>
  <button
    onClick={() => setDarkMode(!darkMode)}
    className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'} hover:scale-110 transition-transform`}
  >
    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  <Link href="/post-job">
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-xl hover:shadow-lg transition-all font-semibold text-sm sm:text-base">
      Post a Job
    </button>
  </Link>
</div>
          </div>
        </header>

        <section className={`${darkMode ? 'bg-black' : 'bg-gray-50'} py-12 sm:py-16 transition-colors`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 min-h-[1.2em]`}>
              {typedText}<span className="animate-pulse">|</span>
            </h2>
            <p className={`text-lg sm:text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
              Work from anywhere. Live everywhere. {jobs.length}+ remote positions from top companies worldwide.
            </p>

            <div className="max-w-3xl mx-auto space-y-4">
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl p-2 flex items-center gap-2 border transition-colors`}>
                <Search className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-3`} />
                <input
                  type="text"
                  placeholder="Search: 'developer' or 'title:engineer' or 'react | vue' or '-junior'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 ${darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} px-4 py-3 outline-none text-lg`}
                />
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>

              {searchQuery && (
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                  💡 Pro tip: Use <code className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} px-2 py-1 rounded`}>title:</code>, <code className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} px-2 py-1 rounded`}>company:</code>, <code className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} px-2 py-1 rounded`}>|</code> for OR, <code className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} px-2 py-1 rounded`}>-</code> to exclude
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className={`${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-2xl p-4 border transition-colors`}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com - Get weekly job alerts"
                    className={`flex-1 px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} border outline-none transition-colors`}
                    disabled={emailSubmitting}
                  />
                  <button 
                    type="submit"
                    disabled={emailSubmitting || emailSubmitted}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap disabled:opacity-50"
                  >
                    {emailSubmitted ? '✓ Subscribed!' : emailSubmitting ? 'Submitting...' : 'Subscribe'}
                  </button>
                </div>
              </form>

              {showFilterMenu && (
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-2xl shadow-xl border transition-colors`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Category</label>
                      <select
                        value={activeFilters.category}
                        onChange={(e) => setActiveFilters({...activeFilters, category: e.target.value})}
                        className={`w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border rounded-xl px-4 py-2 outline-none transition-colors`}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Location</label>
                      <select
                        value={activeFilters.location}
                        onChange={(e) => setActiveFilters({...activeFilters, location: e.target.value})}
                        className={`w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border rounded-xl px-4 py-2 outline-none transition-colors`}
                      >
                        <option value="All">All Locations</option>
                        <option value="Anywhere">Anywhere</option>
                        <option value="Americas">Americas</option>
                        <option value="Europe">Europe</option>
                        <option value="Asia">Asia</option>
                        <option value="Africa">Africa</option>
                        <option value="APAC">APAC</option>
                        <option value="USA">USA</option>
                        <option value="Canada">Canada</option>
                        <option value="UK">UK</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Job Type</label>
                      <select
                        value={activeFilters.type}
                        onChange={(e) => setActiveFilters({...activeFilters, type: e.target.value})}
                        className={`w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border rounded-xl px-4 py-2 outline-none transition-colors`}
                      >
                        <option value="All">All Types</option>
                        <option value="Full Time">Full Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Part Time">Part Time</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Salary Listed</label>
                      <select
                        value={activeFilters.salaryListed}
                        onChange={(e) => setActiveFilters({...activeFilters, salaryListed: e.target.value})}
                        className={`w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border rounded-xl px-4 py-2 outline-none transition-colors`}
                      >
                        <option value="All">All Jobs</option>
                        <option value="Yes">Salary Listed</option>
                        <option value="No">No Salary</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveFilters({category: "All", location: "All", type: "All", salaryListed: "All"});
                      setShowFilterMenu(false);
                    }}
                    className={`mt-4 w-full ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-semibold transition-colors`}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              {[
                { label: "Remote Jobs", value: jobs.length },
                { label: "Companies", value: new Set(jobs.map(j => j.company)).size },
                { label: "Countries", value: "50+" },
                { label: "New This Week", value: jobs.filter(j => {
                  try {
                    const date = new Date(j.postedDate);
                    const now = new Date();
                    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
                    return diffDays >= 0 && diffDays < 7;
                  } catch {
                    return false;
                  }
                }).length }
              ].map((stat, idx) => (
                <div key={idx} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl border transition-colors`}>
                  <div className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {filteredJobs.length > 0 ? `Found ${filteredJobs.length} remote jobs` : 'All Remote Jobs'}
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Updated daily from top remote job boards
          </p>

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
                      // Try Google favicons as fallback
                      if (!e.target.dataset.fallbackAttempted) {
                        e.target.dataset.fallbackAttempted = 'true';
                        e.target.src = `https://www.google.com/s2/favicons?domain=${companyToDomain(job.company)}&sz=64`;
                      } else {
                        // Show icon if both fail
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="w-full h-full items-center justify-center absolute inset-0" style={{ display: 'none' }}>
                    <Briefcase className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                </div>

                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
                  <div className="sm:col-span-4 min-w-0">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-blue-500 transition-colors truncate`}>
                      {job.title}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm truncate`}>{job.company}</p>
                  </div>

                  <div className="sm:col-span-2 min-w-0">
                    <span className={`${darkMode ? 'bg-blue-900/30 text-blue-400 border-blue-700' : 'bg-blue-100 text-blue-700 border-blue-200'} text-xs px-2 py-1 rounded-md font-medium inline-block border`}>
                      {job.category}
                    </span>
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2 text-sm">
                    {job.salary && job.salary !== 'Competitive' && job.salary.match(/\d/) ? (
                      <>
                        <DollarSign className={`w-4 h-4 flex-shrink-0 ${darkMode ? 'text-green-500' : 'text-green-600'}`} />
                        <span className={`${darkMode ? 'text-green-400' : 'text-green-700'} font-semibold truncate`}>{job.salary}</span>
                      </>
                    ) : (
                      <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs italic`}>Salary not listed</span>
                    )}
                  </div>

                  <div className="sm:col-span-3 flex items-center gap-2 text-sm">
                    <MapPin className={`w-4 h-4 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>{job.location}</span>
                  </div>

                  <div className="sm:col-span-1 text-right">
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
              <p className={`${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Try adjusting your search or filters</p>
            </div>
          )}
        </section>

        <section className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} py-16 transition-colors border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-8 text-center`}>
              Browse by Category
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>By Job Title</h4>
                <div className="space-y-2">
                  {['Entry Level', 'Junior Developer', 'Internship', 'Software Engineer', 'Product Manager', 'Designer', 'Marketing Manager', 'Customer Support', 'Data Analyst', 'Sales Representative', 'Content Writer'].map(title => {
                    const count = jobs.filter(j => j.title.toLowerCase().includes(title.toLowerCase())).length;
                    return (
                      <button
                        key={title}
                        onClick={() => setSearchQuery(title)}
                        className={`block w-full text-left px-3 py-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'} transition-colors`}
                      >
                        {title} <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>By Skills</h4>
                <div className="space-y-2">
                  {['React', 'Python', 'JavaScript', 'AWS', 'TypeScript', 'Node.js', 'Figma', 'SQL'].map(skill => {
                    const count = jobs.filter(j =>
                      j.title.toLowerCase().includes(skill.toLowerCase()) ||
                      j.tags.some(t => t.toLowerCase().includes(skill.toLowerCase()))
                    ).length;
                    return (
                      <button
                        key={skill}
                        onClick={() => setSearchQuery(skill)}
                        className={`block w-full text-left px-3 py-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'} transition-colors`}
                      >
                        {skill} <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className={`${darkMode ? 'bg-blue-900' : 'bg-blue-600'} py-16 transition-colors`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="mb-8">
              <p className="text-2xl sm:text-3xl text-white mb-6 leading-relaxed" style={{ fontFamily: "'Caveat', cursive", fontWeight: 600, transform: 'rotate(-1deg)' }}>
                "Started this after watching my girlfriend turn down jobs because they weren't remote. It hit me - why should location matter when the work is digital? So I built this board. Still growing it, still learning. If it helps even one person find their perfect remote gig, it's worth it."
              </p>
              <p className="text-blue-200 text-lg" style={{ fontFamily: "'Caveat', cursive", fontWeight: 500 }}>
                — Remi, building this nights & weekends
              </p>
            </div>

            <div className={`${darkMode ? 'bg-blue-800/50' : 'bg-blue-700'} rounded-2xl p-8`}>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
                Never Miss a Remote Job
              </h3>
              <p className="text-lg text-blue-100 mb-6">
                Get fresh remote opportunities delivered to your inbox weekly
              </p>
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 outline-none shadow-lg"
                  disabled={emailSubmitting}
                />
                <button
                  type="submit"
                  disabled={emailSubmitting || emailSubmitted}
                  className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg disabled:opacity-50"
                >
                  {emailSubmitted ? '✓ Subscribed!' : emailSubmitting ? 'Submitting...' : 'Subscribe'}
                </button>
              </form>
              <p className="text-blue-200 text-sm mt-4">
                Join 10,000+ remote workers. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>

        <section className={`${darkMode ? 'bg-gray-900' : 'bg-white'} py-16 transition-colors border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-8 text-center`}>
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              {[
                {
                  q: "Are all jobs on No Commute Jobs completely remote?",
                  a: "Yes! Every job listed is 100% remote. We only list positions that allow you to work from anywhere."
                },
                {
                  q: "How often are new jobs added?",
                  a: "We update our job listings multiple times per day. New jobs are added as soon as they're posted by companies."
                },
                {
                  q: "Is No Commute Jobs free to use?",
                  a: "Absolutely! No Commute Jobs is 100% free for job seekers. No account or payment needed."
                },
                {
                  q: "How much does it cost to post a job?",
                  a: "Job postings cost $99 for 30 days. Your job goes live immediately and reaches thousands of job seekers."
                },
                {
                  q: "Can I filter jobs by salary?",
                  a: "Yes! Use our 'Salary Listed' filter to show only jobs with disclosed salary ranges."
                }
              ].map((faq, idx) => (
                <details key={idx} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4 transition-colors`}>
                  <summary className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} cursor-pointer`}>
                    {faq.q}
                  </summary>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-3`}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <footer className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t transition-colors`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Company</h4>
                <ul className={`space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Resources</h4>
                <ul className={`space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Remote Guide</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Salary Data</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Companies</a></li>
                </ul>
              </div>
              <div>
                <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Support</h4>
                <ul className={`space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Legal</h4>
                <ul className={`space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-colors">Cookies</a></li>
                </ul>
              </div>
            </div>
            <div className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} pt-8 text-center transition-colors`}>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                © 2025 No Commute. Work from anywhere, live everywhere.
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Job listings sourced from RemoteOK and Remotive
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}