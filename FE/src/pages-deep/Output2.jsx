import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Footer from '../components-ansh/Footer';

const Output2 = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'electronics', // Default category
    specifications: [{ specification_name: '', value: '' }]
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [averagePrice, setAveragePrice] = useState(null);
  const [topSuggestions, setTopSuggestions] = useState([]);

  // Fixed reasonability score calculation
  const calculateReasonabilityScore = (rating, reviews) => {
    try {
      // Handle different rating formats
      let ratingNum = 0;
      let reviewNum = 0;
      
      // Parse rating - handle both string and number formats
      if (typeof rating === 'string') {
        // Remove any non-numeric characters except decimal point
        const cleanRating = rating.replace(/[^\d.]/g, '');
        ratingNum = parseFloat(cleanRating) || 0;
      } else if (typeof rating === 'number') {
        ratingNum = rating;
      }
      
      // Parse reviews - extract number from strings like "244 government reviews"
      if (typeof reviews === 'string') {
        const reviewMatch = reviews.match(/\d+/);
        reviewNum = reviewMatch ? parseInt(reviewMatch[0]) : 0;
      } else if (typeof reviews === 'number') {
        reviewNum = reviews;
      }
      
      // Ensure valid numbers
      ratingNum = Math.min(5, Math.max(0, ratingNum)); // Clamp between 0-5
      reviewNum = Math.max(0, reviewNum); // Ensure positive
      
      // Government procurement scoring algorithm
      const ratingScore = (ratingNum / 5.0) * 60; // 60% weight for rating
      const reviewScore = Math.min(40, (reviewNum / 100) * 40); // 40% weight for reviews
      
      const totalScore = ratingScore + reviewScore;
      
      // Return rounded score, ensuring it's not NaN
      const finalScore = isNaN(totalScore) ? 0 : Math.round(totalScore * 10) / 10;
      return finalScore;
    } catch (error) {
      console.error('Error calculating reasonability score:', error);
      return 0; // Return 0 instead of NaN on error
    }
  };

  // Enhanced government procurement scoring
  const calculateGovernmentProcurementScore = (item) => {
    try {
      let baseScore = calculateReasonabilityScore(item.Rating, item.Reviews);
      
      // Government-specific bonuses
      let governmentBonus = 0;
      
      // Seller type bonuses
      const seller = item.Seller || '';
      if (seller.includes('GeM Certified')) governmentBonus += 10;
      if (seller.includes('BIS Certified')) governmentBonus += 8;
      if (seller.includes('Government Supplier')) governmentBonus += 12;
      if (seller.includes('ISO Certified')) governmentBonus += 6;
      if (seller.includes('Public Sector')) governmentBonus += 8;
      
      const finalScore = Math.min(100, baseScore + governmentBonus);
      return isNaN(finalScore) ? 0 : Math.round(finalScore * 10) / 10;
    } catch (error) {
      console.error('Error calculating government score:', error);
      return 0;
    }
  };

  // Enhanced price parsing
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    const cleanPrice = priceString.replace(/[^0-9.-]+/g, "");
    return parseFloat(cleanPrice) || 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle specification changes
  const handleSpecificationChange = (index, field, value) => {
    const newSpecifications = [...formData.specifications];
    newSpecifications[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      specifications: newSpecifications,
    }));
  };

  // Add new specification
  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { specification_name: '', value: '' }],
    }));
  };

  // Remove specification
  const removeSpecification = (index) => {
    if (formData.specifications.length > 1) {
      const newSpecifications = formData.specifications.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        specifications: newSpecifications,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/scrape-specs/${formData.category}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_name: formData.itemName,
          specifications: formData.specifications.filter(spec => spec.specification_name && spec.value)
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('API Response:', result); // Debug log
      
      // Process results with fixed scoring
      const processedResults = result.map((item, index) => {
        const governmentScore = calculateGovernmentProcurementScore(item);
        return {
          ...item,
          governmentScore: governmentScore,
          reasonabilityScore: governmentScore,
          index: index
        };
      });

      setData(processedResults);

      // Calculate the average price
      const prices = processedResults.map(item => parsePrice(item.Price));
      const validPrices = prices.filter(price => price > 0);
      
      if (validPrices.length > 0) {
        const avgPrice = validPrices.reduce((acc, price) => acc + price, 0) / validPrices.length;
        setAveragePrice(avgPrice.toFixed(2));
      }

      // Sort by government procurement score
      const topThree = processedResults
        .slice()
        .sort((a, b) => (b.governmentScore || 0) - (a.governmentScore || 0))
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
      <div className='p-12'>
        <div className='max-w-6xl mx-auto'>
          
          <div className='text-white'>
            <div className="flex justify-center items-center mb-4">
              <Icon icon="material-symbols:search-insights" className="text-white text-8xl m-5" />
            </div>

            <h2 className="text-3xl font-bold mb-4 text-center">
              🏛️ Government Procurement Price Benchmarking
            </h2>
            <h3 className="text-xl mb-2 text-center">Search by Specification</h3>
            <p className="mb-8 text-center text-gray-300">
              Search for products based on detailed specifications to find exactly what you need.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Category Dropdown */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="electronics">Electronics</option>
                  <option value="construction">Construction</option>
                  <option value="medical">Medical</option>
                </select>
              </div>

              {/* Item Name */}
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., laptop, steel bars, thermometer"
                />
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specifications
                </label>
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-3">
                    <input
                      type="text"
                      placeholder="Specification name (e.g., RAM, Grade)"
                      value={spec.specification_name}
                      onChange={(e) => handleSpecificationChange(index, 'specification_name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g., 8GB, Fe 500D)"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {formData.specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecification}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm mt-2"
                >
                  Add Specification
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Icon icon="material-symbols:search" className="w-5 h-5 mr-2" />
                    Submit
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span>Searching for specifications...</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Results Section */}
          {data.length > 0 && (
            <div className="space-y-8">
              
              {/* Results Summary */}
              <div className="bg-green-100 border border-green-300 rounded-lg p-6 text-center">
                <h3 className="text-2xl font-semibold mb-4 text-green-800">Results</h3>
                {averagePrice && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-green-600 text-xl font-bold">
                      Estimated Price: ₹{averagePrice}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Based on {data.length} government suppliers
                    </p>
                  </div>
                )}
              </div>

              {/* Top Suggestions */}
              {topSuggestions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-blue-800">
                    🏆 Top Suggestions
                  </h3>
                  <div className="space-y-3">
                    {topSuggestions.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-4 rounded border">
                        <div className="flex-1">
                          <a 
                            href={item.Website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {item['Product Name'] || item.itemName}
                          </a>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.Seller} • {item.Price}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">
                            Score: {item.governmentScore || 'Calculating...'}
                          </div>
                          <div className="text-sm text-gray-500">Government Rating</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Results Table */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item Name
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Specifications
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Seller
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reviews
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Government Score
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.map((item, index) => {
                        const procurementScore = item.governmentScore || calculateGovernmentProcurementScore(item);
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="font-medium text-gray-900">
                                {item['Product Name'] || item.itemName}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {item.specifications || 'Standard specifications'}
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <a 
                                  href={item.Website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  {item.Seller}
                                </a>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.Seller?.includes('GeM') && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                      GeM Certified
                                    </span>
                                  )}
                                  {item.Seller?.includes('BIS') && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                      BIS Approved
                                    </span>
                                  )}
                                  {item.Seller?.includes('Government') && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                      Govt. Supplier
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-semibold text-green-600">
                              {item.Price}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {item.last_updated}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <span className="text-yellow-500">★</span>
                                <span className="ml-1 text-sm">{item.Rating}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {item.Reviews}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <span className={`font-bold text-lg ${
                                  procurementScore >= 80 ? 'text-green-600' : 
                                  procurementScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {procurementScore || 'Calculating...'}
                                </span>
                                {procurementScore >= 80 && (
                                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    Recommended
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Output2;