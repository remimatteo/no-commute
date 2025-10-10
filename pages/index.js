import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, Briefcase, ExternalLink, Filter, X, TrendingUp, Zap, Moon, Sun } from 'lucide-react';

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
    // Parse "Oct 8, 2025" format
    const date = new Date(dateString);
    const now = new Date();
    
    // Calculate difference in days
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '0d ago'; // Future date
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

// Helper to convert company name to likely domain
const companyToDomain = (companyName) => {
  if (!companyName) return '';
  
  const name = companyName.toLowerCase().trim();
  
  // Common company domain mappings
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
  
  // Check if we have a mapping
  if (domainMap[name]) {
    return domainMap[name];
  }
  
  // Otherwise, guess domain from company name
  const cleanName = name
    .replace(/[^a-z0-9]/g, '') // Remove special chars
    .replace(/inc$|llc$|ltd$|corp$|company$/g, ''); // Remove company suffixes
  
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
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    category: "All",
    location: "All",
    type: "All"
  });
  const [typedText, setTypedText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  
  const phrases = [
    "Find Your Dream Remote Job",
    "Work From Anywhere",
    "Skip The Commute",
    "Join Remote Teams"
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  // Continuous typing animation with backspace
  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typingSpeed = isDeleting ? 10 : 25; // REALLY FAST
    const pauseBeforeDelete = 500; // Half second
    const pauseBeforeType = 50; // Almost instant

    const timer = setTimeout(() => {
      if (!isDeleting && typingIndex < currentPhrase.length) {
        // Typing forward
        setTypedText(currentPhrase.slice(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      } else if (!isDeleting && typingIndex === currentPhrase.length) {
        // Pause before deleting
        setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
      } else if (isDeleting && typingIndex > 0) {
        // Deleting
        setTypedText(currentPhrase.slice(0, typingIndex - 1));
        setTypingIndex(typingIndex - 1);
      } else if (isDeleting && typingIndex === 0) {
        // Move to next phrase
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
        postedDate: job.posted_date || job.created_at, // FIXED: use posted_date
        description: job.description || '',
        requirements: [],
        applyUrl: job.apply_url || job.url || '#',
        featured: false,
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

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeFilters.category === "All" || job.category === activeFilters.category;
      const matchesLocation = activeFilters.location === "All" || 
                             job.location.toLowerCase().includes(activeFilters.location.toLowerCase());
      const matchesType = activeFilters.type === "All" || job.type === activeFilters.type;
      
      return matchesSearch && matchesCategory && matchesLocation && matchesType;
    })
    .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading remote jobs...</p>
        </div>
      </div>
    );
  }

  if (selectedJob) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} transition-colors`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => setSelectedJob(null)}
            className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} mb-6 flex items-center font-semibold text-lg group transition-colors`}
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span className="ml-2">Back to all jobs</span>
          </button>

          <div className="mb-8">
            <h2 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
              {selectedJob.title}
            </h2>
            <p className={`text-xl sm:text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold mb-6`}>{selectedJob.company}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className={`flex items-center ${darkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} p-4 rounded-xl transition-colors`}>
                <MapPin className={`w-5 h-5 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} font-medium`}>Location</p>
                  <p className="font-semibold">{selectedJob.location}</p>
                </div>
              </div>
              <div className={`flex items-center ${darkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} p-4 rounded-xl transition-colors`}>
                <DollarSign className={`w-5 h-5 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} font-medium`}>Salary</p>
                  <p className="font-semibold">{selectedJob.salary}</p>
                </div>
              </div>
              <div className={`flex items-center ${darkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-gray-100'} p-4 rounded-xl transition-colors`}>
                <Clock className={`w-5 h-5 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} font-medium`}>Posted</p>
                  <p className="font-semibold">{formatDate(selectedJob.postedDate)}</p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 sm:p-8 shadow-lg mb-6 border transition-colors`}>
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>About the Role</h3>
              <div 
                className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed prose prose-invert max-w-none`}
                dangerouslySetInnerHTML={{ __html: selectedJob.description }}
              />
            </div>

            {selectedJob.tags.length > 0 && (
              <div className="mb-8">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Skills & Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedJob.tags.map((tag, idx) => (
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

            <a
              href={selectedJob.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl inline-flex items-center justify-center gap-3 text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Apply on Company Website
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} transition-colors`}>
      <header className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} sticky top-0 z-50 border-b backdrop-blur-sm bg-opacity-90 transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'} hover:scale-110 transition-transform`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-xl hover:shadow-lg transition-all font-semibold text-sm sm:text-base">
              Post a Job
            </button>
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
                placeholder="Search by job title, company, or skills..."
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

            {/* EMAIL SIGNUP - TOP POSITION */}
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                </div>
                <button
                  onClick={() => {
                    setActiveFilters({category: "All", location: "All", type: "All"});
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
              { label: "New Today", value: jobs.filter(j => formatDate(j.postedDate) === '0d ago').length }
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
        <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>All Positions</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={`group ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer p-5 sm:p-6 border hover:border-blue-400 hover:scale-[1.02]`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl flex items-center justify-center flex-shrink-0 transition-colors overflow-hidden relative`}>
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${companyToDomain(job.company)}&sz=64`}
                  alt={job.company}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.nextElementSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full items-center justify-center absolute inset-0" style={{ display: 'none' }}>
                  <Briefcase className={`w-7 h-7 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
              </div>

                <div className="flex-1 min-w-0">
                  <span className={`${darkMode ? 'bg-green-900/30 text-green-400 border-green-700' : 'bg-green-100 text-green-700 border-green-200'} text-xs px-3 py-1 rounded-full font-semibold inline-block mb-2 border`}>
                    {job.type}
                  </span>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1 group-hover:text-blue-500 transition-colors truncate`}>
                    {job.title}
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold truncate`}>{job.company}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                    {job.salary}
                  </div>
                  <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    {formatDate(job.postedDate)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.tags.slice(0, 5).map((tag, idx) => (
                  <span
                    key={idx}
                    className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} text-xs px-2 py-1 rounded`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

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
          <h3 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Never Miss a Remote Job
          </h3>
          <p className="text-lg text-blue-100 mb-8">
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
  );
}