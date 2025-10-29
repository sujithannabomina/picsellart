import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function SellerDashboard() {
  const Content = () => {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/seller/upload" className="card">Upload Photo</Link>
          <Link to="/seller/photos" className="card">My Photos</Link>
          <Link to="/seller/earnings" className="card">Earnings</Link>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute mustBeSeller mustHavePlan>
      <Content />
    </ProtectedRoute>
  );
}
