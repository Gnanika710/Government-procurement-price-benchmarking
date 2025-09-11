// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQ1zBepJ4_qSCEhbnHjz0qyYlR8c2G8js",
  authDomain: "majorproject-2d32b.firebaseapp.com",
  projectId: "majorproject-2d32b",
  storageBucket: "majorproject-2d32b.firebasestorage.app",
  messagingSenderId: "482654287158",
  appId: "1:482654287158:web:d3c6279950f539ebd06f97",
  measurementId: "G-FK5MHP9F0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;