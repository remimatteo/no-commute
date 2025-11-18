import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, MapPin, DollarSign, Clock, Briefcase, ExternalLink, Filter, X, TrendingUp, Zap, Moon, Sun, Menu } from 'lucide-react';
import SEO from '../components/SEO';
import { WebsiteSchema, OrganizationSchema } from '../components/schema';
import FAQSchema from '../components/FAQSchema';
import Footer from '../components/Footer';
import AdSenseInFeed from '../components/AdSenseInFeed';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { generateJobSlug} from '../lib/slugify';
import { formatSalary } from '../lib/formatSalary';

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

// Domain mapping for company logos
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

const companyToDomain = (companyName) => {
  if (!companyName) return '';

  const name = companyName.toLowerCase().trim();

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

// Job titles for browsing
const jobTitles = ['Entry Level', 'Junior Developer', 'Internship', 'Software Engineer', 'Product Manager', 'Designer', 'Marketing Manager', 'Customer Support', 'Data Analyst', 'Sales Representative', 'Content Writer'];

// Skills for browsing
const skills = ['React', 'Python', 'JavaScript', 'AWS', 'TypeScript', 'Node.js', 'Figma', 'SQL'];

export default function Home({ initialJobs = [], initialTotalJobs = 0 }) {
  const router = useRouter();

  const [jobs, setJobs] = useState(initialJobs);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(router.query.search || "");
  const [submittedSearch, setSubmittedSearch] = useState(router.query.search || "");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [category, setCategory] = useState(router.query.category || "All");
  const [location, setLocation] = useState(router.query.location || "All");
  const [salaryListed, setSalaryListed] = useState(router.query.salary || "All");
  const [experience, setExperience] = useState(router.query.experience || "All");

  // Handle search submission (button click or Enter key)
  const handleSearchSubmit = useCallback(() => {
    setSubmittedSearch(searchQuery);
  }, [searchQuery]);

  // Handle Enter key in search input
  const handleSearchKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  }, [handleSearchSubmit]);

  // Function to update URL when filters change
  const updateURL = useCallback((filters) => {
    const query = {};
    if (filters.search && filters.search !== "") query.search = filters.search;
    if (filters.category && filters.category !== "All") query.category = filters.category;
    if (filters.location && filters.location !== "All") query.location = filters.location;
    if (filters.salary && filters.salary !== "All") query.salary = filters.salary;
    if (filters.experience && filters.experience !== "All") query.experience = filters.experience;

    router.push({
      pathname: '/',
      query: query
    }, undefined, { shallow: true });
  }, [router]);

  // Memoize filterState to prevent unnecessary re-renders
  const filterState = useMemo(() => ({
    category,
    location,
    salaryListed,
    experience
  }), [category, location, salaryListed, experience]);
  
  const [typedText, setTypedText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
const [visibleJobsCount, setVisibleJobsCount] = useState(30);
const [totalJobs, setTotalJobs] = useState(initialTotalJobs);

  // Update URL when filters change (use submitted search only)
  useEffect(() => {
    updateURL({
      search: submittedSearch,
      category,
      location,
      salary: salaryListed,
      experience
    });
  }, [category, location, salaryListed, experience, submittedSearch, updateURL]);

  // Fetch jobs when filters change (only if not using default filters)
  useEffect(() => {
    // Check if using non-default filters
    const isDefaultFilters = category === "All" &&
                            location === "All" &&
                            salaryListed === "All" &&
                            experience === "All" &&
                            submittedSearch === "";

    // If using default filters and we have initial jobs, skip API call
    if (isDefaultFilters && initialJobs.length > 0) {
      return;
    }

    let isMounted = true;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          category,
          location,
          salaryListed,
          experience,
          search: submittedSearch,
          limit: 100
        });

        const response = await fetch(`/api/jobs?${queryParams}`);
        const data = await response.json();

        if (!isMounted) return;

        // Handle API errors gracefully
        if (!response.ok || !data.jobs) {
          console.error('Failed to fetch jobs:', data.error || data.message || 'Unknown error');
          setJobs([]);
          setTotalJobs(0);
          return;
        }

        const transformedJobs = data.jobs.map((job) => ({
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
          source: job.source || 'Unknown'
        }));

        setJobs(transformedJobs);
        setTotalJobs(data.totalJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [category, location, salaryListed, experience, submittedSearch, initialJobs.length]);

  // Typing animation effect
  useEffect(() => {
    const phrases = [
      "Find Your Dream Remote Job",
      "Work From Anywhere",
      "Skip The Commute",
      "Join Remote Teams"
    ];

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
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setTimeout(() => {}, pauseBeforeType);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typingIndex, isDeleting, phraseIndex]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setEmailSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailSubmitted(true);
        setEmail('');
        setTimeout(() => setEmailSubmitted(false), 5000);
      } else {
        alert(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setEmailSubmitting(false);
    }
  };

  // Reset visible jobs count when search/filters change
  useEffect(() => {
    setVisibleJobsCount(30);
  }, [submittedSearch, category, location, salaryListed, experience]);

  // Smart search with operators - memoized to prevent infinite re-renders
  const filteredJobs = useMemo(() => {
    // Use submittedSearch for filtering, not searchQuery (which updates as user types)
    const searchToUse = submittedSearch.trim();

    return jobs
      .filter(job => {
        let matchesSearch = true;

        if (searchToUse) {
          const query = searchToUse;

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

        const matchesCategory = filterState.category === "All" || job.category === filterState.category;
        const matchesLocation = filterState.location === "All" ||
                               job.location.toLowerCase().includes(filterState.location.toLowerCase());
        const hasSalary = job.salary && job.salary !== 'Competitive' && job.salary.match(/\d/);
        const matchesSalary = filterState.salaryListed === "All" ||
                             (filterState.salaryListed === "Yes" && hasSalary) ||
                             (filterState.salaryListed === "No" && !hasSalary);

        return matchesSearch && matchesCategory && matchesLocation && matchesSalary;
      });
      // IMPORTANT: Don't re-sort here! Jobs are already sorted correctly by the database
      // with US jobs prioritized first, then by date. Client-side re-sorting breaks this.
  }, [jobs, submittedSearch, filterState]);

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
  title="No Commute Jobs - 2000+ Remote Job Opportunities"
  description="Find your perfect remote job from 2000+ verified listings. Browse remote positions across tech, marketing, design, customer support and more. Updated daily."
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
              <img
                src="/logo.png"
                alt="No Commute Logo"
                className="w-10 h-10"
              />
              <div>
                <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>No Commute</h1>
              </div>
            </div>

            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden lg:flex items-center gap-2">
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
              <Link href="/post-job">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all font-semibold">
                  Post a Job
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <Link href="/post-job">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all font-semibold text-sm">
                  Post Job
                </button>
              </Link>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'} hover:scale-110 transition-transform`}
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className={`lg:hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t`}>
              <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-2">
                <Link
                  href="/blog"
                  onClick={() => setShowMobileMenu(false)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Blog
                </Link>
                <Link
                  href="/forum"
                  onClick={() => setShowMobileMenu(false)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Forum
                </Link>
                <Link
                  href="/make-money-online"
                  onClick={() => setShowMobileMenu(false)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Side Hustles
                </Link>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`px-4 py-3 rounded-lg font-semibold text-left transition-all flex items-center gap-3 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
          )}
        </header>

        <section className={`${darkMode ? 'bg-black' : 'bg-gray-50'} py-12 sm:py-16 transition-colors`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 min-h-[1.2em]`}>
              {typedText}<span className="animate-pulse">|</span>
            </h2>
<p className={`text-lg sm:text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
  Work from anywhere. Live everywhere. 2000+ remote positions from top companies worldwide.
</p>

            <div className="max-w-3xl mx-auto space-y-4">
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl p-2 border transition-colors`}>
                <div className="flex items-center gap-2">
                  <Search className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-3 flex-shrink-0`} />
                  <input
                    type="text"
                    placeholder="Search: 'developer' or 'title:engineer' or 'react | vue' or '-junior'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className={`flex-1 ${darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'} px-4 py-3 outline-none text-lg`}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSearchSubmit}
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className={`flex-1 sm:flex-none ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors`}
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                </div>
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
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
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
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
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
                      <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Salary Listed</label>
                      <select
                        value={salaryListed}
                        onChange={(e) => setSalaryListed(e.target.value)}
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
                      setCategory("All");
                      setLocation("All");
                      setSalaryListed("All");
                      setExperience("All");
                      setShowFilterMenu(false);
                    }}
                    className={`mt-4 w-full ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-semibold transition-colors`}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto">
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl border transition-colors`}>
                <div className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>250+</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Companies</div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl border transition-colors`}>
                <div className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>50+</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Countries</div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl border transition-colors`}>
                <div className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{jobs.filter(j => {
                  try {
                    const date = new Date(j.postedDate);
                    const now = new Date();
                    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
                    return diffDays >= 0 && diffDays < 7;
                  } catch {
                    return false;
                  }
                }).length}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>New This Week</div>
              </div>
            </div>
          </div>
        </section>

        {/* Browse by Category Section */}
        <section className={`py-8 sm:py-12 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 sm:mb-8 text-center`}>
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              {[
                { name: 'Software Development', slug: 'software-development', emoji: '💻' },
                { name: 'Design', slug: 'design', emoji: '🎨' },
                { name: 'Marketing', slug: 'marketing', emoji: '📈' },
                { name: 'Sales', slug: 'sales', emoji: '💼' },
                { name: 'Customer Service', slug: 'customer-service', emoji: '🎧' },
                { name: 'Product', slug: 'product', emoji: '🚀' },
                { name: 'Data Analysis', slug: 'data-analysis', emoji: '📊' },
                { name: 'Writing', slug: 'writing', emoji: '✍️' }
              ].map(cat => (
                <Link href={`/category/${cat.slug}`} key={cat.slug}>
                  <div className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-gray-50 border-gray-200 hover:border-blue-400'} border rounded-lg sm:rounded-xl p-3 sm:p-6 hover:shadow-lg transition-all text-center cursor-pointer`}>
                    <div className="text-2xl sm:text-4xl mb-1 sm:mb-3">{cat.emoji}</div>
                    <h3 className={`text-xs sm:text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Browse by Location Section */}
        <section className={`py-6 sm:py-12 ${darkMode ? 'bg-black' : 'bg-gray-50'} transition-colors`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className={`text-xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3 sm:mb-8 text-center`}>
              Browse by Location
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
              {[
                { name: 'USA', slug: 'usa' },
                { name: 'Europe', slug: 'europe' },
                { name: 'Canada', slug: 'canada' },
                { name: 'UK', slug: 'uk' },
                { name: 'Australia', slug: 'australia' },
                { name: 'Asia', slug: 'asia' }
              ].map(loc => (
                <Link href={`/remote-jobs/${loc.slug}`} key={loc.slug}>
                  <div className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-400'} border rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all text-center cursor-pointer`}>
                    <h3 className={`text-sm sm:text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{loc.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
            Latest Remote Jobs
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Updated daily from top remote job boards
          </p>

          <div className="space-y-2">
            {filteredJobs.slice(0, visibleJobsCount).map((job, index) => {
              const slug = job.slug || generateJobSlug(job.title, job.company);
              const shouldShowAd = (index + 1) % 5 === 0 && index >= 4; // Show ad every 5 jobs, starting after the 5th job

              return (
              <React.Fragment key={job.id}>
              <Link
                href={`/jobs/${job.id}/${slug}`}
                className={`group ${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} rounded-lg border transition-all cursor-pointer p-4 flex items-center gap-4 hover:border-blue-400 block`}
              >
                <div className={`w-12 h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative`}>
                  <img
                    src={`https://logo.clearbit.com/${companyToDomain(job.company)}?size=80`}
                    alt={job.company}
                    className="w-full h-full object-cover"
                    loading={index < 30 ? "eager" : "lazy"}
                    width="48"
                    height="48"
                    onError={(e) => {
                      // Fallback to UI Avatars (always works, looks professional)
                      if (!e.target.dataset.fallbackAttempted) {
                        e.target.dataset.fallbackAttempted = 'true';
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&size=80&background=random&color=fff&bold=true`;
                      }
                    }}
                  />
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
                        <span className={`${darkMode ? 'text-green-400' : 'text-green-700'} font-semibold truncate`}>{formatSalary(job.salary)}</span>
                      </>
                    ) : (
                      <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs italic`}>Salary not listed</span>
                    )}
                  </div>

                  <div className="sm:col-span-3 flex items-center gap-2 text-sm">
                    <MapPin className={`w-4 h-4 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>{job.location}</span>
                  </div>

                  <div className="sm:col-span-1 flex items-center justify-end gap-2">
                    <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm whitespace-nowrap`}>
                      {formatDate(job.postedDate)}
                    </span>
                    <ExternalLink className={`w-4 h-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'} group-hover:text-blue-500 transition-colors flex-shrink-0`} />
                  </div>
                </div>
              </Link>

              {shouldShowAd && <AdSenseInFeed />}
              </React.Fragment>
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

        <Footer darkMode={darkMode} />
      </div>
    </>
  );
}

