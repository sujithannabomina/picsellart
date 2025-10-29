import ProtectedRoute from "../components/ProtectedRoute";
export default function SellerDashboard(){
  return (
    <ProtectedRoute need="seller">
      <div className="container">
        <h1>Seller Dashboard</h1>
        <p>Upload photos, view earnings, manage listings (coming next).</p>
      </div>
    </ProtectedRoute>
  );
}
