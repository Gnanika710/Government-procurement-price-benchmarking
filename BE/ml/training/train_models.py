import sys
import json
from price_predictor import GovernmentProcurementPricePredictor
from anomaly_detector import ProcurementAnomalyDetector

def main():
    model_type = sys.argv[1] if len(sys.argv) > 1 else 'all'
    
    print(f"Training {model_type} model(s)...")
    
    if model_type in ['price_predictor', 'all']:
        print("Training Price Predictor...")
        predictor = GovernmentProcurementPricePredictor()
        results = predictor.train()
        print(f"Price Predictor trained: R² = {results['r2']:.3f}")
    
    if model_type in ['anomaly_detector', 'all']:
        print("Training Anomaly Detector...")
        detector = ProcurementAnomalyDetector()
        detector.save_model()
        print("Anomaly Detector ready")
    
    print("Model training completed!")

if __name__ == "__main__":
    main()