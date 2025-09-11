import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
import json
import joblib
import statistics

class ProcurementAnomalyDetector:
    def __init__(self):
        self.isolation_forest = IsolationForest(
            contamination=0.1,  # 10% of data expected to be anomalous
            random_state=42,
            n_estimators=100
        )
        self.scaler = StandardScaler()
        self.model_path = 'BE/ml/models/anomaly_detector.pkl'
        
    def detect_price_anomalies(self, current_price, historical_prices, item_category, specifications=None):
        """Detect if current price is anomalous compared to historical data"""
        
        if len(historical_prices) < 5:
            return {
                "is_anomaly": False,
                "confidence": 0.3,
                "reason": "Insufficient historical data for reliable anomaly detection",
                "benchmark_price": current_price,
                "price_deviation": 0.0,
                "risk_level": "Unknown"
            }
        
        # Statistical analysis
        historical_array = np.array(historical_prices)
        mean_price = np.mean(historical_array)
        std_price = np.std(historical_array)
        median_price = np.median(historical_array)
        
        # Z-score calculation
        z_score = abs((current_price - mean_price) / std_price) if std_price > 0 else 0
        
        # Interquartile Range (IQR) method
        q1 = np.percentile(historical_array, 25)
        q3 = np.percentile(historical_array, 75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        
        # Multiple detection methods
        anomaly_indicators = {
            'z_score_anomaly': z_score > 2.5,  # Beyond 2.5 standard deviations
            'iqr_anomaly': current_price < lower_bound or current_price > upper_bound,
            'extreme_deviation': abs(current_price - median_price) / median_price > 0.5,  # 50% deviation from median
        }
        
        # Machine Learning based detection
        ml_anomaly = self._ml_anomaly_detection(historical_prices + [current_price])
        
        # Combine all detection methods
        anomaly_score = sum(anomaly_indicators.values()) + (1 if ml_anomaly else 0)
        is_anomaly = anomaly_score >= 2  # Require at least 2 methods to agree
        
        # Calculate confidence based on consistency of methods
        confidence = min(1.0, (anomaly_score / 4) * 0.8 + (z_score / 5) * 0.2)
        
        # Determine reason for anomaly
        reason = self._get_anomaly_reason(current_price, mean_price, std_price, anomaly_indicators)
        
        # Risk assessment
        risk_level = self._assess_risk_level(current_price, mean_price, confidence)
        
        # Price deviation percentage
        price_deviation = ((current_price - mean_price) / mean_price) * 100
        
        return {
            "is_anomaly": bool(is_anomaly),
            "confidence": round(confidence, 2),
            "reason": reason,
            "benchmark_price": round(mean_price, 2),
            "median_price": round(median_price, 2),
            "price_deviation": round(price_deviation, 1),
            "z_score": round(z_score, 2),
            "risk_level": risk_level,
            "detection_methods": {
                "z_score_flagged": anomaly_indicators['z_score_anomaly'],
                "iqr_flagged": anomaly_indicators['iqr_anomaly'],
                "extreme_deviation": anomaly_indicators['extreme_deviation'],
                "ml_flagged": ml_anomaly
            },
            "price_bounds": {
                "lower_bound": round(lower_bound, 2),
                "upper_bound": round(upper_bound, 2)
            },
            "analysis_timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    
    def _ml_anomaly_detection(self, prices):
        """Use Isolation Forest for ML-based anomaly detection"""
        try:
            prices_array = np.array(prices).reshape(-1, 1)
            
            # Scale the data
            prices_scaled = self.scaler.fit_transform(prices_array)
            
            # Fit and predict
            self.isolation_forest.fit(prices_scaled[:-1])  # Train on historical data
            prediction = self.isolation_forest.predict([prices_scaled[-1]])  # Predict on current price
            
            return prediction[0] == -1  # -1 indicates anomaly
        except Exception as e:
            print(f"ML anomaly detection error: {e}")
            return False
    
    def _get_anomaly_reason(self, current_price, mean_price, std_price, indicators):
        """Determine the reason for price anomaly"""
        if current_price > mean_price + 2 * std_price:
            if indicators['extreme_deviation']:
                return "Price is significantly higher than typical market rates - potential overpricing or premium product"
            else:
                return "Price is above normal range - may indicate inflation or special specifications"
        elif current_price < mean_price - 2 * std_price:
            if indicators['extreme_deviation']:
                return "Price is significantly lower than market rates - possible clearance, defective, or fraudulent listing"
            else:
                return "Price is below normal range - may indicate discount or promotional pricing"
        elif indicators['iqr_anomaly']:
            return "Price falls outside the typical price quartile range for this product category"
        else:
            return "Multiple statistical indicators suggest this price is unusual for government procurement"
    
    def _assess_risk_level(self, current_price, mean_price, confidence):
        """Assess procurement risk level based on price anomaly"""
        price_ratio = current_price / mean_price if mean_price > 0 else 1
        
        if confidence < 0.3:
            return "Low Risk - Insufficient data for assessment"
        elif confidence >= 0.8 and (price_ratio > 1.5 or price_ratio < 0.5):
            return "Very High Risk - Strong indication of pricing anomaly"
        elif confidence >= 0.6 and (price_ratio > 1.3 or price_ratio < 0.7):
            return "High Risk - Likely pricing anomaly detected"
        elif confidence >= 0.4 and (price_ratio > 1.2 or price_ratio < 0.8):
            return "Medium Risk - Possible pricing irregularity"
        else:
            return "Low Risk - Price within acceptable variance"
    
    def batch_anomaly_detection(self, products_data):
        """Detect anomalies across multiple products in a procurement batch"""
        anomalies = []
        
        for product in products_data:
            result = self.detect_price_anomalies(
                product['current_price'],
                product.get('historical_prices', []),
                product.get('category', 'Unknown'),
                product.get('specifications', {})
            )
            
            if result['is_anomaly']:
                anomalies.append({
                    'product': product,
                    'anomaly_details': result
                })
        
        return {
            'total_products_analyzed': len(products_data),
            'anomalies_detected': len(anomalies),
            'anomaly_rate': round(len(anomalies) / len(products_data) * 100, 1) if products_data else 0,
            'anomalous_products': anomalies
        }
    
    def save_model(self):
        """Save the trained anomaly detection model"""
        joblib.dump({
            'isolation_forest': self.isolation_forest,
            'scaler': self.scaler
        }, self.model_path)
    
    def load_model(self):
        """Load pre-trained anomaly detection model"""
        try:
            model_data = joblib.load(self.model_path)
            self.isolation_forest = model_data['isolation_forest']
            self.scaler = model_data['scaler']
            return True
        except FileNotFoundError:
            print("No pre-trained model found. Will train on first use.")
            return False

# Test the anomaly detector
if __name__ == "__main__":
    detector = ProcurementAnomalyDetector()
    
    # Sample historical prices for laptops in government procurement
    historical_prices = [45000, 47000, 44500, 46000, 48000, 45500, 47500, 46500, 44000, 48500, 45000, 46000]
    
    # Test cases
    test_cases = [
        {"price": 46000, "expected": "Normal"},      # Normal price
        {"price": 75000, "expected": "High anomaly"}, # Very high price
        {"price": 25000, "expected": "Low anomaly"},  # Very low price
        {"price": 52000, "expected": "Moderate anomaly"} # Moderately high price
    ]
    
    print("🚨 Anomaly Detection Tests:")
    for i, test in enumerate(test_cases):
        result = detector.detect_price_anomalies(
            current_price=test["price"],
            historical_prices=historical_prices,
            item_category="Electronics"
        )
        
        print(f"\nTest {i+1} - Price: ₹{test['price']:,} ({test['expected']})")
        print(f"Is Anomaly: {result['is_anomaly']}")
        print(f"Confidence: {result['confidence']}")
        print(f"Risk Level: {result['risk_level']}")
        print(f"Reason: {result['reason']}")