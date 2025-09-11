
# Government Procurement Price Benchmarking Application

## Overview
This web-based application helps government departments benchmark prices for products and services by utilizing web crawling technology and Machine Learning models. The application automates the process of gathering product information from various sources, predicts the estimated price of a specified product, and assigns a reasonability score to each product. Users can query a wide range of online retailers with one click, enabling easy access to price comparisons. Additionally, local retailers can register and list their products directly in the application to enhance visibility in the government procurement process.

## Functionalities
- **Web Crawling and Scraping**: Automated scraping of product prices and information from multiple online sources.
- **Price Prediction**: Uses machine learning models to predict estimated prices of specified products based on historical and current data.
- **Reasonability Score**: Assigns a score to products based on pricing reasonability in comparison to other sources.
- **Local Retailer Registration**: Allows local retailers to register their products directly if not listed online.
- **Single-Click Search**: Provides government officials with the ability to retrieve price benchmarks for products across multiple online platforms in one click.

## Prerequisites
Before running this project, ensure you have the following installed on your system:
- Node.js (v14.x or higher)
- MongoDB (local or remote instance)
- Python (v3.7 or higher)
- Virtualenv (for Python environments)
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ritu29verma/SIH.git
   cd SIH
   ```

2. **Backend Setup**

   - Navigate to the backend directory:
     ```bash
     cd backend
     ```

   - Install the required dependencies:
     ```bash
     npm install
     ```

   - Set up environment variables:
     Create a `.env` file in the `backend` directory and add your MongoDB URI, API keys, and any other required environment variables:
     ```plaintext
     MONGO_URI=your_mongo_db_uri
     PORT=5000
     ```

   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**

   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```

   - Install the frontend dependencies:
     ```bash
     npm install
     ```

   - Start the frontend development server:
     ```bash
     npm start
     ```

4. **Python Setup**

   - Navigate to the Python machine learning models directory:
     ```bash
     cd ml_models
     ```

   - Create a virtual environment and activate it:
     ```bash
     virtualenv venv
     source venv/bin/activate  # On Windows: venv\Scripts\activate
     ```

   - Install the required Python dependencies:
     ```bash
     pip install -r requirements.txt
     ```

   - Run the FastAPI server:
     ```bash
     uvicorn app:app --reload
     ```

## Usage

1. Start the backend server, frontend server, and Python FastAPI server as described in the installation section.
2. Access the application via `http://localhost:3000` for the frontend.
3. The backend API runs on `http://localhost:5000` and the FastAPI for machine learning models is available at `http://localhost:8000`.
4. Query product prices and view predicted pricing and reasonability scores.
5. Local retailers can register via the "Local Retailer" section in the application.

## Technology Stack

- **Frontend**: React.js, Tailwind CSS, Bootstrap, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Machine Learning**: Python, FastAPI, scikit-learn, TensorFlow
- **Web Scraping**: Python, BeautifulSoup
- **Development Tools**: Postman, VS Code, Git


## Contact
For any inquiries, reach out to [Ritu Verma](https://github.com/Ritu29verma).
