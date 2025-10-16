export default function BuyerDashboard(){
  return (
    <main className="container page">
      <h1>Buyer Dashboard</h1>
      <section className="card" style={{padding:18}}>
        <p className="small-muted">No purchases yet.</p>
        <div>
          <a className="btn btn-primary" href="/explore">Explore &amp; Buy</a>
        </div>
      </section>
    </main>
  );
}
