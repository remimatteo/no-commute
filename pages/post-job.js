import React, { useState } from 'react';
import { Briefcase, DollarSign, Zap, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import SEO from '../components/SEO';

export default function PostJob() {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    companyUrl: '',
    location: '',
    jobType: 'Full-time',
    category: 'Software Development',
    description: '',
    applyUrl: '',
    salary: '',
    tags: '',
    email: '',
    companyLogo: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        alert('Error: ' + error);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (stripeError) {
        alert('Payment error: ' + stripeError.message);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const categories = [
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

  return (
    <>
      <SEO
        title="Post a Remote Job - No Commute Jobs"
        description="Post your remote job listing and reach thousands of talented remote workers. Get started for just $99."
        canonical="https://no-commute-jobs.com/post-job"
      />

      <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} transition-colors`}>
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

            <Link href="/">
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'} transition-all`}>
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
              </button>
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-12">
            <h1 className={`text-4xl sm:text-5xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Post a Remote Job
            </h1>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Reach thousands of talented remote workers worldwide
            </p>
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-2xl">
              <DollarSign className="w-6 h-6" />
              Only $99
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-2xl border transition-colors`}>
              <Zap className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                Instant Publishing
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your job goes live immediately after payment
              </p>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-2xl border transition-colors`}>
              <CheckCircle className="w-10 h-10 text-green-500 mb-4" />
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                30 Days Live
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your listing stays active for 30 days
              </p>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-2xl border transition-colors`}>
              <Briefcase className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                Quality Candidates
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Access to 10,000+ active remote job seekers
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border p-8 transition-colors`}>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Job Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Job Title *
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Full-Stack Developer"
                  required
                  className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border outline-none focus:border-blue-500 transition-colors`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your Company"
                    required
                    className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border outline-none focus:border-blue-500 transition-colors`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Company Website
                  </label>
                  <input
                    type="url"
                    name="companyUrl"
                    value={formData.companyUrl}
                    onChange={handleInputChange}
                    placeholder="https://yourcompany.com"
                    className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border outline-none focus:border-blue-500 transition-colors`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border outline-none focus:border-blue-500 transition-colors`}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Job Type *
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border outline-none focus:border-blue-500 transition-colors`}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Worldwide, US Only, Europe"
                    required
                    className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border outline-none focus:border-blue-500 transition-colors`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Salary Range
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g. $80k - $120k"
                    className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border outline-none focus:border-blue-500 transition-colors`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the role, responsibilities, requirements, and benefits..."
                  required
                  rows={8}
                  className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border outline-none focus:border-blue-500 transition-colors`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g. React, Node.js, TypeScript"
                  className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border outline-none focus:border-blue-500 transition-colors`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Application URL *
                </label>
                <input
                  type="url"
                  name="applyUrl"
                  value={formData.applyUrl}
                  onChange={handleInputChange}
                  placeholder="https://yourcompany.com/careers/apply"
                  required
                  className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border outline-none focus:border-blue-500 transition-colors`}
                />
                <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm mt-2`}>
                  Where should candidates apply? This can be an email (mailto:) or a URL
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Your Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                  className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border outline-none focus:border-blue-500 transition-colors`}
                />
                <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm mt-2`}>
                  We'll send your receipt and job posting confirmation here
                </p>
              </div>

              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-6 rounded-lg`}>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                  Order Summary
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Remote Job Listing (30 days)</span>
                    <span className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>$99.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-600">
                    <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>Total</span>
                    <span className="text-blue-500">$99.00</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <img src="https://cdn.brandfolder.io/KGT2DTA4/at/8vbr8k4mr5xjwk4hxq4t9vs/Stripe_wordmark_-_blurple.svg" alt="Stripe" className="h-5" />
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium`}>
                    Secure payment powered by Stripe
                  </p>
                </div>
              </div>
            </div>
          </form>
        </main>

        <footer className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t transition-colors mt-12`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 No Commute. Work from anywhere, live everywhere.
            </p>
          </div>
        </footer>
      </div>

      <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
    </>
  );
}
