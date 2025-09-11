import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Footer from "../components-ansh/Footer";

const Output3 = () => {
  const [formData, setFormData] = useState({
    serviceType: "medical", // Default service type
    location: "",
    services: [], // Initialize as an empty array
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topSuggestions, setTopSuggestions] = useState([]);
  const [averagePrice, setAveragePrice] = useState(null);


  const calculateReasonabilityScore = (rating, reviews) => {
    return Math.min(100, rating * 20 + reviews / 10);
  };


  // Handle input changes for the main form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for services
  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    console.log("Handling change for index:", index, "name:", name, "value:", value); // Debugging statement

    const newServices = [...formData.services];
    newServices[index] = {
      ...newServices[index],
      [name]: value,
    };

    setFormData((prev) => ({
      ...prev,
      services: newServices,
    }));

    console.log("Updated services:", newServices); // Debugging statement
  };

  // Add a new service field
  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { description: "" }],
    }));
  };

  // Remove a service field
  const removeService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      services: newServices,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/api/scrapedata/scrape/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location: formData.location,
            description: formData.services
              .map((service) => service.description)
              .filter(desc => desc.trim() !== "") // Filter out empty descriptions
              .join(", "), // Combine service descriptions into a single string
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setData(result);

      const scores = result.map((service) => ({
        ...service,
        reasonabilityScore: calculateReasonabilityScore(
          service.rating,
          service.reviews
        ),
      }));
      const topThree = scores
        .slice()
        .sort((a, b) => b.reasonabilityScore - a.reasonabilityScore)
        .slice(0, 3);
      setTopSuggestions(topThree);


    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark min-h-screen">
      <div className="p-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-white">
            <div className="flex justify-center items-center mb-4">
              <Icon
                icon="fluent-mdl2:service-off"
                className="text-white text-8xl m-5"
              />
            </div>

            <h2 className="text-xl font-bold mb-4 text-center">
              Search Service Provider
            </h2>
            <p className="mb-4 text-center">
              Identify and connect with service providers to meet your specific
              needs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dropdown for Service Type */}
            <div>
              <label
                htmlFor="serviceType"
                className="block text-sm font-medium text-gray-700"
              >
                Service Type
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="medical">Medical</option>
                <option value="electrical">Electrical</option>
                <option value="civil">Civil Maintenance</option>
              </select>
            </div>

            {/* Input for Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your location"
              />
            </div>

            {/* Services Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Services
              </label>
              {formData.services.map((service, index) => (
                <div key={index} className="flex space-x-4 mt-2">
                  <input
                    type="text"
                    name="description"
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, e)}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Service Description"
                  />
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addService}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add Service
              </button>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Loading Indicator */}
        {loading && <p className="mt-4 text-gray-500">Loading...</p>}

        {/* Error Message */}
        {error && <p className="mt-4 text-red-500">Error: {error}</p>}

        {/* Data Table */}
        {data.length > 0 && (
          <div className="mt-8">
            <h3 className="text-3xl font-semibold mb-4 text-white text-center">
              Results
            </h3>

            {topSuggestions.length > 0 && (
              <div className="mt-8 p-4 bg-blue-100 text-blue-800 rounded-md mb-10">
                <h3 className="text-xl font-semibold mb-4">Top Suggestions</h3>
                <ul className="space-y-2">
                  {topSuggestions.map((service, index) => (
                    <li key={index} className="flex justify-between">
                      <a
                        href={service.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>{
service.service_provider
}</span>
                      </a>
                      <span>Score: {service.reasonabilityScore}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="overflow-x-auto rounded-md">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Service Provider</th>
                    <th className="py-2 px-4 border-b">Specialization</th>
                    <th className="py-2 px-4 border-b">Contact No.</th>
                    <th className="py-2 px-4 border-b">Rating</th>
                    <th className="py-2 px-4 border-b">Reviews</th>
                    <th className="py-2 px-4 border-b">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.service_provider}
                        </a>
                      </td>
                      <td className="py-2 px-4 border-b">
                        {item.specialization}
                      </td>
                      <td className="py-2 px-4 border-b">{item.phone}</td>
                      <td className="py-2 px-4 border-b">{item.rating}</td>
                      <td className="py-2 px-4 border-b">{item.reviews}</td>
                      <td className="py-2 px-4 border-b">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Output3;
