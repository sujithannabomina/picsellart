import Page from '../components/Page';
import ProtectedRoute from '../components/ProtectedRoute';

export default function BuyerDashboard() {
  return (
    <ProtectedRoute requireRole="buyer">
      <Page>
        <section className="container">
          <h1>Buyer Dashboard</h1>
          <p>Your likes, orders and downloads will appear here.</p>
        </section>
      </Page>
    </ProtectedRoute>
  );
}
