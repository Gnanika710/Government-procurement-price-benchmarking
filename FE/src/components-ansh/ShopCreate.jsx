import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ShopCreate = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [visible, setVisible] = useState(false);
  const [website, setWebsite] = useState(""); // New field
  const [selectedService, setSelectedService] = useState(""); // Changed to single service
  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
  }); // New field

  const servicesList = [
    "Construction",
    "Electronics",
    "Medical",
    "Food Retailer",
    "Furniture Store",
    "Bookstore",
    "Home Care",
    "Clothing Store",
    "Grocery Store",
    "Automobile",
  ];

  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const userId = currentUser._id; 
  // Handle service change
  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
  };

  // Form submission logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        name,
        phoneNumber,
        address,
        zipCode,
        website, // Include new fields in formData
        selectedService, // Changed to single service
        socialMedia,
        userId
      };

      const res = await fetch("http://localhost:3000/api/shop/create-shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Shop registered successfully!");
        navigate("/retailer-dashboard"); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("There was an error registering the shop!", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-5xl bg-white shadow-2xl h-auto rounded-lg p-8 m-4">
        <h5 className="text-[30px] font-bold text-center text-[#353A5F]">
          Register your Shop
        </h5>
        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
          {/* Shop Name Field */}
          <div className="grid grid-cols-4 gap-4 items-center">
            <label className="text-right text-[#353A5F] col-span-1">
              Shop Name <span className="text-red-500">*</span>:
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-2 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md text-sm placeholder-gray-400 focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
              required
            />
          </div>

          <div className="grid grid-cols-4 gap-4 items-center">
            <label className="text-right text-[#353A5F] col-span-1">
              Phone Number <span className="text-red-500">*</span>:
            </label>
            <input
              type="number"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="col-span-2 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md text-sm placeholder-gray-400 focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
              required
            />
          </div>


          <div className="grid grid-cols-4 gap-4 items-center">
            <label className="text-right text-[#353A5F] col-span-1">
              Shop Address <span className="text-red-500">*</span>:
            </label>
            <input
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="col-span-2 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md text-sm placeholder-gray-400 focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
              required
            />
          </div>

          <div className="grid grid-cols-4 gap-4 items-center">
            <label className="text-right text-[#353A5F] col-span-1">
              Zip Code <span className="text-red-500">*</span>:
            </label>
            <input
              type="text"
              name=" zipCode"
              value={ zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="col-span-2 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md text-sm placeholder-gray-400 focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
              required
            />
          </div>

          {/* Website Field */}
          <div className="grid grid-cols-4 gap-4 items-center">
            <label className="text-right text-[#353A5F] col-span-1">Website:</label>
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="col-span-2 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md text-sm placeholder-gray-400 focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
            />
          </div>

          {/* Services Dropdown */}
          <div className="grid grid-cols-4 gap-4 items-center mt-6">
            <label
              htmlFor="services"
              className="text-right text-[#353A5F] col-span-1"
            >
              Choose a Service <span className="text-red-500">*</span>:
            </label>
            <select
              id="services"
              name="services"
              value={selectedService}
              onChange={handleServiceChange}
              required
              className={`col-span-2 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                !selectedService
                  ? "border-blue-500 focus:ring-blue-500"
                  : "border-gray-300 focus:ring-middleGreen"
              }`}
            >
              <option value="">Select a service</option>
              {servicesList.map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* Social Media Links */}
          <div className="grid grid-cols-4 gap-4 items-center">
            <label className="text-right text-[#353A5F] col-span-1">
              Social Media Links:
            </label>
            <div className="col-span-2 space-y-2">
              <input
                type="text"
                name="facebook"
                placeholder="Facebook"
                value={socialMedia.facebook}
                onChange={(e) =>
                  setSocialMedia({ ...socialMedia, facebook: e.target.value })
                }
                className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md text-sm placeholder-gray-400 focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
              />
              <input
                type="text"
                name="instagram"
                placeholder="Instagram"
                value={socialMedia.instagram}
                onChange={(e) =>
                  setSocialMedia({ ...socialMedia, instagram: e.target.value })
                }
                className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md text-sm placeholder-gray-400 focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
              />
              <input
                type="text"
                name="twitter"
                placeholder="Twitter"
                value={socialMedia.twitter}
                onChange={(e) =>
                  setSocialMedia({ ...socialMedia, twitter: e.target.value })
                }
                className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md text-sm placeholder-gray-400 focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="w-1/2 py-2 mt-2 text-center bg-[#353A5F] text-white rounded-md cursor-pointer hover:bg-[#7DA0CA]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopCreate;
