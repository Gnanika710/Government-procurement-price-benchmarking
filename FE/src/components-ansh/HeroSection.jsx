// src/components/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section id="home" className="bg-gray-100 py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to NTRO Project</h2>
        <p className="text-lg text-gray-700 mb-6">
          Providing top-notch query-based solutions tailored to your needs.
        </p>
        {/* Use Link button to go to about page  */}
        <Link to="/about" className="bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-md"> Know More</Link>
      </div>
    </section>
  );
};

export default HeroSection;
