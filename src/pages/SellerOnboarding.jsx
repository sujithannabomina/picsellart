import Page from '../components/Page';
import ProtectedRoute from '../components/ProtectedRoute';
import { Link } from 'react-router-dom';

// shows plan cards, your existing UI can stay; this is just to ensure it renders
export default function SellerOnboarding() {
  return (
    <ProtectedRoute>
      <Page>
        <section className="container">
          <h1>Choose a Seller Plan</h1>
          <div className="plans">
            <div className="card">
              <h3>Starter</h3>
              <p>₹100 – 50 uploads</p>
              <Link className="btn" to="/seller/subscribe?plan=starter">Continue</Link>
            </div>
            <div className="card">
              <h3>Plus</h3>
              <p>₹299 – 100 uploads</p>
              <Link className="btn" to="/seller/subscribe?plan=plus">Continue</Link>
            </div>
            <div className="card">
              <h3>Pro</h3>
              <p>₹799 – 300 uploads</p>
              <Link className="btn" to="/seller/subscribe?plan=pro">Continue</Link>
            </div>
          </div>
        </section>
      </Page>
    </ProtectedRoute>
  );
}
