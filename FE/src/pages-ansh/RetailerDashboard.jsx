import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components-ansh/Footer';
import Navbar from '../components-ansh/Navbar';


export default function RetailerDashboard() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-dark text-light">
      <div className="p-5 max-w-6xl mb-20 mx-auto">
        <h1 className="text-3xl text-center font-semibold mb-14 mt-20">Retailer Dashboard</h1>
        <div className="flex flex-wrap justify-between gap-6">
   


        {/* <div className="bg-light text-dark rounded-lg shadow-lg p-5 flex-1 min-w-[300px] flex flex-col items-center">
            <div className="flex justify-center items-center mb-4">
              <Icon icon="fa6-solid:shop-lock" className="text-dark text-8xl" />
            </div>
            <h2 className="text-xl font-bold mb-4 text-center">Register your Shop</h2>
            <p className="mb-4 text-center">Register your shop with essential details below.</p>
            <div className="flex justify-center mt-auto">
              <button
                onClick={() => handleNavigation('/shop-create')}
                className="bg-dark text-light p-3 rounded-lg uppercase hover:bg-middle transition duration-300"
              >
                Register your shop
              </button>
            </div>
          </div> */}

          <div className="bg-light text-dark rounded-lg shadow-lg p-5 flex-1 min-w-[300px] flex flex-col items-center">
            <div className="flex justify-center items-center mb-4">
              <Icon icon="mdi:package-variant" className="text-dark text-8xl" />
            </div>
            <h2 className="text-xl font-bold mb-4 text-center">Register Your Product</h2>
            <p className="mb-4 text-center">Register new products to make them available for government procurement.</p>
            <div className="flex justify-center mt-auto">
              <button 
                onClick={() => handleNavigation('/create-product')}
                className="bg-dark text-light p-3 rounded-lg uppercase hover:bg-middle transition duration-300"
              >
                Register your products
              </button>
            </div>
          </div>

          <div className="bg-light text-dark rounded-lg shadow-lg p-5 flex-1 min-w-[300px] flex flex-col items-center">
            <div className="flex justify-center items-center mb-4">
              <Icon icon="mdi:order-bool-ascending" className="text-dark text-8xl" />
            </div>
            <h2 className="text-xl font-bold mb-4 text-center">Order Section</h2>
            <p className="mb-4 text-center">Manage your orders and track their status effectively.</p>
            <div className="flex justify-center mt-auto">
              <button
                onClick={() => handleNavigation('/order-section')}
                className="bg-dark text-light p-3 rounded-lg uppercase hover:bg-middle transition duration-300"
              >
                Go to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
