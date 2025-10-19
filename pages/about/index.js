import React from 'react';
import SEO from '../../components/SEO';

export default function About() {
  return (
    <>
      <SEO 
        title="About No Commute - Revolutionizing Remote Work" 
        description="Learn about our mission to help professionals find meaningful remote work opportunities."
      />
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">About No Commute</h1>
          <div className="prose prose-blue max-w-none">
            <p>No Commute was born from a simple idea: work should be about what you do, not where you do it.</p>
            <p>Founded by Remi, our platform is dedicated to connecting talented professionals with remote job opportunities that offer flexibility, growth, and meaningful work.</p>
            <h2>Our Mission</h2>
            <p>To break down geographical barriers and create a world where talent can thrive from anywhere.</p>
          </div>
        </div>
      </div>
    </>
  );
}
