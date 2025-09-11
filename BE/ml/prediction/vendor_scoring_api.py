import sys
import json
import os
import traceback

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from training.vendor_scorer import VendorReliabilityScorer
    
    def main():
        try:
            # Get vendor data from command line arguments
            vendor_data = json.loads(sys.argv[1])
            
            # Initialize scorer
            scorer = VendorReliabilityScorer()
            
            # Calculate vendor score
            result = scorer.calculate_vendor_score(vendor_data)
            
            # Output result as JSON
            print(json.dumps(result))
            
        except Exception as e:
            error_result = {
                'overall_score': 70.0,  # Default score
                'breakdown': {
                    'delivery_performance': 70.0,
                    'price_competitiveness': 70.0,
                    'government_reviews': 70.0,
                    'compliance': 70.0,
                    'order_fulfillment': 70.0,
                    'response_time': 70.0
                },
                'risk_level': 'Medium Risk',
                'recommendation': 'Default scoring due to processing error',
                'error': str(e)
            }
            print(json.dumps(error_result))
    
    if __name__ == "__main__":
        main()
        
except ImportError as e:
    error_result = {
        'overall_score': 70.0,
        'error': f'Import error: {str(e)}'
    }
    print(json.dumps(error_result))