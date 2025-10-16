import { Link } from "react-router-dom";

export default function BuyerLogin(){
  return (
    <main className="center container">
      <section className="card-auth">
        <h1>Buyer Login / Sign Up</h1>
        <div className="small-muted">Use your Google account to continue.</div>
        <button className="btn btn-primary" onClick={() => window.location.href="/api/createOrder?mode=buyer"}>
          Continue with Google
        </button>
        <div style={{marginTop:14}}>
          <Link className="btn" to="/">Back to Home</Link>
        </div>
      </section>
    </main>
  );
}
