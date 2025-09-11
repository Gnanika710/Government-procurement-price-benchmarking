import React, { useState } from 'react';

const MLPrediction = ({ itemData, onPredictionUpdate }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const getPrediction = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/ml/predict-price', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    item_name: itemData.item_name || itemData.itemName,
                    category: itemData.category,
                    specifications: itemData.specifications || {},
                    seller: itemData.seller,
                    seller_rating: parseFloat(itemData.seller_rating || 4.0)
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                setPrediction(data.prediction);
                if (onPredictionUpdate) {
                    onPredictionUpdate(data.prediction);
                }
            } else {
                throw new Error(data.error || 'Prediction failed');
            }
            
        } catch (error) {
            console.error('ML Prediction failed:', error);
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    🤖 <span className="ml-2">AI Price Prediction</span>
                </h3>
                <button 
                    onClick={getPrediction} 
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
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
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                    <p className="text-red-700 text-sm">
                        <span className="font-medium">Error:</span> {error}
                    </p>
                </div>
            )}
            
            {prediction && (
                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-md p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">AI Predicted Price</div>
                            <div className="text-2xl font-bold text-green-600">
                                {formatPrice(prediction.predicted_price)}
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-md p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Confidence Level</div>
                            <div className="flex items-center">
                                <div className="text-xl font-semibold text-blue-600 mr-2">
                                    {(prediction.confidence * 100).toFixed(1)}%
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${prediction.confidence * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {prediction.price_range && (
                        <div className="bg-white rounded-md p-4 border border-gray-200">
                            <div className="text-sm text-gray-600 mb-2">Expected Price Range</div>
                            <div className="flex items-center justify-between">
                                <div className="text-center">
                                    <div className="text-xs text-gray-500">Minimum</div>
                                    <div className="text-lg font-semibold text-orange-600">
                                        {formatPrice(Math.round(prediction.price_range.min))}
                                    </div>
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="bg-gradient-to-r from-orange-200 via-green-200 to-red-200 h-2 rounded-full"></div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-gray-500">Maximum</div>
                                    <div className="text-lg font-semibold text-red-600">
                                        {formatPrice(Math.round(prediction.price_range.max))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                        <div className="flex justify-between">
                            <span>Model Version: {prediction.model_version}</span>
                            <span>Predicted: {prediction.prediction_date}</span>
                        </div>
                    </div>
                </div>
            )}
            
            {!prediction && !loading && !error && (
                <div className="text-center text-gray-500 py-4">
                    <p className="text-sm mb-2">🔮 Get AI-powered price predictions</p>
                    <p className="text-xs">Uses machine learning to analyze historical data and market trends</p>
                </div>
            )}
        </div>
    );
};

export default MLPrediction;