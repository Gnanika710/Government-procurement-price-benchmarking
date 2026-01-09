Government Procurement Price Benchmarking System
Node.js React Python MongoDB

A comprehensive price benchmarking platform designed for government procurement officials to make informed purchasing decisions through real-time price comparison, ML-powered predictions, and vendor compliance tracking.

🚀 Features
Multi-Modal Search: Search by Make/Model or detailed specifications
Real-Time Price Scraping: Automated data collection from Google Shopping & Builder Mart
AI-Powered Analytics: Price prediction, anomaly detection, and vendor scoring
Government Compliance: Certification tracking (GeM, BIS, ISO) with bonus scoring
Secure Authentication: JWT + Firebase OAuth (Google)
Interactive Dashboard: Visual price comparisons and procurement recommendations

🛠️ Tech Stack
Frontend: React 18 + Vite + Tailwind CSS + Redux Toolkit + Firebase Auth
Backend: Node.js + Express + MongoDB + Mongoose + JWT
ML Pipeline: Python + FastAPI + Custom Inference APIs
Scraping: Python + Selenium + Multithreading

📋 Prerequisites
Node.js (v18 or higher)
Python (v3.8 or higher)
MongoDB (Local or Atlas)
Git

🔧 Installation & Setup

1. Clone Repository
bash
Copy code
git clone https://github.com/gnanika710/government-procurement-price-benchmarking.git
cd government-procurement-price-benchmarking

3. Backend Setup (BE/)
bash
Copy code
cd BE

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# Edit .env with your values:
MONGO=mongodb://localhost:27017/government-procurement
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES=7d
PORT=3000
Start Backend Server:

bash
Copy code
npm run dev
✅ Backend running at http://localhost:3000

3. Frontend Setup (FE/)
bash
Copy code
cd ../FE

# Install dependencies
npm install

# Create Firebase config
# Add your Firebase config in src/firebase.js

# Start development server
npm run dev
✅ Frontend running at http://localhost:5173

4. Scraping Service Setup (scraping/)
bash
Copy code
cd ../scraping

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI scraping server
python server.py
✅ Scraping API running at http://127.0.0.1:8000

5. ML Services Setup (BE/ml/)
bash
Copy code
cd ../BE/ml/prediction

# Install Python ML dependencies
pip install fastapi uvicorn pandas numpy scikit-learn

# Start ML prediction APIs (run each in separate terminals)
python price_prediction_api.py     # Port 5001
python anomaly_detection_api.py    # Port 5002  
python vendor_scoring_api.py       # Port 5003
🏃‍♂️ Running the Application
Development Mode
Start MongoDB (if using local installation)
Terminal 1 - Backend:
bash
Copy code
cd BE && npm run dev
Terminal 2 - Frontend:
bash
Copy code
cd FE && npm run dev
Terminal 3 - Scraping Service:
bash
Copy code
cd scraping && python server.py
Terminal 4 - ML Services:
bash
Copy code
cd BE/ml/prediction && python price_prediction_api.py
Access Points
Frontend Dashboard: http://localhost:5173
Backend API: http://localhost:3000/api
Scraping Service: http://127.0.0.1:8000
API Health Check: http://localhost:3000/api/health
📁 Project Structure
Copy code
├── BE/                          # Backend (Node.js/Express)
│   ├── controllers/            # Request handlers
│   ├── models/                 # MongoDB schemas  
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Authentication & validation
│   ├── ml/                     # Python ML pipeline
│   │   ├── training/           # Model training scripts
│   │   └── prediction/         # Inference APIs
│   ├── uploads/products/       # File storage
│   └── index.js               # Server bootstrap
├── FE/                         # Frontend (React)
│   ├── src/
│   │   ├── components-ansh/    # Reusable components
│   │   ├── pages-ansh/         # Main pages
│   │   ├── pages-deep/         # Search interfaces
│   │   └── redux/              # State management
│   └── public/                 # Static assets
└── scraping/                   # Python scraping utilities
    ├── google.py               # Google Shopping scraper
    ├── test.py                 # Builder Mart scraper
    └── server.py              # FastAPI scraping server
🔑 Environment Configuration
Backend (.env)
env
Copy code
MONGO=mongodb://localhost:27017/government-procurement
JWT_SECRET=your-256-bit-secret
JWT_EXPIRES=7d
PORT=3000
NODE_ENV=development
Firebase Configuration (FE/src/firebase.js)
javascript
Copy code
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
🎯 Usage Guide
For Government Officials:
Sign Up/Login using email or Google OAuth
Search Products by Make/Model or Specifications
View Price Comparisons with average pricing
Check Vendor Compliance (GeM, BIS, ISO certifications)
Get ML Predictions for price reasonableness
Access Top 3 Recommendations based on government scoring
For Retailers/Vendors:
Create Retailer Account
Register Your Shop with compliance details
Add Products with specifications and pricing
Upload Product Images
Manage Inventory through dashboard
