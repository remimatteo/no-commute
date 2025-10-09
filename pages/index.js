import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Clock, Briefcase, ExternalLink, Filter, X, TrendingUp, Zap } from 'lucide-react';

const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Remote",
    location: "Worldwide",
    salary: "$120k - $160k",
    type: "Full-time",
    category: "Engineering",
    tags: ["React", "TypeScript", "Next.js"],
    postedDate: "2 days ago",
    description: "We're looking for an experienced Frontend Developer to join our fully remote team. You'll work on building scalable web applications using React and TypeScript.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Remote work experience", "Strong communication skills"],
    applyUrl: "https://techcorp.com/careers",
    featured: true
  },
  {
    id: 2,
    title: "Product Designer",
    company: "DesignFlow",
    location: "US & Canada",
    salary: "$90k - $130k",
    type: "Full-time",
    category: "Design",
    tags: ["Figma", "UI/UX", "Prototyping"],
    postedDate: "1 week ago",
    description: "Join our design team to create beautiful, intuitive interfaces for our SaaS product. Fully remote position with flexible hours.",
    requirements: ["3+ years product design", "Figma expert", "Portfolio required", "User research experience"],
    applyUrl: "https://designflow.com/jobs",
    featured: false
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "CloudScale",
    location: "Remote - Europe",
    salary: "$100k - $140k",
    type: "Full-time",
    category: "Engineering",
    tags: ["AWS", "Kubernetes", "Docker"],
    postedDate: "3 days ago",
    description: "Help us build and maintain cloud infrastructure for high-traffic applications. Work with cutting-edge DevOps tools.",
    requirements: ["AWS certification", "Kubernetes experience", "CI/CD pipelines", "Infrastructure as Code"],
    applyUrl: "https://cloudscale.io/careers",
    featured: true
  },
  {
    id: 4,
    title: "Content Marketing Manager",
    company: "GrowthLabs",
    location: "Anywhere",
    salary: "$70k - $95k",
    type: "Full-time",
    category: "Marketing",
    tags: ["SEO", "Content Strategy", "Analytics"],
    postedDate: "5 days ago",
    description: "Drive our content strategy and SEO efforts. Create engaging content that converts. 100% remote culture.",
    requirements: ["SEO expertise", "Content strategy", "3+ years experience", "Data-driven mindset"],
    applyUrl: "https://growthlabs.com/careers",
    featured: false
  },
  {
    id: 5,
    title: "Backend Engineer",
    company: "DataStream",
    location: "Remote - Worldwide",
    salary: "$110k - $150k",
    type: "Full-time",
    category: "Engineering",
    tags: ["Node.js", "PostgreSQL", "GraphQL"],
    postedDate: "1 day ago",
    description: "Build robust APIs and backend services for our data platform. Work with a global team of talented engineers.",
    requirements: ["Node.js expert", "Database design", "Microservices", "API development"],
    applyUrl: "https://datastream.dev/jobs",
    featured: true
  },
  {
    id: 6,
    title: "Customer Success Manager",
    company: "SupportHub",
    location: "Remote - Americas",
    salary: "$65k - $85k",
    type: "Full-time",
    category: "Customer Success",
    tags: ["SaaS", "Customer Success", "Support"],
    postedDate: "4 days ago",
    description: "Help our customers succeed with our platform. Build relationships and drive retention.",
    requirements: ["SaaS experience", "Customer-focused", "Excellent communication", "Problem-solving skills"],
    applyUrl: "https://supporthub.io/careers",
    featured: false
  },
  {
    id: 7,
    title: "Full Stack Engineer",
    company: "InnovateTech",
    location: "Worldwide",
    salary: "$130k - $170k",
    type: "Full-time",
    category: "Engineering",
    tags: ["React", "Python", "FastAPI"],
    postedDate: "1 day ago",
    description: "Build end-to-end features for our platform. Work across the entire stack from database to UI.",
    requirements: ["Full-stack experience", "Python & JavaScript", "Database design", "System architecture"],
    applyUrl: "https://innovatetech.io/careers",
    featured: true
  },
  {
    id: 8,
    title: "Social Media Manager",
    company: "BrandBuilders",
    location: "US Remote",
    salary: "$60k - $80k",
    type: "Full-time",
    category: "Marketing",
    tags: ["Social Media", "Content Creation", "Brand"],
    postedDate: "6 days ago",
    description: "Create and execute social media strategies across all platforms. Drive engagement and build our brand presence.",
    requirements: ["Social media expertise", "Content creation", "Analytics skills", "2+ years experience"],
    applyUrl: "https://brandbuilders.co/jobs",
    featured: false
  },
  {
    id: 9,
    title: "Senior Product Manager",
    company: "ProductFlow",
    location: "Remote - Global",
    salary: "$140k - $180k",
    type: "Full-time",
    category: "Product",
    tags: ["Product Strategy", "Roadmap", "Analytics"],
    postedDate: "2 days ago",
    description: "Lead product strategy and execution for our core platform. Work with engineering and design to ship features.",
    requirements: ["5+ years PM experience", "Technical background", "Data-driven", "Leadership skills"],
    applyUrl: "https://productflow.com/careers/pm",
    featured: true
  },
  {
    id: 10,
    title: "iOS Developer",
    company: "MobileFirst",
    location: "Anywhere",
    salary: "$110k - $145k",
    type: "Full-time",
    category: "Engineering",
    tags: ["Swift", "iOS", "Mobile"],
    postedDate: "3 days ago",
    description: "Build beautiful iOS apps that millions use. Work with SwiftUI and modern iOS technologies.",
    requirements: ["Swift expertise", "iOS SDK", "App Store experience", "Clean architecture"],
    applyUrl: "https://mobilefirst.dev/careers",
    featured: false
  },
  {
    id: 11,
    title: "Data Analyst",
    company: "DataInsights",
    location: "Remote - Europe",
    salary: "$75k - $100k",
    type: "Full-time",
    category: "Data",
    tags: ["SQL", "Python", "Tableau"],
    postedDate: "1 week ago",
    description: "Turn data into actionable insights. Build dashboards and help drive business decisions with data.",
    requirements: ["SQL proficiency", "Data visualization", "Python/R", "Business acumen"],
    applyUrl: "https://datainsights.io/jobs",
    featured: false
  },
  {
    id: 12,
    title: "Sales Development Rep",
    company: "SalesForce Pro",
    location: "US & Canada",
    salary: "$55k - $75k + Commission",
    type: "Full-time",
    category: "Sales",
    tags: ["Sales", "B2B", "Outreach"],
    postedDate: "4 days ago",
    description: "Generate qualified leads and book meetings for our sales team. Great training and clear progression path.",
    requirements: ["1+ year sales experience", "B2B background preferred", "Self-motivated", "Great communication"],
    applyUrl: "https://salesforcepro.com/careers",
    featured: false
  },
  {
    id: 13,
    title: "UI/UX Designer",
    company: "PixelPerfect",
    location: "Worldwide",
    salary: "$85k - $115k",
    type: "Full-time",
    category: "Design",
    tags: ["UI Design", "Figma", "Design Systems"],
    postedDate: "2 days ago",
    description: "Design intuitive interfaces and build design systems. Work on multiple products with creative freedom.",
    requirements: ["3+ years UI/UX", "Figma mastery", "Design systems", "Strong portfolio"],
    applyUrl: "https://pixelperfect.design/jobs",
    featured: true
  },
  {
    id: 14,
    title: "Machine Learning Engineer",
    company: "AI Innovations",
    location: "Remote - Global",
    salary: "$150k - $200k",
    type: "Full-time",
    category: "Engineering",
    tags: ["Python", "ML", "TensorFlow"],
    postedDate: "1 day ago",
    description: "Build and deploy ML models at scale. Work on cutting-edge AI problems with massive datasets.",
    requirements: ["ML/AI expertise", "Python proficiency", "Deep learning", "Research background"],
    applyUrl: "https://aiinnovations.ai/careers",
    featured: true
  },
  {
    id: 15,
    title: "QA Engineer",
    company: "QualityFirst",
    location: "Remote - Americas",
    salary: "$70k - $95k",
    type: "Full-time",
    category: "Engineering",
    tags: ["Testing", "Automation", "CI/CD"],
    postedDate: "5 days ago",
    description: "Ensure our software meets the highest quality standards. Build test automation and work with developers.",
    requirements: ["QA experience", "Test automation", "CI/CD knowledge", "Detail-oriented"],
    applyUrl: "https://qualityfirst.io/jobs",
    featured: false
  },
  {
    id: 16,
    title: "Technical Writer",
    company: "DocuMasters",
    location: "Anywhere",
    salary: "$65k - $90k",
    type: "Full-time",
    category: "Content",
    tags: ["Documentation", "Technical Writing", "API"],
    postedDate: "1 week ago",
    description: "Write clear, comprehensive documentation for developers. Create tutorials, API docs, and guides.",
    requirements: ["Technical writing", "Developer docs", "Clear communication", "Tech background"],
    applyUrl: "https://documasters.com/careers",
    featured: false
  },
  {
    id: 17,
    title: "Security Engineer",
    company: "SecureStack",
    location: "Worldwide",
    salary: "$130k - $170k",
    type: "Full-time",
    category: "Engineering",
    tags: ["Security", "Penetration Testing", "DevSecOps"],
    postedDate: "3 days ago",
    description: "Protect our infrastructure and applications. Conduct security audits and implement best practices.",
    requirements: ["Security expertise", "Penetration testing", "Cloud security", "Certifications preferred"],
    applyUrl: "https://securestack.io/jobs",
    featured: true
  },
  {
    id: 18,
    title: "Account Executive",
    company: "SaaSales Co",
    location: "US Remote",
    salary: "$80k - $120k + Commission",
    type: "Full-time",
    category: "Sales",
    tags: ["Enterprise Sales", "SaaS", "B2B"],
    postedDate: "2 days ago",
    description: "Close enterprise deals and manage customer relationships. Work with Fortune 500 companies.",
    requirements: ["Enterprise sales", "SaaS experience", "Quota attainment", "Strong closer"],
    applyUrl: "https://saasales.co/careers",
    featured: false
  }
];

