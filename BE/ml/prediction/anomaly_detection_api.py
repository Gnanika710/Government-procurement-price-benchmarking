import sys
import json
import os
import traceback

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from training.anomaly_detector import ProcurementAnomalyDetector
    
    def main():
        try:
            # Get input data from command line arguments
            input_data = json.loads(sys.argv[1])
            
            # Initialize detector
            detector = ProcurementAnomalyDetector()
            
            # Perform anomaly detection
            result = detector.detect_price_anomalies(
                current_price=float(input_data['current_price']),
                historical_prices=[float(p) for p in input_data['historical_prices']],
                item_category=input_data.get('item_category', 'General'),
                specifications=input_data.get('specifications', {})
            )
            
            # Output result as JSON
            print(json.dumps(result))
            
        except Exception as e:
            error_result = {
                'is_anomaly': False,
                'confidence': 0.0,
                'reason': f'Error in anomaly detection: {str(e)}',
                'benchmark_price': 0,
                'price_deviation': 0,
                'risk_level': 'Unknown',
                'error': str(e)
            }
            print(json.dumps(error_result))
    
    if __name__ == "__main__":
        main()
        
except ImportError as e:
    error_result = {
        'is_anomaly': False,
        'error': f'Import error: {str(e)}'
    }
    print(json.dumps(error_result))