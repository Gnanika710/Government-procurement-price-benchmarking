// src/components/ServicesSection.jsx
import React from 'react';

const services = [
  { title: 'Query by Make/Model', description: 'Exact Make/Model query for products.' },
  { title: 'Relevant Specifications', description: 'Query based on most relevant specs.' },
  { title: 'Service Requirements', description: 'Query based on basic service needs.' },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded shadow-lg">
              <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
