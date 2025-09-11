import React from 'react';
import { Icon } from '@iconify/react'; // Import Icon component from Iconify
import { FaPaperPlane } from 'react-icons/fa';
const Orders = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-dark">
      <div className="text-center space-y-4">
        {/* Paper plane icon */}
        <FaPaperPlane className="mx-auto text-white text-6xl mb-4 animate-bounce" />
        <h1 className="text-white text-4xl font-bold">No Orders Right Now</h1>
        <p className="text-white mt-2">
          Check back later or explore our site for other options.
        </p>
        <div className="flex space-x-4 justify-center mt-4">
          {/* Social media icons */}
          <a href="#" className="text-middle hover:text-[#7DA0CA]">
            <Icon icon="mdi:twitter" className="text-2xl" />
          </a>
          <a href="#" className="text-middle hover:text-[#7DA0CA]">
            <Icon icon="mdi:facebook" className="text-2xl" />
          </a>
          <a href="#" className="text-middle hover:text-[#7DA0CA]">
            <Icon icon="mdi:linkedin" className="text-2xl" />
          </a>
          <a href="#" className="text-middle hover:text-[#7DA0CA]">
            <Icon icon="mdi:instagram" className="text-2xl" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Orders;
