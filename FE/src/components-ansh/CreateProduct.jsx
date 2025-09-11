import React, { useState, useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // Get productId from URL
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    category: "",
    tags: "",
    originalPrice: "",
    discountPrice: "",
    shopId: ""
  });

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/product/get-product/${productId}`);
      
      const data = await response.json();
      if (response.ok) {
        setFormData(data.product);
      } else {
        toast.error(data.message || "Failed to fetch product details.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching product details.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newForm = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        newForm.append(key, formData[key]);
      }
    });

    try {
      const url = productId
        ? `http://localhost:3000/api/product/update-product/${productId}`
        : "http://localhost:3000/api/product/create-product";

      const response = await fetch(url, {
        method: productId ? "PUT" : "POST",
        body: newForm,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(productId ? "Product updated successfully!" : "Product created successfully!");
        navigate("/retailer-dashboard");
      } else {
        toast.error(data.message || (productId ? "Failed to update product." : "Failed to create product."));
      }
    } catch (error) {
      toast.error("An error occurred while processing the product.");
    }
  };

 
  return (
    <div className="flex bg-dark justify-center items-center min-h-screen">
      <div className="w-full max-w-5xl bg-slate-100 shadow-4xl h-auto rounded-lg p-8 m-4">
        <h5 className="text-[30px] font-Poppins font-bold text-center text-[#353A5F]">
          {productId ? "Update Product" : "Create Product"}
        </h5>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="grid grid-cols-4 gap-4 items-center mt-6">
            <label className="text-right text-[#353A5F] col-span-1">
              Name <span className="text-red-500">*</span>:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              className="col-span-2 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md text-sm placeholder-gray-400 focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
              onChange={handleChange}
              placeholder="Enter your product name..."
            />
          </div>

          {/* Shop ID Field */}
          <div className="grid grid-cols-4 gap-4 items-center mt-6">
            <label className="text-right text-[#353A5F] col-span-1">
              Shop ID <span className="text-red-500">*</span>:
            </label>
            <input
              type="text"
              name="shopId"
              value={formData.shopId}
              className="col-span-2 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md  text-sm placeholder-gray-400 focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
              onChange={handleChange}
              placeholder="Enter your Shop Id..."
            />
          </div>

          {/* Description Field */}
          <div className="grid grid-cols-4 gap-4 items-center mt-6">
            <label className="text-right text-[#353A5F] col-span-1">
              Description <span className="text-red-500">*</span>:
            </label>
            <textarea
              cols="10"
              required
              rows="3"
              name="description"
              value={formData.description}
              className="col-span-2 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md  text-sm placeholder-gray-400 focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
              onChange={handleChange}
              placeholder="Enter your product description..."
            ></textarea>
          </div>

          {/* Category Field */}
          <div className="grid grid-cols-4 gap-4 items-center mt-6">
            <label className="text-right text-[#353A5F] col-span-1">
              Category <span className="text-red-500">*</span>:
            </label>
            <select
              name="category"
              className="col-span-2 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md  text-sm focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Choose a category</option>
              <option>Electronics</option>
              <option>Medical</option>
              <option>Construction</option>
              {/* Add more categories as needed */}
            </select>
          </div>

          {/* Tags Field */}
          <div className="grid grid-cols-4 gap-4 items-center mt-6">
            <label className="text-right text-[#353A5F] col-span-1">Tags:</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              className="col-span-2 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md  text-sm placeholder-gray-400 focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
              onChange={handleChange}
              placeholder="Enter your product tags..."
            />
          </div>

          {/* Original Price Field */}
          <div className="grid grid-cols-4 gap-4 items-center mt-6">
            <label className="text-right text-[#353A5F] col-span-1">Original Price:</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              className="col-span-2 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md  text-sm placeholder-gray-400 focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
              onChange={handleChange}
              placeholder="Enter your product original price..."
            />
          </div>

          {/* Discount Price Field */}
          <div className="grid grid-cols-4 gap-4 items-center mt-6">
            <label className="text-right text-[#353A5F] col-span-1">
              Price (With Discount) <span className="text-red-500">*</span>:
            </label>
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              className="col-span-2 block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-md  text-sm placeholder-gray-400 focus:outline-none focus:ring-[#7DA0CA] focus:border-[#7DA0CA]"
              onChange={handleChange}
              placeholder="Enter your product price with discount..."
            />
          </div>

          {/* Image Upload Field */}
          <div className="grid grid-cols-4 gap-4 items-center mt-6">
            <label className="text-right text-[#353A5F] col-span-1">
              Upload Image <span className="text-red-500">*</span>:
            </label>
            <input
              type="file"
              name="image"
              id="upload"
              className="hidden"
              onChange={handleChange}
            />
            <div className=" col-span-2">
              <label htmlFor="upload" className="cursor-pointer">
                <AiOutlinePlusCircle size={30} className="mt-3" color="#7DA0CA" />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
  <input
    type="submit"
    value={productId ? "Update" : "Create"}
    className="w-1/2 py-2 mt-2 text-center bg-[#353A5F] text-white rounded-md cursor-pointer hover:bg-[#7DA0CA]"
  />
</div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;