import React, { useState, useEffect } from 'react';

const MLDashboard = () => {
    const [modelStatus, setModelStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkModelStatus();
    }, []);

    const checkModelStatus = async () => {
        try {
            const response = await fetch('/api/ml/model-status');
            const data = await response.json();
            setModelStatus(data);
        } catch (error) {
            console.error('Error checking model status:', error);
        } finally {
            setLoading(false);
        }
    };

    const trainModels = async (modelType) => {
        setLoading(true);
        try {
            const response = await fetch('/api/ml/train-models', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model_type: modelType })
            });
            const data = await response.json();
            if (data.success) {
                alert('Model training completed successfully!');
                checkModelStatus();
            }
        } catch (error) {
            console.error('Model training failed:', error);
            alert('Model training failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    🤖 Government Procurement ML Dashboard
                </h1>

                {/* Model Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">🎯 Price Predictor</h3>
                        <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                modelStatus?.models?.price_predictor 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {modelStatus?.models?.price_predictor ? 'Ready' : 'Not Trained'}
                            </span>
                            <button 
                                onClick={() => trainModels('price_predictor')}
                                disabled={loading}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                                {loading ? 'Training...' : 'Train'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">🚨 Anomaly Detector</h3>
                        <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                modelStatus?.models?.anomaly_detector 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {modelStatus?.models?.anomaly_detector ? 'Ready' : 'Not Trained'}
                            </span>
                            <button 
                                onClick={() => trainModels('anomaly_detector')}
                                disabled={loading}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                                {loading ? 'Setting up...' : 'Setup'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">🏆 Vendor Scorer</h3>
                        <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                Always Ready
                            </span>
                            <span className="text-gray-500 text-sm">Rule-based</span>
                        </div>
                    </div>
                </div>

                {/* Quick Test Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">🧪 Quick ML Test</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium mb-3">Price Prediction Test</h4>
                            <button 
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                onClick={async () => {
                                    try {
                                        const response = await fetch('/api/ml/predict-price', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                item_name: "Government Laptop",
                                                category: "Electronics",
                                                specifications: { "RAM": "8GB" },
                                                seller: "GeM Certified Vendor"
                                            })
                                        });
                                        const data = await response.json();
                                        alert(`Predicted Price: ₹${data.prediction?.predicted_price || 'Error'}`);
                                    } catch (error) {
                                        alert('Test failed: ' + error.message);
                                    }
                                }}
                            >
                                Test Price Prediction
                            </button>
                        </div>

                        <div>
                            <h4 className="font-medium mb-3">Anomaly Detection Test</h4>
                            <button 
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                onClick={async () => {
                                    try {
                                        const response = await fetch('/api/ml/detect-anomalies', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                current_price: 75000,
                                                historical_prices: [45000, 47000, 44500, 46000, 48000],
                                                item_category: "Electronics"
                                            })
                                        });
                                        const data = await response.json();
                                        alert(`Anomaly Detected: ${data.anomaly_analysis?.is_anomaly ? 'YES' : 'NO'}`);
                                    } catch (error) {
                                        alert('Test failed: ' + error.message);
                                    }
                                }}
                            >
                                Test Anomaly Detection
                            </button>
                        </div>
                    </div>
                </div>

                {/* System Status */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">📊 System Status</h3>
                    <div className="space-y-2">
                        <p><strong>All Models Ready:</strong> 
                            <span className={modelStatus?.all_models_ready ? 'text-green-600' : 'text-red-600'}>
                                {modelStatus?.all_models_ready ? ' ✅ Yes' : ' ❌ No'}
                            </span>
                        </p>
                        <p><strong>Last Check:</strong> {modelStatus?.last_check}</p>
                        <p><strong>ML Infrastructure:</strong> <span className="text-green-600">✅ Active</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MLDashboard;