import sys
import json
import os
import traceback

# Add parent directory to path to import ML modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from training.price_predictor import GovernmentProcurementPricePredictor
    
    def main():
        try:
            # Get input data from command line arguments
            input_data = json.loads(sys.argv[1])
            
            # Initialize predictor
            predictor = GovernmentProcurementPricePredictor()
            
            # Make prediction
            result = predictor.predict_price(
                item_name=input_data['item_name'],
                category=input_data['category'],
                specifications=input_data['specifications'],
                seller=input_data.get('seller', 'Standard Supplier'),
                seller_rating=float(input_data.get('seller_rating', 4.0))
            )
            
            # Output result as JSON
            print(json.dumps(result))
            
        except Exception as e:
            error_result = {
                'error': str(e),
                'traceback': traceback.format_exc(),
                'predicted_price': 0,
                'confidence': 0,
                'price_range': {'min': 0, 'max': 0}
            }
            print(json.dumps(error_result))
    
    if __name__ == "__main__":
        main()
        
except ImportError as e:
    error_result = {
        'error': f'Import error: {str(e)}',
        'predicted_price': 50000,  # Default fallback
        'confidence': 0.3,
        'price_range': {'min': 40000, 'max': 60000}
    }
    print(json.dumps(error_result))