import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import json

class VendorReliabilityScorer:
    def __init__(self):
        self.weights = {
            'delivery_performance': 0.25,    # On-time delivery history
            'price_competitiveness': 0.20,   # Price vs market average
            'government_reviews': 0.20,      # Government user ratings
            'compliance_score': 0.15,        # Certifications and compliance
            'order_fulfillment': 0.10,       # Order completion rate
            'response_time': 0.10           # Customer service response
        }
    
    def calculate_vendor_score(self, vendor_data):
        """Calculate comprehensive vendor reliability score (0-100)"""
        
        # 1. Delivery Performance Score
        delivery_score = self._calculate_delivery_performance(
            vendor_data.get('delivery_history', [])
        )
        
        # 2. Price Competitiveness Score
        price_score = self._calculate_price_competitiveness(
            vendor_data.get('avg_price', 0),
            vendor_data.get('market_avg_price', 0)
        )
        
        # 3. Government Reviews Score
        review_score = self._calculate_review_score(
            vendor_data.get('rating', 4.0),
            vendor_data.get('review_count', 0)
        )
        
        # 4. Compliance Score
        compliance_score = self._calculate_compliance_score(
            vendor_data.get('certifications', []),
            vendor_data.get('government_approved', False)
        )
        
        # 5. Order Fulfillment Score
        fulfillment_score = self._calculate_fulfillment_score(
            vendor_data.get('completed_orders', 0),
            vendor_data.get('total_orders', 1)
        )
        
        # 6. Response Time Score
        response_score = self._calculate_response_score(
            vendor_data.get('avg_response_hours', 24)
        )
        
        # Calculate weighted total score
        total_score = (
            delivery_score * self.weights['delivery_performance'] +
            price_score * self.weights['price_competitiveness'] +
            review_score * self.weights['government_reviews'] +
            compliance_score * self.weights['compliance_score'] +
            fulfillment_score * self.weights['order_fulfillment'] +
            response_score * self.weights['response_time']
        )
        
        return {
            'overall_score': round(total_score, 1),
            'breakdown': {
                'delivery_performance': round(delivery_score, 1),
                'price_competitiveness': round(price_score, 1),
                'government_reviews': round(review_score, 1),
                'compliance': round(compliance_score, 1),
                'order_fulfillment': round(fulfillment_score, 1),
                'response_time': round(response_score, 1)
            },
            'risk_level': self._get_risk_level(total_score),
            'recommendation': self._get_recommendation(total_score)
        }
    
    def _calculate_delivery_performance(self, delivery_history):
        """Calculate delivery performance score based on on-time delivery"""
        if not delivery_history:
            return 70.0  # Default score for new vendors
        
        on_time_deliveries = sum(1 for delivery in delivery_history if delivery.get('on_time', True))
        performance_rate = on_time_deliveries / len(delivery_history)
        
        # Convert to 0-100 scale with exponential reward for high performance
        return min(100, performance_rate * 100 + (performance_rate - 0.8) * 50 if performance_rate > 0.8 else performance_rate * 100)
    
    def _calculate_price_competitiveness(self, vendor_avg_price, market_avg_price):
        """Calculate price competitiveness score"""
        if market_avg_price == 0:
            return 75.0  # Default score when no market data
        
        price_ratio = vendor_avg_price / market_avg_price
        
        if price_ratio <= 0.9:  # 10% below market
            return 100.0
        elif price_ratio <= 1.0:  # At or slightly below market
            return 90.0
        elif price_ratio <= 1.1:  # 10% above market
            return 75.0
        elif price_ratio <= 1.2:  # 20% above market
            return 60.0
        else:  # More than 20% above market
            return 40.0
    
    def _calculate_review_score(self, rating, review_count):
        """Calculate score based on government reviews"""
        if review_count == 0:
            return 70.0  # Default for vendors with no reviews
        
        # Base score from rating (convert 5-star to 100-point scale)
        base_score = (rating / 5.0) * 100
        
        # Confidence multiplier based on review count
        confidence_multiplier = min(1.0, review_count / 50)  # Full confidence at 50+ reviews
        
        # Penalty for very few reviews
        if review_count < 10:
            confidence_multiplier *= 0.8
        
        return base_score * confidence_multiplier
    
    def _calculate_compliance_score(self, certifications, government_approved):
        """Calculate compliance and certification score"""
        base_score = 50.0  # Base score
        
        # Government approval bonus
        if government_approved:
            base_score += 30.0
        
        # Certification bonuses
        cert_bonuses = {
            'ISO': 10.0,
            'BIS': 15.0,
            'GeM': 20.0,
            'Quality': 5.0,
            'Environmental': 5.0
        }
        
        for cert in certifications:
            for cert_type, bonus in cert_bonuses.items():
                if cert_type.lower() in cert.lower():
                    base_score += bonus
                    break
        
        return min(100.0, base_score)
    
    def _calculate_fulfillment_score(self, completed_orders, total_orders):
        """Calculate order fulfillment rate score"""
        if total_orders == 0:
            return 70.0  # Default for new vendors
        
        fulfillment_rate = completed_orders / total_orders
        return fulfillment_rate * 100
    
    def _calculate_response_score(self, avg_response_hours):
        """Calculate customer service response time score"""
        if avg_response_hours <= 2:
            return 100.0  # Excellent response
        elif avg_response_hours <= 8:
            return 90.0   # Good response
        elif avg_response_hours <= 24:
            return 75.0   # Acceptable response
        elif avg_response_hours <= 48:
            return 60.0   # Slow response
        else:
            return 40.0   # Very slow response
    
    def _get_risk_level(self, score):
        """Determine risk level based on overall score"""
        if score >= 85:
            return "Low Risk"
        elif score >= 70:
            return "Medium Risk"
        elif score >= 55:
            return "High Risk"
        else:
            return "Very High Risk"
    
    def _get_recommendation(self, score):
        """Get procurement recommendation based on score"""
        if score >= 85:
            return "Highly Recommended - Preferred vendor for government procurement"
        elif score >= 70:
            return "Recommended - Suitable for government contracts with standard oversight"
        elif score >= 55:
            return "Conditional - Requires additional verification and monitoring"
        else:
            return "Not Recommended - Significant risks identified"

# Test the vendor scorer
if __name__ == "__main__":
    scorer = VendorReliabilityScorer()
    
    # Sample vendor data
    sample_vendor = {
        'delivery_history': [
            {'order_id': 1, 'on_time': True},
            {'order_id': 2, 'on_time': True},
            {'order_id': 3, 'on_time': False},
            {'order_id': 4, 'on_time': True}
        ],
        'avg_price': 45000,
        'market_avg_price': 50000,
        'rating': 4.3,
        'review_count': 127,
        'certifications': ['ISO 9001', 'BIS Certified', 'GeM Approved'],
        'government_approved': True,
        'completed_orders': 145,
        'total_orders': 150,
        'avg_response_hours': 6
    }
    
    result = scorer.calculate_vendor_score(sample_vendor)
    print("🏆 Vendor Scoring Test:")
    print(json.dumps(result, indent=2))