// SSR: Fetch jobs on every request with caching for stability
export async function getStaticProps() {
  const { Pool } = require('pg');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // OPTIMIZED: Fetch recent jobs only (100 instead of 1000)
    // Removed expensive window function for better performance
    const limit = 100;

    // Count total active jobs only
    const countResult = await pool.query(`
      SELECT COUNT(*) as total FROM jobs WHERE status = 'active'
    `);

    const totalJobs = parseInt(countResult.rows[0].total, 10);

    // Optimized query: Prioritize US jobs for US-based audience, sorted by posted_date
    const result = await pool.query(`
      SELECT * FROM jobs
      WHERE status = 'active'
      ORDER BY
        COALESCE(featured, false) DESC,
        CASE
          WHEN location ILIKE '%United States%'
            OR location ILIKE '%USA%'
            OR location ILIKE '%US%'
            OR location ILIKE '%U.S.%'
          THEN 0
          ELSE 1
        END,
        created_at DESC
      LIMIT $1
    `, [limit]);

    // Transform jobs to match the expected format
    const transformedJobs = result.rows.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location || 'Remote',
      salary: job.salary || 'Competitive',
      type: job.type || 'Full-time',
      category: normalizeCategory(job.category),
      tags: job.tags || [],
      postedDate: job.created_at.toISOString(), // Use created_at to show when job was added to our database
      description: job.description || '',
      requirements: [],
      applyUrl: job.apply_url || job.url || '#',
      featured: job.featured || false,
      company_url: job.company_url || job.url || '',
      source: job.source || 'RemoteOK'
    }));

    await pool.end();

    return {
      props: {
        initialJobs: transformedJobs,
        initialTotalJobs: totalJobs
      },
      revalidate: 300 // Rebuild page every 5 minutes
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);

    try {
      await pool.end();
    } catch (e) {
      // Ignore pool end errors
    }

    return {
      props: {
        initialJobs: [],
        initialTotalJobs: 0
      },
      revalidate: 60 // Retry in 1 minute if error
    };
  }
}
