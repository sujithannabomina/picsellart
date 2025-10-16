import { Link } from "react-router-dom";

export default function SellerLogin(){
  return (
    <main className="center container">
      <section className="card-auth">
        <h1>Seller Login / Sign Up</h1>
        <div className="small-muted">Use your Google account, then pick a seller pack.</div>
        <button className="btn btn-primary" onClick={() => window.location.href="/seller/plan"}>
          Continue with Google
        </button>
        <div style={{marginTop:14}}>
          <Link className="btn" to="/">Back to Home</Link>
        </div>
      </section>
    </main>
  );
}
