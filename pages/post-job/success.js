import React, { useState } from 'react';
import { CheckCircle, Home, Briefcase } from 'lucide-react';
import Link from 'next/link';
import SEO from '../../components/SEO';

export default function PostJobSuccess() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <>
      <SEO
        title="Payment Successful - No Commute Jobs"
        description="Your job posting has been published successfully!"
      />

      <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} flex items-center justify-center px-4 transition-colors`}>
        <div className={`max-w-2xl w-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border p-12 text-center transition-colors`}>
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Payment Successful!
            </h1>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Your job posting is now live on No Commute Jobs
            </p>
          </div>

          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-6 mb-8 text-left`}>
            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              What happens next?
            </h2>
            <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Your job listing is now visible to thousands of remote job seekers</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>You'll receive a confirmation email with your receipt</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Your listing will remain active for 30 days</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Candidates will apply directly through your application URL</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-lg">
                <Home className="w-5 h-5" />
                Back to Homepage
              </button>
            </Link>
            <Link href="/post-job">
              <button className={`flex items-center justify-center gap-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} px-8 py-3 rounded-xl font-semibold transition-all`}>
                <Briefcase className="w-5 h-5" />
                Post Another Job
              </button>
            </Link>
          </div>

          <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-sm mt-8`}>
            Questions? Contact us at support@no-commute-jobs.com
          </p>
        </div>
      </div>
    </>
  );
}
