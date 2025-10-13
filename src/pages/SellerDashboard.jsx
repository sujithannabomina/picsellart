import Page from '../components/Page';
import ProtectedRoute from '../components/ProtectedRoute';

export default function SellerDashboard() {
  return (
    <ProtectedRoute requireRole="seller">
      <Page>
        <section className="container">
          <h1>Seller Dashboard</h1>
          <p>Uploads, sales, and plan usage will be shown here.</p>
        </section>
      </Page>
    </ProtectedRoute>
  );
}
