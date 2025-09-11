import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import json
import os
from datetime import datetime

class GovernmentProcurementPricePredictor:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100, 
            random_state=42,
            max_depth=10,
            min_samples_split=5
        )
        self.label_encoders = {}
        self.feature_columns = []
        self.model_path = 'BE/ml/models/price_predictor.pkl'
        
    def prepare_training_data(self, scraped_data):
        """Convert scraped procurement data to ML features"""
        df = pd.DataFrame(scraped_data)
        
        # Feature Engineering
        df['item_name_length'] = df['item_name'].str.len()
        df['spec_count'] = df['specifications'].apply(lambda x: len(x) if isinstance(x, dict) else 0)
        df['has_brand'] = df['item_name'].str.contains('HP|Dell|Tata|UltraTech|Lenovo|ASUS', case=False).astype(int)
        df['seller_rating_numeric'] = pd.to_numeric(df['seller_rating'], errors='coerce').fillna(4.0)
        df['is_government_certified'] = df['seller'].str.contains('GeM|Government|BIS|ISO', case=False).astype(int)
        
        # Clean price data (remove currency symbols)
        df['price_numeric'] = df['price'].str.replace('[₹,$,£,Rs,]', '', regex=True).str.replace(',', '').astype(float)
        
        # Category encoding
        category_encoder = LabelEncoder()
        df['category_encoded'] = category_encoder.fit_transform(df['category'])
        self.label_encoders['category'] = category_encoder
        
        # Seller encoding
        seller_encoder = LabelEncoder()
        df['seller_encoded'] = seller_encoder.fit_transform(df['seller'])
        self.label_encoders['seller'] = seller_encoder
        
        # Feature columns
        self.feature_columns = [
            'category_encoded', 'seller_encoded', 'item_name_length', 
            'spec_count', 'has_brand', 'seller_rating_numeric', 'is_government_certified'
        ]
        
        return df
    
    def train(self, training_data_file=None):
        """Train the price prediction model"""
        print("🚀 Training Government Procurement Price Prediction Model...")
        
        # Load training data (you'll need to collect this from your scraping)
        if training_data_file:
            with open(training_data_file, 'r') as f:
                training_data = json.load(f)
        else:
            # Generate sample training data for demonstration
            training_data = self._generate_sample_training_data()
        
        df = self.prepare_training_data(training_data)
        
        # Prepare features and target
        X = df[self.feature_columns]
        y = df['price_numeric']
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"✅ Model trained successfully!")
        print(f"📊 Mean Absolute Error: ₹{mae:.2f}")
        print(f"📊 R² Score: {r2:.3f}")
        
        # Save model and encoders
        os.makedirs('BE/ml/models', exist_ok=True)
        joblib.dump({
            'model': self.model,
            'encoders': self.label_encoders,
            'feature_columns': self.feature_columns
        }, self.model_path)
        
        return {'mae': mae, 'r2': r2}
    
    def predict_price(self, item_name, category, specifications, seller="Standard Supplier", seller_rating=4.0):
        """Predict government procurement price"""
        try:
            # Load trained model
            model_data = joblib.load(self.model_path)
            self.model = model_data['model']
            self.label_encoders = model_data['encoders']
            self.feature_columns = model_data['feature_columns']
        except FileNotFoundError:
            # Train model if not exists
            self.train()
        
        # Prepare features
        features = self._prepare_prediction_features(item_name, category, specifications, seller, seller_rating)
        
        # Make prediction
        predicted_price = self.model.predict([features])[0]
        
        # Calculate confidence interval (using model's prediction uncertainty)
        confidence = min(0.95, max(0.6, 1.0 - (predicted_price * 0.0001)))  # Simple confidence calculation
        price_range = {
            'min': max(0, predicted_price * 0.8),
            'max': predicted_price * 1.3
        }
        
        return {
            'predicted_price': round(predicted_price, 2),
            'confidence': round(confidence, 2),
            'price_range': price_range,
            'model_version': '1.0',
            'prediction_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def _prepare_prediction_features(self, item_name, category, specifications, seller, seller_rating):
        """Prepare features for a single prediction"""
        # Feature engineering (same as training)
        item_name_length = len(item_name)
        spec_count = len(specifications) if isinstance(specifications, dict) else 0
        has_brand = 1 if any(brand.lower() in item_name.lower() for brand in ['hp', 'dell', 'tata', 'ultratech', 'lenovo', 'asus']) else 0
        seller_rating_numeric = float(seller_rating)
        is_government_certified = 1 if any(cert.lower() in seller.lower() for cert in ['gem', 'government', 'bis', 'iso']) else 0
        
        # Encode categorical variables
        try:
            category_encoded = self.label_encoders['category'].transform([category])[0]
        except (KeyError, ValueError):
            category_encoded = 0  # Default for unknown categories
            
        try:
            seller_encoded = self.label_encoders['seller'].transform([seller])[0]
        except (KeyError, ValueError):
            seller_encoded = 0  # Default for unknown sellers
        
        return [
            category_encoded, seller_encoded, item_name_length, 
            spec_count, has_brand, seller_rating_numeric, is_government_certified
        ]
    
    def _generate_sample_training_data(self):
        """Generate sample training data for demonstration"""
        import random
        
        categories = ['Electronics', 'Construction', 'Medical', 'Office Supplies']
        sellers = ['GeM Certified Vendor', 'BIS Supplier', 'Government Contractor', 'Local Retailer', 'Premium Supplier']
        
        training_data = []
        for i in range(1000):  # Generate 1000 sample records
            category = random.choice(categories)
            seller = random.choice(sellers)
            
            if category == 'Electronics':
                item_name = f"Laptop {random.choice(['i3', 'i5', 'i7'])} {random.choice(['HP', 'Dell', 'Lenovo'])}"
                base_price = random.randint(25000, 80000)
            elif category == 'Construction':
                item_name = f"Steel Bars {random.choice(['12mm', '16mm', '20mm'])} {random.choice(['Tata', 'SAIL', 'JSW'])}"
                base_price = random.randint(40, 80) * 1000  # per ton
            elif category == 'Medical':
                item_name = f"Medical Equipment {random.choice(['Thermometer', 'Stethoscope', 'BP Monitor'])}"
                base_price = random.randint(5000, 50000)
            else:
                item_name = f"Office {random.choice(['Chair', 'Desk', 'Printer'])}"
                base_price = random.randint(3000, 25000)
            
            # Add some price variation based on seller
            if 'GeM' in seller or 'Government' in seller:
                price_multiplier = random.uniform(0.9, 1.1)
            else:
                price_multiplier = random.uniform(0.8, 1.3)
                
            final_price = int(base_price * price_multiplier)
            
            training_data.append({
                'item_name': item_name,
                'category': category,
                'seller': seller,
                'price': f"₹{final_price:,}",
                'seller_rating': round(random.uniform(3.5, 4.9), 1),
                'specifications': {'grade': 'standard', 'certified': True}
            })
        
        return training_data

# Test the model
if __name__ == "__main__":
    predictor = GovernmentProcurementPricePredictor()
    
    # Train the model
    training_results = predictor.train()
    
    # Test prediction
    prediction = predictor.predict_price(
        item_name="HP Laptop i5",
        category="Electronics",
        specifications={'RAM': '8GB', 'Storage': '512GB SSD'},
        seller="GeM Certified Vendor",
        seller_rating=4.3
    )
    
    print("\n🎯 Prediction Test:")
    print(json.dumps(prediction, indent=2))