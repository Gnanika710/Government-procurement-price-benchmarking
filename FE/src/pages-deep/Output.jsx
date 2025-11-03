import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Footer from '../components-ansh/Footer';
import MLPrediction from '../components-ansh/MLPrediction'; // Import ML component

const Output = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    seller: '',
    model: '',
    category: 'construction',
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [averagePrice, setAveragePrice] = useState(null);
  const [topSuggestions, setTopSuggestions] = useState([]);
  const [mlPrediction, setMlPrediction] = useState(null);

  const calculateReasonabilityScore = (rating, reviews) => {
    let ratingScore = 0;
    let reviewScore = 0;

    // Parse rating
    if (rating && rating !== "No rating" && rating !== "N/A" && rating !== null && rating !== undefined) {
      if (typeof rating === 'string') {
        const ratingMatch = rating.match(/(\d+\.?\d*)/);
        ratingScore = ratingMatch ? parseFloat(ratingMatch[1]) : 0;
      } else {
        ratingScore = parseFloat(rating) || 0;
      }
      ratingScore = Math.max(0, Math.min(5, ratingScore));
    }

    // Parse reviews
    if (reviews && reviews !== "No Reviews" && reviews !== "N/A" && reviews !== null && reviews !== undefined) {
      if (typeof reviews === 'string') {
        const reviewMatch = reviews.match(/(\d+)/);
        reviewScore = reviewMatch ? parseInt(reviewMatch[1]) : 0;
      } else {
        reviewScore = parseInt(reviews) || 0;
      }
      reviewScore = Math.max(0, reviewScore);
    }

    const ratingContribution = (ratingScore / 5) * 70;
    const reviewContribution = Math.min(30, reviewScore / 10);

    const totalScore = ratingContribution + reviewContribution;
    const finalScore = isNaN(totalScore) ? 0 : Math.max(0, Math.min(100, totalScore));

    return Math.round(finalScore * 10) / 10;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData([]);
    setAveragePrice(null);
    setTopSuggestions([]);
    setMlPrediction(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/scrape-make-model/${formData.category}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_name: formData.itemName,
          seller: formData.seller,
          model: formData.model,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      const prices = result.map(item => {
        const priceStr = item.Price || '';
        const match = priceStr.match(/[\d,.]+/g);
        return match ? parseFloat(match.join('').replace(/,/g, '')) : 0;
      });
      const avgPrice = prices.length > 0 ? (prices.reduce((acc, p) => acc + p, 0) / prices.length) : 0;
      setAveragePrice(avgPrice.toFixed(2));

      const dataWithScores = result.map(item => ({
        ...item,
        reasonabilityScore: calculateReasonabilityScore(item.Rating, item.Reviews)
      }));

      setData(dataWithScores);

      const topThree = dataWithScores
        .sort((a, b) => b.reasonabilityScore - a.reasonabilityScore)
        .slice(0, 3);

      setTopSuggestions(topThree);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      const firstItem = data[0];
      setMlPrediction({
        item_name: firstItem['Product Name'] || firstItem.service_provider || formData.itemName,
        category: formData.category,
        specifications: {},
        seller: firstItem.Seller || firstItem.source || "Unknown",
        seller_rating: parseFloat(firstItem.Rating || 4.0) || 4.0,
      });
    }
  }, [data]);

  return (
    <div className="bg-dark min-h-screen">
      <div className="p-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-white">
            <div className="flex justify-center items-center mb-4">
              <Icon icon="simple-icons:cmake" className="text-white text-8xl m-5" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">Search by Make/Model</h2>
            <p className="mb-4 text-center">Find products based on make or model to streamline your procurement process.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="construction">Construction</option>
                <option value="medical">Medical</option>
                <option value="electronics">Electronics</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">Item Name</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter item name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">Seller (Optional)</label>
              <input
                type="text"
                name="seller"
                value={formData.seller}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter seller name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">Model (Optional)</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter model"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md"
            >
              {loading ? 'Searching...' : 'Search Products'}
            </button>
          </form>

          {loading && <p className="mt-4 text-white">Loading...</p>}
          {error && <p className="mt-4 text-red-500">Error: {error}</p>}

          {data.length > 0 && (
            <div className="mt-8">
              <h3 className="text-3xl font-semibold mb-4 text-white text-center">Results</h3>

              {averagePrice && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
                  <p>Estimated Price: ₹{averagePrice}</p>
                </div>
              )}

              {topSuggestions.length > 0 && (
                <div className="mt-8 p-4 bg-blue-100 text-blue-800 rounded-md mb-10">
                  <h3 className="text-xl font-semibold mb-4">Top Suggestions</h3>
                  <ul className="space-y-2">
                    {topSuggestions.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <a href={item.Website} target="_blank" rel="noopener noreferrer">
                          <span>{item['Product Name']}</span>
                        </a>
                        <span>Score: {item.reasonabilityScore}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {mlPrediction && (
                <div className="mt-6">
                  <MLPrediction
                    itemData={mlPrediction}
                    onPredictionUpdate={(prediction) => {
                      console.log('ML Prediction:', prediction);
                    }}
                  />
                </div>
              )}

              <div className="overflow-x-auto rounded-md">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Item Name</th>
                      <th className="py-2 px-4 border-b">Specifications</th>
                      <th className="py-2 px-4 border-b">Source</th>
                      <th className="py-2 px-4 border-b">Price</th>
                      <th className="py-2 px-4 border-b">Last Updated</th>
                      <th className="py-2 px-4 border-b">Rating</th>
                      <th className="py-2 px-4 border-b">Reviews</th>
                      <th className="py-2 px-4 border-b">Reasonability Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b">{item['Product Name']}</td>
                        <td className="py-2 px-4 border-b">{item.specifications}</td>
                        <td className="py-2 px-4 border-b">
                          <a href={item.Website} target="_blank" rel="noopener noreferrer">{item.Seller}</a>
                        </td>
                        <td className="py-2 px-4 border-b">{item.Price}</td>
                        <td className="py-2 px-4 border-b">{item.last_updated}</td>
                        <td className="py-2 px-4 border-b">{item.Rating}</td>
                        <td className="py-2 px-4 border-b">{item.Reviews}</td>
                        <td className="py-2 px-4 border-b">
                          {isNaN(calculateReasonabilityScore(item.Rating, item.Reviews))
                            ? 'N/A'
                            : calculateReasonabilityScore(item.Rating, item.Reviews).toFixed(1)}
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

export default Output;
