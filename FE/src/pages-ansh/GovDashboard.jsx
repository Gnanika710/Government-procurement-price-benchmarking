import { useNavigate } from 'react-router-dom';
import Footer from '../components-ansh/Footer';
import Navbar from '../components-ansh/Navbar';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function GovDashboard() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-dark  text-light">
   
    <div className="p-5 max-w-6xl mb-20 mx-auto ">
      <h1 className="text-3xl text-center font-semibold mb-14 mt-20 ">Government Official Dashboard</h1>
      <div className="flex gap-6">
        
     
        <div className="bg-light text-dark rounded-lg shadow-lg p-5 w-full sm:w-1/2 lg:w-1/3 flex flex-col items-center">
          <div className="flex justify-center items-center mb-4">
            <Icon icon="simple-icons:cmake" className="text-dark text-8xl m-5" />
          </div>
          <h2 className="text-xl font-bold mb-4 text-center">Search by Make/Model</h2>
          <p className="mb-4 text-center">Find products based on make or model to streamline your procurement process.</p>
          <button
            onClick={() => handleNavigation('/search-by-make-model')}
            className="bg-dark text-light p-3 rounded-lg uppercase hover:bg-middle transition duration-300"
          >
            Search
          </button>
        </div>
  
 
        <div className="bg-light text-dark rounded-lg shadow-lg p-5 w-full sm:w-1/2 lg:w-1/3 flex flex-col items-center">
        <Icon icon="carbon:model" className="text-dark text-8xl m-5" />
          <h2 className="text-xl font-bold mb-4 text-center">Search by Specification</h2>
          <p className="mb-4 text-center">Search for products based on detailed specifications to find exactly what you need.</p>
          <button
            onClick={() => handleNavigation('/search-by-specification')}
            className="bg-dark text-light p-3 rounded-lg uppercase hover:bg-middle transition duration-300"
          >
            Search
          </button>
        </div>
  

        <div className="bg-light text-dark rounded-lg shadow-lg p-5 w-full sm:w-1/2 lg:w-1/3 flex flex-col items-center">
        <Icon icon="fluent-mdl2:service-off" className="text-dark text-8xl m-5" />
          <h2 className="text-xl font-bold mb-4 text-center">Search Service Provider</h2>
          <p className="mb-4 text-center">Identify and connect with service providers to meet your specific needs.</p>
          <button
            onClick={() => handleNavigation('/search-service-provider')}
            className="bg-dark text-light p-3 rounded-lg uppercase hover:bg-middle transition duration-300"
          >
            Search
          </button>
        </div>
        
      </div>
    </div>
    <Footer />
  </div>
  
  );
}
