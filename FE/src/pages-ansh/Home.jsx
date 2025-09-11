import React from 'react';
import Footer from '../components-ansh/Footer';
import Navbar from '../components-ansh/Navbar';
import { Icon } from '@iconify/react';
import banner from "../assets/banner.jpg"
import banner2 from "../assets/logo.jpg"
import contribute from "../assets/contribute.png"
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();
  const sectors = [
    { name: 'Electronics', icon: 'fluent:device-meeting-room-16-regular' },
    { name: 'Construction', icon: 'ic:round-construction' },
    { name: 'Agriculture & Cooperation', icon: 'emojione-monotone:tractor' },
    { name: 'Chemicals & Fertilizers', icon: 'mdi:flask' },
    { name: 'Coal & Mine', icon: 'mdi:charcoal' },
    { name: 'Commerce & Industry', icon: 'material-symbols:factory-outline' },
    { name: 'Communications & Information Technology', icon: 'bi:telephone' },
    { name: 'Education & Training', icon: 'fluent:book-open-20-regular' },
    { name: 'Employment & Labour', icon: 'mdi:account-group' },
    { name: 'Energy & Power', icon: 'mdi:lightning-bolt' },
    { name: 'Environment & Natural Resources', icon: 'mdi:earth' },
    { name: 'Medical Resources', icon: 'hugeicons:medicine-02' }
  ];

  return (
    <div className="bg-light text-dark min-h-screen">
      <Navbar/>
      <section className="w-full">
        <img src={banner} alt="Banner" className="w-full h-auto"/>
        <div className="absolute inset-0 flex items-center justify-center ">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold text-center max-w-4xl mx-auto px-4 ">
            Empowering Government Procurement with Smart Price Insights and Fair Market Access.
          </h1>
        </div>
      </section>
      <section className="flex justify-around py-12  text-dark">
        <div className="w-1/3 p-6 text-center bg-white shadow-lg rounded">
          <h2 className="text-2xl font-bold mb-4">Are You a Government Official?</h2>
          <p>Register or login to manage market research for government procurement. Ensure transparency and efficiency in public spending.</p>
          <button className="bg-dark text-light mt-6 px-6 py-2 m-1 rounded" onClick={() => navigate('/govOfficial-signup')}>Register as Gov Official</button>
          <button className="bg-dark text-light mt-2 px-6 py-2 rounded"  onClick={() => navigate('/govOfficial-signin')} >Login as Gov Official</button>
        </div>
        <div className="w-1/3 p-6 text-center bg-white shadow-lg rounded">
          <h2 className="text-2xl font-bold mb-4">Are You a Retailer?</h2>
          <p>Register or login to list your products and access AI-driven market insights. Grow your business with informed decisions.</p>
          <button className="bg-dark text-light mt-6 px-6 py-2 m-1 rounded" onClick={() => navigate('/retailer-signup')}>Register as Retailer</button>
          <button className="bg-dark text-light mt-2 px-6 py-2 rounded" onClick={() => navigate('/retailer-signin')} >Login as Retailer</button>
        </div>
      </section>

    
      <section className=" flex items-center  p-20">
      <div className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3">
        <img 
          src={banner2}
          alt="Government Procurement" 
          className="w-full h-full rounded-full shadow-lg" 
        />
      </div>
      
      <div className="flex-grow w-full md:w-1/2 lg:w-2/3 pl-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-dark pl-8">What is GovRetail?</h2>
        <p className="text-lg md:text-xl mb-6 text-dark pl-8">
          GovRetail is a comprehensive platform designed to streamline market research and procurement processes for government officials and retailers. By automating data collection and utilizing AI models, we enhance efficiency, ensure transparency, and optimize costs in public spending.
        </p>
      </div>
    </section>


<section className="bg-dark py-12 text-center">
      <h2 className="text-3xl font-bold mb-6 text-white pb-8">SECTORS</h2>
      <div className="grid grid-cols-6 gap-6 mx-auto max-w-6xl">
        {sectors.slice(0, 12).map((sector, index) => (
          <div key={index} className="flex flex-col items-center text-white">
            <Icon icon={sector.icon} className="text-3xl mb-2" />
            <h3 className="text-sm font-bold">{sector.name}</h3>
          </div>
        ))}
      </div>
    </section>
   
    <section className="py-9 text-center bg-middle text-dark min-h-[200px]">
      <h2 className="text-3xl font-bold mb-6">Help Us Make It Better</h2>
      <div className="flex flex-col items-center justify-center min-h-[300px]  p-4 rounded-lg shadow-md">
        <img 
          src={contribute} 
          alt="Banner" 
          className="h-auto max-w-full mb-4"
        />
        <p className="text-lg text-center">
          In collaboration with the National Technical Research Organisation (NTRO), GovRetail provides a secure and efficient platform for government procurement. NTRO's expertise ensures that our platform is aligned with national standards, providing reliability and trust for all users.
        </p>
      </div>
    </section>
      <Footer/>
    </div>
  );
};

export default Home;

