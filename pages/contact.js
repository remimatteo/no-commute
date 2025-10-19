import React, { useState } from 'react';
import SEO from '../components/SEO';
import Link from 'next/link';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // Using Google Apps Script for form submission
      const response = await fetch('https://script.google.com/macros/s/AKfycbzrHhbwmSwmXrSA96JDYYJGimIk-EhDCbrb7YIIQVM7taCHRUzL9uimrFQDf403sWiS/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          ...formData
        })
      });

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');

      // Reset error message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us - No Commute Jobs"
        description="Get in touch with No Commute Jobs. Have questions, feedback, or need support? We'd love to hear from you."
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Contact Us</h1>
            <p className="text-xl text-blue-100">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
            ← Back to Home
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                    disabled={status === 'submitting'}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                    disabled={status === 'submitting'}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="How can we help?"
                    disabled={status === 'submitting'}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                    disabled={status === 'submitting'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                {status === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-800">Message sent successfully!</p>
                      <p className="text-sm text-green-700 mt-1">We'll get back to you as soon as possible.</p>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800">Oops! Something went wrong.</p>
                      <p className="text-sm text-red-700 mt-1">Please try again or email us directly.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                      <a
                        href="mailto:nocommutejobs@gmail.com"
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        nocommutejobs@gmail.com
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        We typically respond within 24-48 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <p className="text-gray-700 mb-4">
                  Before reaching out, check if your question is answered in our FAQ section on the homepage.
                </p>
                <Link href="/#faq">
                  <button className="text-blue-600 hover:text-blue-700 font-semibold">
                    View FAQ →
                  </button>
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What can we help with?</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Questions about job listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Technical support or bug reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Partnership opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Posting jobs on our platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>General inquiries and feedback</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-600 text-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Want to Post a Job?</h3>
                <p className="text-blue-100 mb-4">
                  Reach thousands of qualified remote job seekers. Get your listing live in minutes.
                </p>
                <Link href="/post-job">
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-full">
                    Post a Job - $99
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Response Times</h2>
            <div className="prose prose-blue max-w-none text-gray-700">
              <p>
                No Commute Jobs is run by a small team passionate about remote work. We read every message personally and aim to respond within 24-48 hours during business days.
              </p>
              <p className="mt-3">
                For urgent matters related to job postings or technical issues, please mention "URGENT" in your subject line, and we'll prioritize your request.
              </p>
              <p className="mt-3">
                Thank you for your patience and for being part of the No Commute community!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
