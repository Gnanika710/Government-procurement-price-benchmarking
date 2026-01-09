# Government Procurement Price Benchmarking System

**Tech Stack:** Node.js · React · Python · MongoDB

A comprehensive **price benchmarking platform** designed for **government procurement officials** to make informed purchasing decisions using **real-time price comparison**, **ML-powered predictions**, and **vendor compliance tracking**.

---

## 🚀 Features

* **Multi-Modal Search** – Search by Make/Model or detailed specifications
* **Real-Time Price Scraping** – Automated data collection from Google Shopping & Builder Mart
* **AI-Powered Analytics** – Price prediction, anomaly detection, and vendor scoring
* **Government Compliance** – Certification tracking (GeM, BIS, ISO) with bonus scoring
* **Secure Authentication** – JWT + Firebase OAuth (Google)
* **Interactive Dashboard** – Visual price comparisons and procurement recommendations

---

## 🛠️ Tech Stack

### Frontend

* React 18
* Vite
* Tailwind CSS
* Redux Toolkit
* Firebase Authentication

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Machine Learning Pipeline

* Python
* FastAPI
* Custom Inference APIs

### Scraping

* Python
* Selenium
* Multithreading

---

## 📋 Prerequisites

* Node.js (v18 or higher)
* Python (v3.8 or higher)
* MongoDB (Local or Atlas)
* Git

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/gnanika710/government-procurement-price-benchmarking.git
cd government-procurement-price-benchmarking
```

---

### 2️⃣ Backend Setup (BE/)

```bash
cd BE
npm install
cp .env.example .env
```

**Configure `.env`:**

```
MONGO=mongodb://localhost:27017/government-procurement
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES=7d
PORT=3000
```

**Start Backend Server:**

```bash
npm run dev
```

✅ Backend running at **[http://localhost:3000](http://localhost:3000)**

---

### 3️⃣ Frontend Setup (FE/)

```bash
cd ../FE
npm install
npm run dev
```

Add Firebase configuration in `src/firebase.js`.

✅ Frontend running at **[http://localhost:5173](http://localhost:5173)**

---

### 4️⃣ Scraping Service Setup (scraping/)

```bash
cd ../scraping
python -m venv venv
```

**Activate Virtual Environment:**

* Windows:

```bash
venv\Scripts\activate
```

* macOS/Linux:

```bash
source venv/bin/activate
```

```bash
pip install -r requirements.txt
python server.py
```

✅ Scraping API running at **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

### 5️⃣ ML Services Setup (BE/ml/)

```bash
cd ../BE/ml/prediction
pip install fastapi uvicorn pandas numpy scikit-learn
```

Run each service in a separate terminal:

```bash
python price_prediction_api.py     # Port 5001
python anomaly_detection_api.py    # Port 5002
python vendor_scoring_api.py       # Port 5003
```

---

## 🏃‍♂️ Running the Application

### Development Mode

1. Start MongoDB (if local)
2. Open multiple terminals:

**Terminal 1 – Backend**

```bash
cd BE && npm run dev
```

**Terminal 2 – Frontend**

```bash
cd FE && npm run dev
```

**Terminal 3 – Scraping Service**

```bash
cd scraping && python server.py
```

**Terminal 4 – ML Services**

```bash
cd BE/ml/prediction && python price_prediction_api.py
```

---

## 🌐 Access Points

* **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:3000/api](http://localhost:3000/api)
* **Scraping Service:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
* **API Health Check:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 📁 Project Structure

```
├── BE/                          # Backend (Node.js/Express)
│   ├── controllers/            # Request handlers
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Authentication & validation
│   ├── ml/                     # Python ML pipeline
│   │   ├── training/           # Model training scripts
│   │   └── prediction/         # Inference APIs
│   ├── uploads/products/       # File storage
│   └── index.js                # Server bootstrap
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
    └── server.py               # FastAPI scraping server
```

---

## 🔑 Environment Configuration

### Backend (`.env`)

```
MONGO=mongodb://localhost:27017/government-procurement
JWT_SECRET=your-256-bit-secret
JWT_EXPIRES=7d
PORT=3000
NODE_ENV=development
```

### Firebase (`FE/src/firebase.js`)

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

---

## 🎯 Usage Guide

### 👩‍💼 For Government Officials

* Sign up / Login using Email or Google OAuth
* Search products by Make/Model or Specifications
* View real-time price comparisons
* Check vendor compliance (GeM, BIS, ISO)
* Get ML-based price reasonableness predictions
* Access **Top 3 procurement recommendations**

### 🏪 For Retailers / Vendors

* Create a Retailer account
* Register shop with compliance details
* Add products with specifications and pricing
* Upload product images
* Manage inventory through the dashboard

---

✅ *This project enables transparent, data-driven, and compliant government procurement decisions.*
