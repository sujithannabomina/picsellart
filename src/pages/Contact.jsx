export default function Contact() {
  return (
    <main className="container page">
      <h1>Contact</h1>
      <form
        onSubmit={(e) => { e.preventDefault(); alert("Thanks! We received your message."); }}
        className="card"
        style={{padding:"18px"}}
      >
        <div style={{display:"grid", gap:"12px", gridTemplateColumns:"1fr 1fr"}}>
          <input className="input" type="email" placeholder="Your email" required />
          <select className="input" defaultValue="Suggestion">
            <option>Suggestion</option>
            <option>Report a bug</option>
            <option>Billing</option>
            <option>Other</option>
          </select>
        </div>
        <textarea className="input" rows={6} placeholder="Write your message..." style={{marginTop:12}}/>
        <div style={{marginTop:12}}>
          <button className="btn btn-primary" type="submit">Send</button>
        </div>
      </form>
    </main>
  );
}
