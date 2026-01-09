# Government Procurement Price Benchmarking System – Backend

## Overview

This repository contains the **backend implementation** of the Government Procurement Price Benchmarking System. The backend is responsible for handling authentication, user and supplier management, product operations, file uploads, ML service integration, real-time data orchestration, and system monitoring.

The system is designed to be **secure, scalable, and production-ready**, suitable for government procurement use cases.

---

## Key Features

* Modular RESTful API architecture
* JWT-based authentication and role-based access control
* MongoDB database with Mongoose ODM
* Product and supplier management
* Secure file uploads using Multer
* Integration with ML services (Python APIs)
* Integration with scraping services for real-time pricing
* Centralized error handling and health monitoring

---

## Tech Stack

* **Node.js** – Server runtime
* **Express.js** – Web framework
* **MongoDB + Mongoose** – Database and ODM
* **JWT** – Authentication & authorization
* **Multer** – File upload handling
* **CORS** – Cross-origin resource sharing

---

## Project Structure

```
backend/
│
├── index.js                # Server entry point
├── routes/                 # API route definitions
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── product.routes.js
│   ├── shop.routes.js
│   ├── ml.routes.js
│   ├── scrapedata.routes.js
│   └── health.routes.js
│
├── controllers/            # Business logic
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── product.controller.js
│   ├── shop.controller.js
│   ├── ml.controller.js
│   └── scraper.controller.js
│
├── models/                 # Database schemas
│   ├── user.model.js
│   ├── product.model.js
│   └── shop.model.js
│
├── middleware/             # Middleware logic
│   └── auth.js
│
├── utils/                  # Utilities
│   └── error.js
│
├── uploads/                # Uploaded files
│   └── products/
│
└── .env                    # Environment variables
```

---

## API Endpoints

### Authentication

* `POST /api/auth/register` – User registration
* `POST /api/auth/login` – User login & JWT generation

### User Management

* `GET /api/user/profile` – Get user profile
* `PUT /api/user/profile` – Update user profile

### Product Management

* `POST /api/product` – Add product (with image upload)
* `GET /api/product` – Fetch products
* `PUT /api/product/:id` – Update product
* `DELETE /api/product/:id` – Delete product

### Shop / Supplier Management

* `POST /api/shop/register` – Supplier registration
* `GET /api/shop` – Fetch suppliers

### ML Services

* `POST /api/ml/predict` – Price prediction & anomaly detection

### Scraping Services

* `GET /api/scrapedata` – Trigger real-time data collection

### Health Monitoring

* `GET /api/health` – Server health check

---

## Authentication & Authorization

* JWT tokens generated during login
* Tokens verified using middleware
* Role-based access control for:

  * Government officers
  * Suppliers
  * Admins

---

## File Upload Handling

* Implemented using **Multer**
* Validates file type and size
* Stores files in structured directories
* Supports product images and government documents

---

## Error Handling

* Centralized error handling across controllers
* Consistent JSON error responses
* Graceful server shutdown on failures

---

## Environment Variables

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=1d
```

---

## How to Run Locally

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```
3. Configure environment variables in `.env`
4. Start the server:

   ```bash
   npm start
   ```

---

## Production Readiness

* Modular architecture
* Secure authentication
* Scalable database design
* External service integration
* Health monitoring endpoint

---

## Author

Backend developed as part of **Smart India Hackathon (SIH)** project for improving transparency, efficiency, and compliance in government procurement.


