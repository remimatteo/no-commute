import React from 'react';
import SEO from '../../components/SEO';

export default function Careers() {
  return (
    <>
      <SEO 
        title="Careers at No Commute - Join Our Team" 
        description="Explore job opportunities at No Commute and help us revolutionize remote work."
      />
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Careers at No Commute</h1>
          <div className="prose prose-blue max-w-none">
            <p>We're always looking for passionate individuals who believe in the future of remote work.</p>
            <h2>Current Openings</h2>
            <p>No open positions at the moment, but we're always interested in talented individuals. Send your resume to careers@nocommute.com.</p>
          </div>
        </div>
      </div>
    </>
  );
}
