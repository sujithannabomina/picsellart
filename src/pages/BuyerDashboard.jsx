import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthProvider";

function Content(){
  const { user } = useAuth();
  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold my-8">Buyer Dashboard</h2>
      <p>Welcome {user?.email}. Your orders will appear here after purchase.</p>
    </div>
  );
}
export default function BuyerDashboard(){
  return <ProtectedRoute requireRole="buyer"><Content/></ProtectedRoute>;
}
