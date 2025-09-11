import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const SellerProtectedRoute = ({ children }) => {
  // Access the seller state with default values
  const { isSeller } = useSelector((state) => state.seller || {});

  // Check if the seller is authenticated
  if (!isSeller) {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated
  return children;
};

export default SellerProtectedRoute;
