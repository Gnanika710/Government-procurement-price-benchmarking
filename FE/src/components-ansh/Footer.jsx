import React from 'react';
import img1 from "../assets/cpgrams.png"
import img2 from "../assets/data-gov.png"
import img3 from "../assets/india-gov.png"
import img4 from "../assets/logo-ngsp.png"
import img5 from "../assets/mygov.png"
import img6 from "../assets/pmo-logo.png"

const Footer = () => {
  return (
    <div>
       <div className='bg-white flex space-x-11 p-4'>
        <img src={img1} alt="CP Programs" className="img-fluid"/>
        <img src={img2} alt="Data Gov" className="img-fluid"/>
        <img src={img3} alt="India Gov" className="img-fluid"/>
        <img src={img4} alt="NGSP Logo" className="img-fluid"/>
        <img src={img5} alt="MyGov" className="img-fluid"/>
        <img src={img6} alt="PMO Logo" className="img-fluid"/>
        </div>
    <footer className="bg-dark text-light py-4 h-36">
      <div className="container mx-auto text-center">
       
        <p>&copy; 2024 GovRetail. All Rights Reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="/about" className="text-middle">About Us</a>
          <a href="/contact" className="text-middle">Contact</a>
          <a href="/privacy" className="text-middle">Privacy Policy</a>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
