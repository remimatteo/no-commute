import React from 'react';
import SEO from '../../components/SEO';
import Link from 'next/link';
import { MapPin, Users, Briefcase, Heart, Target, Zap } from 'lucide-react';

export default function About() {
  return (
    <>
      <SEO
        title="About No Commute - Revolutionizing Remote Work"
        description="Learn about our mission to help professionals find meaningful remote work opportunities and escape the daily commute."
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">About No Commute Jobs</h1>
            <p className="text-xl text-blue-100">
              Helping professionals find remote work opportunities and live life on their own terms
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
            ← Back to Home
          </Link>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="prose prose-blue max-w-none space-y-4 text-gray-700 leading-relaxed">
              <p>
                No Commute Jobs was born from a simple but powerful observation: talented people shouldn't have to choose between career opportunities and the freedom to live where they want.
              </p>
              <p>
                The idea came to life when I watched my girlfriend turn down amazing job opportunities simply because they weren't remote. It hit me - in our digital age, why should location matter when the work can be done from anywhere?
              </p>
              <p>
                That realization sparked the creation of No Commute Jobs. What started as a weekend project has grown into a platform that helps thousands of job seekers find legitimate remote opportunities from companies around the world.
              </p>
              <p>
                We're not a massive corporation with unlimited resources - we're a small, passionate team that believes remote work isn't just a trend, it's the future. Every feature we build, every job we list, and every email we send is designed with one goal: helping people escape the commute and find meaningful work they can do from anywhere.
              </p>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To break down geographical barriers and create a world where talent can thrive from anywhere. We believe work should be about what you do, not where you do it.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">What We Value</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Transparency, quality, and authenticity. Every job listing is curated. We don't spam. We don't sell your data. We simply connect great people with great opportunities.
              </p>
            </div>
          </div>

          {/* What We Do */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Curate Remote Job Listings</h3>
                  <p className="text-gray-700">
                    We aggregate and verify remote job opportunities from top companies worldwide. Our platform features 2000+ active remote positions across software development, design, marketing, customer support, and more.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Updates</h3>
                  <p className="text-gray-700">
                    We update our job board multiple times daily, ensuring you have access to the freshest opportunities. Subscribe to our weekly newsletter to get hand-picked remote jobs delivered to your inbox.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Support Job Seekers</h3>
                  <p className="text-gray-700">
                    Beyond job listings, we provide resources, guides, and tips to help you succeed in the remote work world. From interview preparation to building a home office, we're here to help.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why We Built This */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-8 border border-blue-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why We Built This</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>To help people escape the commute.</strong> The average American spends 27 minutes commuting each way - that's 9 days per year stuck in traffic or on public transit. We believe that time belongs to you.
              </p>
              <p>
                <strong>To promote work-life balance.</strong> Remote work isn't just about location flexibility - it's about having control over your schedule, spending more time with family, and living a fuller life.
              </p>
              <p>
                <strong>To support legitimate opportunities.</strong> The remote job market can be filled with scams and low-quality listings. We vet opportunities to ensure you're applying to real companies with genuine positions.
              </p>
            </div>
          </div>

          {/* Who's Behind It */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who's Behind This</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>Created by Remi Matteo</strong>, a finance professional passionate about remote work opportunities and helping people find jobs that fit their lifestyle, not the other way around.
              </p>
              <p>
                After seeing firsthand how location restrictions limited career options, I decided to build something that would help others avoid that same frustration. No Commute Jobs is built nights and weekends with one goal: making remote job hunting easier and more effective.
              </p>
              <p>
                This isn't a venture-backed startup chasing metrics - it's a labor of love built to solve a real problem. Every feature request, bug fix, and improvement comes from listening to job seekers like you.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2000+</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">10K+</div>
              <div className="text-sm text-gray-600">Subscribers</div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Find Your Remote Job?</h2>
            <p className="text-blue-100 mb-6">
              Browse thousands of verified remote opportunities or get weekly job alerts delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Browse Jobs
                </button>
              </Link>
              <Link href="/contact">
                <button className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors border border-white">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