const categories = ["All", "Engineering", "Design", "Marketing", "Sales", "Product", "Data", "Customer Success", "Content"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: "All",
    location: "",
    jobType: ""
  });

  const filteredJobs = mockJobs.filter(job => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      job.title.toLowerCase().includes(searchLower) ||
      job.company.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      job.category.toLowerCase().includes(searchLower);
    
    const matchesCategory = activeFilters.category === "All" || job.category === activeFilters.category;
    const matchesLocation = activeFilters.location === "" || job.location.toLowerCase().includes(activeFilters.location.toLowerCase());
    const matchesJobType = activeFilters.jobType === "" || job.type === activeFilters.jobType;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesJobType;
  });

  const featuredJobs = filteredJobs.filter(job => job.featured);
  const regularJobs = filteredJobs.filter(job => !job.featured);

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
      <header className={`${darkMode ? 'bg-gray-800/95' : 'bg-white/80'} backdrop-blur-lg border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0 z-50 shadow-sm transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-xl relative">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                  <line x1="6" y1="2" x2="6" y2="4"></line>
                  <line x1="10" y1="2" x2="10" y2="4"></line>
                  <line x1="14" y1="2" x2="14" y2="4"></line>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  No Commute
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} hidden sm:block`}>Work from anywhere</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold text-sm sm:text-base">
                Post a Job
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <div className={`inline-flex items-center ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'} px-4 py-2 rounded-full text-sm font-medium mb-4`}>
            <TrendingUp className="w-4 h-4 mr-2" />
            {mockJobs.length}+ active remote positions
          </div>
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 leading-tight`}>
            Work From Anywhere<br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              No Commute Required
            </span>
          </h2>
          <p className={`text-lg sm:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Find verified remote positions from top companies. Say goodbye to traffic, hello to freedom.
          </p>
        </div>

        <div className="mb-8 sm:mb-12">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl p-3 sm:p-4 border transition-colors`}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search jobs, companies, skills, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3.5 text-base rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                />
              </div>

              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} rounded-xl transition font-medium`}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
                {(activeFilters.category !== "All" || activeFilters.location || activeFilters.jobType) && (
                  <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {[activeFilters.category !== "All", activeFilters.location, activeFilters.jobType].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {showFilterMenu && (
              <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} grid grid-cols-1 sm:grid-cols-3 gap-3`}>
                <select
                  value={activeFilters.category}
                  onChange={(e) => setActiveFilters({...activeFilters, category: e.target.value})}
                  className={`px-4 py-2.5 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Location (e.g., US, Europe)"
                  value={activeFilters.location}
                  onChange={(e) => setActiveFilters({...activeFilters, location: e.target.value})}
                  className={`px-4 py-2.5 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />

                <select
                  value={activeFilters.jobType}
                  onChange={(e) => setActiveFilters({...activeFilters, jobType: e.target.value})}
                  className={`px-4 py-2.5 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            )}
          </div>

          {(activeFilters.category !== "All" || activeFilters.location || activeFilters.jobType) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeFilters.category !== "All" && (
                <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  {activeFilters.category}
                  <button onClick={() => setActiveFilters({...activeFilters, category: "All"})}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {activeFilters.location && (
                <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  {activeFilters.location}
                  <button onClick={() => setActiveFilters({...activeFilters, location: ""})}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {activeFilters.jobType && (
                <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  {activeFilters.jobType}
                  <button onClick={() => setActiveFilters({...activeFilters, jobType: ""})}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              <button
                onClick={() => setActiveFilters({category: "All", location: "", jobType: ""})}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {!selectedJob ? (
          <div className="space-y-8">
            {featuredJobs.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Featured Positions</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
                  {featuredJobs.map(job => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`group ${darkMode ? 'bg-gray-800 border-blue-900' : 'bg-gradient-to-br from-white to-blue-50 border-blue-200'} rounded-2xl shadow-md hover:shadow-2xl transition-all cursor-pointer p-5 sm:p-6 border-2 hover:border-blue-400 hover:scale-[1.02]`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Featured
                            </span>
                            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                              {job.type}
                            </span>
                          </div>
                          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1 group-hover:text-blue-600 transition`}>
                            {job.title}
                          </h3>
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>{job.company}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          {job.location}
                        </div>
                        <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                          <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                          {job.salary}
                        </div>
                        <div className={`flex items-center ${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm`}>
                          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                          {job.postedDate}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.tags.map(tag => (
                          <span
                            key={tag}
                            className={`${darkMode ? 'bg-gray-700 text-blue-300 border-blue-800' : 'bg-white text-blue-700 border-blue-200'} text-xs px-3 py-1.5 rounded-full font-medium border`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {regularJobs.length > 0 && (
              <div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>All Positions</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {regularJobs.map(job => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`group ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer p-5 sm:p-6 border hover:border-blue-300 hover:scale-[1.02]`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold inline-block mb-2">
                            {job.type}
                          </span>
                          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1 group-hover:text-blue-600 transition`}>
                            {job.title}
                          </h3>
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold`}>{job.company}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          {job.location}
                        </div>
                        <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                          <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                          {job.salary}
                        </div>
                        <div className={`flex items-center ${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm`}>
                          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                          {job.postedDate}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.tags.map(tag => (
                          <span
                            key={tag}
                            className={`${darkMode ? 'bg-gray-700 text-blue-300' : 'bg-blue-50 text-blue-700'} text-xs px-3 py-1.5 rounded-full font-medium`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl p-6 sm:p-10 border transition-colors`}>
            <button
              onClick={() => setSelectedJob(null)}
              className="text-blue-600 hover:text-blue-800 mb-6 flex items-center font-semibold text-lg group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span className="ml-2">Back to all jobs</span>
            </button>

            {selectedJob.featured && (
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold mb-4">
                <Zap className="w-4 h-4" />
                Featured Position
              </div>
            )}

            <div className="mb-8">
              <h2 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                {selectedJob.title}
              </h2>
              <p className={`text-xl sm:text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold mb-6`}>{selectedJob.company}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className={`flex items-center ${darkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-700 bg-gray-50'} p-4 rounded-xl`}>
                  <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Location</p>
                    <p className="font-semibold">{selectedJob.location}</p>
                  </div>
                </div>
                <div className={`flex items-center ${darkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-700 bg-gray-50'} p-4 rounded-xl`}>
                  <DollarSign className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Salary</p>
                    <p className="font-semibold">{selectedJob.salary}</p>
                  </div>
                </div>
                <div className={`flex items-center ${darkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-700 bg-gray-50'} p-4 rounded-xl`}>
                  <Clock className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Posted</p>
                    <p className="font-semibold">{selectedJob.postedDate}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {selectedJob.tags.map(tag => (
                  <span
                    key={tag}
                    className={`${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'} px-4 py-2 rounded-full font-semibold`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-8 mb-10">
              <div>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>About the Role</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg leading-relaxed`}>{selectedJob.description}</p>
              </div>

              <div>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>What We're Looking For</h3>
                <ul className="space-y-3">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx} className={`flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg`}>
                      <span className="text-blue-600 mr-3 mt-1">✓</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 sm:p-8 rounded-2xl border-2 border-blue-200">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Ready to Apply?</h3>
              <p className="text-gray-700 mb-6">Click below to apply directly on the company's website. Good luck!</p>
              <a
                href={selectedJob.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all text-lg font-bold w-full sm:w-auto hover:scale-105"
              >
                Apply on Company Website
                <ExternalLink className="ml-3 w-6 h-6" />
              </a>
            </div>
          </div>
        )}

        {filteredJobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-lg text-gray-600 mb-6">Try adjusting your search or filters</p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilters({category: "All", location: "", jobType: ""});
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Stay Updated
          </h3>
          <p className="text-blue-50 text-lg mb-6">
            Get notified when we launch new features and improvements
          </p>
          <form 
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.email.value;
              
              if (email) {
                fetch('https://script.google.com/macros/s/AKfycbzrHhbwmSwmXrSA96JDYYJGimIk-EhDCbrb7YIIQVM7taCHRUzL9uimrFQDf403sWiS/exec', {
                  method: 'POST',
                  mode: 'no-cors',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: email })
                });
                
                e.target.email.value = '';
                alert('Thanks for subscribing! We will keep you updated on new features.');
              }
            }}
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-white/20"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105"
            >
              Notify Me
            </button>
          </form>
        </div>
      </div>

      <footer className="bg-white mt-0 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-xl">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                    <line x1="6" y1="2" x2="6" y2="4"></line>
                    <line x1="10" y1="2" x2="10" y2="4"></line>
                    <line x1="14" y1="2" x2="14" y2="4"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  No Commute
                </h3>
              </div>
              <p className="text-gray-600">
                Connecting talented professionals with amazing remote opportunities worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-3">For Job Seekers</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Remote Work Tips</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Career Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-3">For Employers</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition">Post a Job</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-600">
              © 2025 No Commute. Work from anywhere, live everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}