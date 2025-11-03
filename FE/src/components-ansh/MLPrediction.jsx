import React, { useState } from 'react';

const MLPrediction = ({ itemData, onPredictionUpdate }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const getPrediction = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🤖 Making ML request with data:', itemData);
            
            const requestData = {
                item_name: itemData.item_name || itemData.itemName || 'laptop',
                category: itemData.category || 'electronics',
                specifications: itemData.specifications || {},
                seller: itemData.seller || 'HP',
                seller_rating: parseFloat(itemData.seller_rating || 4.2)
            };
            
            console.log('📤 Sending to backend:', requestData);
            
            // ✅ FIXED: Use absolute URL to backend
            const response = await fetch('http://localhost:3000/api/ml/predict-price', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ ML API Response:', data);
            
            if (data.success) {
                setPrediction(data.prediction);
                if (onPredictionUpdate) {
                    onPredictionUpdate(data.prediction);
                }
            } else {
                throw new Error(data.error || 'Prediction failed');
            }
            
        } catch (error) {
            console.error('💥 ML Prediction failed:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return `₹${price.toLocaleString('en-IN')}`;
        }
        return price;
    };
    
    return (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    🤖 <span className="ml-2">AI Price Prediction</span>
                </h3>
                <button 
                    onClick={getPrediction} 
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <span className="mr-2">🎯</span>
                            Get AI Prediction
                        </>
                    )}
                </button>
            </div>
            
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                    <p className="text-red-700 text-sm font-medium">
                        ❌ <span className="font-medium">Error:</span> {error}
                    </p>
                    <div className="text-red-600 text-xs mt-2">
                        <p>🔧 Make sure backend is running on http://localhost:3000</p>
                    </div>
                </div>
            )}
            
            {prediction && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-md p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">🎯 AI Predicted Price</div>
                            <div className="text-2xl font-bold text-green-600">
                                {formatPrice(prediction.predicted_price)}
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-md p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">🎲 Confidence Level</div>
                            <div className="flex items-center">
                                <div className="text-xl font-semibold text-blue-600 mr-2">
                                    {(prediction.confidence * 100).toFixed(1)}%
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${prediction.confidence * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {prediction.price_range && (
                        <div className="bg-white rounded-md p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-3">📊 Expected Price Range</div>
                            <div className="flex items-center justify-between">
                                <div className="text-center">
                                    <div className="text-xs text-gray-500 mb-1">Minimum</div>
                                    <div className="text-lg font-semibold text-orange-600">
                                        {formatPrice(prediction.price_range.min)}
                                    </div>
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="bg-gradient-to-r from-orange-200 via-green-200 to-red-200 h-3 rounded-full"></div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-gray-500 mb-1">Maximum</div>
                                    <div className="text-lg font-semibold text-red-600">
                                        {formatPrice(prediction.price_range.max)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Government Procurement Notes */}
                    {prediction.procurement_notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                            <div className="text-sm text-yellow-800 mb-2 font-semibold">📋 Government Procurement Guidelines</div>
                            <div className="text-sm text-yellow-700 space-y-1">
                                <div><strong>Recommendation:</strong> {prediction.procurement_notes.recommendation}</div>
                                <div><strong>Compliance:</strong> {prediction.procurement_notes.compliance}</div>
                            </div>
                        </div>
                    )}
                    
                    {/* Analysis Factors */}
                    {prediction.factors_considered && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="text-sm text-blue-800 mb-2 font-semibold">🔍 Analysis Factors</div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                                <div>Category: {prediction.factors_considered.category}</div>
                                <div>Seller: {prediction.factors_considered.seller_type}</div>
                                <div>Rating: {prediction.factors_considered.seller_rating}/5</div>
                                <div>Gov Certified: {prediction.factors_considered.government_certified ? 'Yes' : 'No'}</div>
                            </div>
                        </div>
                    )}
                    
                    <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
                        <div className="flex justify-between items-center">
                            <span>Model: {prediction.model_version}</span>
                            <span>Generated: {new Date(prediction.prediction_date).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
            
            {!prediction && !loading && !error && (
                <div className="text-center text-gray-500 py-6">
                    <div className="text-4xl mb-2">🔮</div>
                    <p className="text-sm mb-2 font-medium">Get AI-powered price predictions</p>
                    <p className="text-xs">Uses machine learning to analyze historical data and market trends</p>
                </div>
            )}
        </div>
    );
};

export default MLPrediction;