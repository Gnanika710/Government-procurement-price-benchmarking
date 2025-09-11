import React from 'react';

const Navbar = ({ userType }) => {
  return (
    <div>
    <nav className="bg-dark text-light p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">GovRetail</div>
      <div className="flex items-center">
        {userType === 'gov' ? (
          <>
            <button className="bg-white text-dark px-4 py-2 rounded mx-2 shadow-lg hover:from-middle hover:to-white">
              Gov Official Login
            </button>
            <button className="bg-white text-dark px-4 py-2 rounded shadow-lg hover:from-middle hover:to-white">
              Gov Official Register
            </button>
          </>
        ) : userType === 'retailer' ? (
          <>
            <button className="bg-white text-dark px-4 py-2 rounded mx-2 shadow-lg hover:from-middle hover:to-white">
              Retailer Login
            </button>
            <button className="bg-white text-dark px-4 py-2 rounded shadow-lg hover:from-middle hover:to-white">
              Retailer Register
            </button>
          </>
        ) : (
          <>
            {/* <button className="bg-white text-dark px-4 py-2 rounded mx-2 shadow-lg hover:from-middle hover:to-white">
              Login
            </button>
            <button className="bg-white text-dark px-4 py-2 rounded shadow-lg hover:from-middle hover:to-white">
              Register
            </button> */}
          </>
        )}
      </div>

    </nav>
    <div className='bg-white w-8'></div>
    </div>
  );
};

export default Navbar;
