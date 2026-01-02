// src/pages/ViewPhoto.jsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ViewPhoto() {
  const navigate = useNavigate();
  const { id } = useParams();

  const item = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("psa:selectedItem");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.id === id) return parsed;
      return parsed; // still show if user refreshed
    } catch {
      return null;
    }
  }, [id]);

  if (!item) {
    return (
      <main className="page">
        <h1>Photo</h1>
        <p className="muted">We couldn’t load this photo. Please return to Explore and open again.</p>
        <button className="btn btn-primary" onClick={() => navigate("/explore")}>
          Back to Explore
        </button>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="page-head">
        <h1 style={{ marginBottom: 6 }}>{item.title || "Photo"}</h1>
        <div className="muted">{item.filename}</div>
      </section>

      <section className="viewer">
        <div className="viewer-card">
          <img src={item.imageUrl} alt={item.title || "Photo"} />
        </div>

        <div className="viewer-bar">
          <div className="price">₹{item.price}</div>
          <div className="muted">{item.license || "Standard digital license"}</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button className="btn btn-small" onClick={() => navigate(-1)}>
              Back
            </button>
            <button className="btn btn-small btn-primary" onClick={() => navigate(`/checkout/${encodeURIComponent(item.id)}`)}>
              Buy Now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
