import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages-ansh/Home.jsx";
import About from "./pages-ansh/About.jsx";
import RetailerSignIn from "./pages-ansh/RetailerSignIn.jsx";
import RetailerSignUp from "./pages-ansh/RetailerSignUp.jsx";
import RetailerDashboard from "./pages-ansh/RetailerDashboard.jsx";
import GovDashboard from "./pages-ansh/GovDashboard.jsx";
import Profile from "./pages-ansh/Profile.jsx";
import GovSignup from "./pages-ansh/GovSignup.jsx";
import GovSingin from "./pages-ansh/GovSignin.jsx";
import PrivateRoute from "./components-ansh/PrivateRoute.jsx";
import ShopCreate from "./components-ansh/ShopCreate.jsx";
import ShopLogin from "./components-ansh/ShopLogin.jsx";
import CreateProduct from "./components-ansh/CreateProduct.jsx";
import Output from "./pages-deep/Output.jsx";
import Output2 from "./pages-deep/Output2.jsx";
import Orders from "./pages-ansh/Orders.jsx";
import { useState } from "react";
import Output3 from "./pages-deep/Output3.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <BrowserRouter>
      <ToastContainer
       position="bottom-left"  
       autoClose={5000}      
       hideProgressBar={false} 
       newestOnTop={false}     
       closeOnClick
       rtl={false}       
       pauseOnFocusLoss
       draggable
       pauseOnHover />
      <Routes>
      
        <Route path="/search-by-make-model" element={<Output />} />
        <Route path="/search-by-specification" element={<Output2 />} />
        <Route path="/search-service-provider" element={<Output3 />} />

        <Route path="/about" element={<About />} />
        <Route path="/govOfficial-signup" element={<GovSignup />} />
        <Route path="/govOfficial-signin" element={<GovSingin />} />
        <Route path="/retailer-signin" element={<RetailerSignIn />} />
        <Route path="/retailer-signup" element={<RetailerSignUp />} />
        <Route path="/govOfficial-dashboard" element={<GovDashboard />} />
        <Route path="/order-section" element={<Orders/>}/>
        <Route path="/" element={<Home />} />
        <Route path="/shop-login" element={<ShopLogin />} />
       
        <Route element={<PrivateRoute />}>
        <Route path="/create-shop" element={<ShopCreate />} />
        <Route path="/retailer-dashboard" element={<RetailerDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-product" element={<CreateProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
