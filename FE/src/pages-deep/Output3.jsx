import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Footer from "../components-ansh/Footer";

const Output3 = () => {
  const [formData, setFormData] = useState({
    serviceType: "medical",
    location: "",
    services: [{ description: "" }],
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topSuggestions, setTopSuggestions] = useState([]);
  const [sourceStats, setSourceStats] = useState([]);
  const [searchStats, setSearchStats] = useState(null);

  const serviceTypeMapping = {
    medical: ["doctors", "hospitals", "medical equipment", "healthcare"],
    electrical: ["electricians", "electrical services", "electronics repair"],
    civil: ["contractors", "construction", "civil engineering", "maintenance"],
    plumbing: ["plumbers", "plumbing services", "water supply"],
    automotive: ["car service", "auto repair", "mechanics"],
    cleaning: ["cleaning services", "housekeeping", "maintenance"]
  };

  const calculateReasonabilityScore = (rating, reviews) => {
    const ratingScore = parseFloat(rating) || 0;
    const reviewScore = parseInt(reviews) || 0;
    return Math.min(100, (ratingScore * 20) + Math.min(reviewScore / 10, 20));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [name]: value };
    setFormData((prev) => ({ ...prev, services: newServices }));
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { description: "" }],
    }));
  };

  const removeService = (index) => {
    if (formData.services.length > 1) {
      const newServices = formData.services.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, services: newServices }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData([]);
    setTopSuggestions([]);
    setSourceStats([]);
    setSearchStats(null);

    try {
      const serviceKeywords = serviceTypeMapping[formData.serviceType] || [];
      const userServices = formData.services
        .map((service) => service.description)
        .filter(desc => desc.trim() !== "");
      const combinedServices = [...serviceKeywords, ...userServices].join(", ");

      console.log('Sending request:', {
        location: formData.location,
        description: combinedServices,
        serviceType: formData.serviceType,
      });

      // ✅ FIXED: Correct API endpoint based on your scraperRouter.js
      const response = await fetch(`http://localhost:3000/api/scrapedata/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: formData.location,
          description: combinedServices,
          serviceType: formData.serviceType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      // ✅ FIXED: Handle both success response and direct data array
      let processedData = [];
      if (result.success && result.data) {
        processedData = result.data;
        setSourceStats(result.sources || []);
      } else if (Array.isArray(result)) {
        // Handle direct array response from backend
        processedData = result;
      } else {
        throw new Error('No data received from server');
      }

      // ✅ FIXED: Add reasonabilityScore to each item
      const dataWithScores = processedData.map((item) => ({
        ...item,
        reasonabilityScore: calculateReasonabilityScore(item.rating, item.reviews),
      }));

      setData(dataWithScores);
      setSearchStats({
        total: dataWithScores.length,
        location: formData.location,
        serviceType: formData.serviceType,
        searchTime: new Date().toLocaleTimeString()
      });

      // Calculate top suggestions
      const topThree = dataWithScores
        .sort((a, b) => b.reasonabilityScore - a.reasonabilityScore)
        .slice(0, 3);
      setTopSuggestions(topThree);

    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-white mb-8 text-center">
            <Icon icon="mdi:account-service" className="text-blue-400 text-8xl mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">🔍 Service Provider Search</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Find and connect with verified service providers across multiple platforms. Get comprehensive comparisons to make informed procurement decisions.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Service Type & Location */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Service Category *</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="medical">🏥 Medical & Healthcare</option>
                    <option value="electrical">⚡ Electrical Services</option>
                    <option value="civil">🏗️ Civil & Construction</option>
                    <option value="plumbing">🔧 Plumbing Services</option>
                    <option value="automotive">🚗 Automotive Services</option>
                    <option value="cleaning">🧹 Cleaning Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Mumbai, Delhi, Bangalore"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Custom Services */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Specific Services (Optional)</label>
                <p className="text-sm text-gray-600 mb-3">
                  Add specific services you're looking for. We'll combine these with {serviceTypeMapping[formData.serviceType]?.join(', ')} automatically.
                </p>
                {formData.services.map((service, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <input
                      type="text"
                      name="description"
                      value={service.description}
                      onChange={(e) => handleServiceChange(index, e)}
                      placeholder="e.g., Emergency services, 24/7 support"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addService}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  + Add Another Service
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.location.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-md font-semibold transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching Providers...
                  </>
                ) : (
                  "🔍 Search Service Providers"
                )}
              </button>
            </form>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center text-blue-600">
                <Icon icon="eos-icons:loading" className="text-4xl mb-2 mr-3" />
                <div>
                  <p className="text-lg font-semibold">Searching across multiple platforms...</p>
                  <p className="text-sm">This may take a few moments</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <Icon icon="mdi:alert-circle" className="text-red-500 text-2xl mr-3" />
                <div>
                  <h3 className="text-red-800 font-semibold">Search Failed</h3>
                  <p className="text-red-700">{error}</p>
                  <p className="text-red-600 text-sm mt-2">
                    Please check if the backend server is running on http://localhost:3000
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search Statistics */}
          {searchStats && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{searchStats.total}</div>
                  <div className="text-sm text-blue-800">Total Providers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{sourceStats.filter(s => s.status === 'fulfilled').length}</div>
                  <div className="text-sm text-green-800">Active Sources</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{searchStats.location}</div>
                  <div className="text-sm text-purple-800">Location</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{searchStats.searchTime}</div>
                  <div className="text-sm text-orange-800">Search Time</div>
                </div>
              </div>
            </div>
          )}

          {/* Top Suggestions */}
          {topSuggestions.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-orange-800 mb-4">🏆 Top Recommended Providers</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {topSuggestions.map((service, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow border">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 flex-1">{service.service_provider}</h4>
                      <span className="text-sm px-2 py-1 bg-orange-100 text-orange-800 rounded font-medium">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Icon icon="mdi:star" className="text-yellow-500 mr-1" />
                        <span>{service.rating} ({service.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center">
                        <Icon icon="mdi:trophy" className="text-orange-500 mr-1" />
                        <span>Score: {service.reasonabilityScore?.toFixed(1) || 'N/A'}/100</span>
                      </div>
                      <div className="flex items-center">
                        <Icon icon="mdi:source-branch" className="text-blue-500 mr-1" />
                        <span>{service.source}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Table */}
          {data.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="text-xl font-semibold text-gray-800">
                  🔍 All Service Providers ({data.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating & Reviews</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {item.service_provider || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {/* ✅ FIXED: Handle specialization field correctly */}
                          {item.specialization || 'General Services'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Icon icon="mdi:star" className="text-yellow-500 mr-1" />
                            {item.rating} ({item.reviews})
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Score: {item.reasonabilityScore?.toFixed(1) || 'N/A'}/100
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {/* ✅ FIXED: Handle phone field correctly */}
                          {item.phone || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.location || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.source === 'JustDial' ? 'bg-green-100 text-green-800' :
                            item.source === 'Sulekha' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {item.source}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {item.website ? (
                            <a 
                              href={item.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900 font-medium hover:underline"
                            >
                              Visit Website
                            </a>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Output3;