//ye wala ansh ne kiya h

// import React, { useEffect } from 'react'
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import ShopCreate from "../components-ansh/ShopCreate";

// const ShopCreatePage = () => {
//   const navigate = useNavigate();
//   const { isSeller,seller } = useSelector((state) => state.seller);

//   useEffect(() => {
//     if(isSeller === true){
//       navigate(`/shop/${seller._id}`);
//     }
//   }, [])
//   return (
//     <div>
//         <ShopCreate />
//     </div>
//   )
// }

// export default ShopCreatePage

//ye wala part ritu ne kiya h
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShopCreate from "../components-ansh/ShopCreate";

const ShopCreatePage = () => {
  const navigate = useNavigate();
  const { isSeller, seller } = useSelector((state) => state.seller);

  // Redirect to shop page if the user already has a shop
  useEffect(() => {
    if (isSeller === true && seller?._id) {
      navigate(`/shop/${seller._id}`);
    }
  }, [isSeller, seller, navigate]); // Add proper dependencies

  return (
    <div>
      <ShopCreate />
    </div>
  );
}

export default ShopCreatePage;
