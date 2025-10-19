import React from 'react';
import SEO from '../components/SEO';
import Link from 'next/link';

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy - No Commute Jobs"
        description="Learn how No Commute Jobs collects, uses, and protects your data. Read our privacy policy for details on cookies, analytics, and advertising."
      />
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Home
          </Link>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-blue max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to No Commute Jobs ("we," "our," or "us"). We are committed to protecting your privacy and ensuring transparency about how we collect, use, and share your information. This Privacy Policy explains our practices regarding data collection and usage when you visit no-commute-jobs.com.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Email Address:</strong> When you subscribe to our job alerts newsletter</li>
                <li><strong>Contact Information:</strong> When you reach out to us through our contact form</li>
                <li><strong>Job Posting Information:</strong> If you post a job listing on our platform</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">2. Information Collected Automatically</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, and navigation paths</li>
                <li><strong>Device Information:</strong> Browser type, device type, operating system, and IP address</li>
                <li><strong>Cookies:</strong> Small data files stored on your device (see Cookies section below)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">How We Use Your Information</h2>
              <p className="text-gray-700 mb-3">We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Sending weekly job alert emails to subscribers</li>
                <li>Improving our website functionality and user experience</li>
                <li>Analyzing website traffic and user behavior</li>
                <li>Responding to your inquiries and support requests</li>
                <li>Preventing fraud and ensuring website security</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Cookies and Tracking Technologies</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">What Are Cookies?</h3>
              <p className="text-gray-700 mb-3">
                Cookies are small text files placed on your device by websites you visit. They help websites remember your preferences and understand how you use the site.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">Types of Cookies We Use</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website (Google Analytics)</li>
                <li><strong>Advertising Cookies:</strong> Used to display relevant advertisements through Google AdSense</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">Managing Cookies</h3>
              <p className="text-gray-700">
                You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies or delete existing cookies. Please note that disabling cookies may affect your experience on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Google Analytics</h2>
              <p className="text-gray-700">
                We use Google Analytics to analyze website traffic and user behavior. Google Analytics uses cookies to collect information such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2 mb-3">
                <li>How you found our website</li>
                <li>Pages you visited and time spent on each page</li>
                <li>Your geographic location (country/city level)</li>
                <li>Device and browser information</li>
              </ul>
              <p className="text-gray-700">
                Google Analytics data is anonymous and does not personally identify you. You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Analytics Opt-out Browser Add-on</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Google AdSense and Advertising</h2>
              <p className="text-gray-700 mb-3">
                We use Google AdSense to display advertisements on our website. Google and its partners use cookies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-3">
                <li>Serve ads based on your previous visits to our website or other websites</li>
                <li>Measure ad performance and engagement</li>
                <li>Provide personalized advertising based on your interests</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">Google's Advertising Cookies</h3>
              <p className="text-gray-700 mb-3">
                Google uses cookies such as the DoubleClick cookie to enable it and its partners to serve ads based on your visit to our site and/or other sites on the Internet. These cookies help Google:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Remember your preferences and settings</li>
                <li>Determine which ads you have already seen</li>
                <li>Measure the effectiveness of advertising campaigns</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">Opt Out of Personalized Advertising</h3>
              <p className="text-gray-700 mb-2">
                You have options to control personalized advertising:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Visit <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Ads Settings</a> to manage your ad preferences</li>
                <li>Opt out of personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">aboutads.info</a></li>
                <li>Install browser extensions that block tracking cookies</li>
                <li>Adjust your browser's privacy settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Data Sharing and Third Parties</h2>
              <p className="text-gray-700 mb-3">We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Service Providers:</strong> Google Analytics, Google AdSense, email service providers</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
              <p className="text-gray-700 mt-3">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Rights and Choices</h2>
              <p className="text-gray-700 mb-3">You have the following rights regarding your data:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Unsubscribe:</strong> Opt out of marketing emails using the unsubscribe link in our emails</li>
                <li><strong>Cookie Management:</strong> Control cookies through your browser settings</li>
              </ul>
              <p className="text-gray-700 mt-3">
                To exercise these rights, please contact us at <a href="mailto:nocommutejobs@gmail.com" className="text-blue-600 hover:underline">nocommutejobs@gmail.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Children's Privacy</h2>
              <p className="text-gray-700">
                Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">International Users</h2>
              <p className="text-gray-700">
                Our servers are located in the United States. If you are accessing our website from outside the U.S., please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located and our central database is operated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Contact Us</h2>
              <p className="text-gray-700 mb-2">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700">
                  <strong>Email:</strong> <a href="mailto:nocommutejobs@gmail.com" className="text-blue-600 hover:underline">nocommutejobs@gmail.com</a>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Website:</strong> <a href="https://no-commute-jobs.com" className="text-blue-600 hover:underline">no-commute-jobs.com</a>
                </p>
              </div>
            </section>

            <section className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Consent</h2>
              <p className="text-gray-700">
                By using our website, you consent to our Privacy Policy and agree to its terms. If you do not agree with this policy, please do not use our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
