import { useEffect, useMemo, useState } from "react";
import WatermarkedImage from "../components/WatermarkedImage";
import { listExplorePage } from "../utils/storage";

export default function Explore() {
  const [query, setQuery] = useState("");
  const [pageToken, setPageToken] = useState(undefined);
  const [nextToken, setNextToken] = useState(undefined);
  const [stack, setStack] = useState([]); // history of tokens for back nav
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setBusy(true);
      try {
        const { items, nextPageToken } = await listExplorePage({ pageSize: 24, pageToken });
        if (!ignore) {
          setItems(items);
          setNextToken(nextPageToken);
        }
      } finally {
        if (!ignore) setBusy(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [pageToken]);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      String(i.price).includes(q)
    );
  }, [items, query]);

  function next() {
    if (!nextToken) return;
    setStack((s) => [...s, pageToken || null]);
    setPageToken(nextToken);
  }

  function prev() {
    if (stack.length === 0) return;
    const copy = [...stack];
    const prevTok = copy.pop() ?? undefined;
    setStack(copy);
    setPageToken(prevTok);
  }

  return (
    <main className="container page">
      <h1>Explore Pictures</h1>
      <div className="explore-toolbar">
        <input
          className="input"
          placeholder="Search by title or tag..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {busy ? (
        <p style={{color: "var(--muted)"}}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={{color: "var(--muted)"}}>No results.</p>
      ) : (
        <>
          <section className="grid" aria-live="polite">
            {filtered.map((it) => (
              <article className="tile" key={it.id}>
                <WatermarkedImage src={it.url} alt={it.title} overlay={it.overlay} />
                <div className="meta">
                  <div className="row">
                    <span>{it.title}</span>
                    <span className="price">₹{it.price}</span>
                  </div>
                  <div className="row">
                    <a className="btn" href={`/photo/${encodeURIComponent(it.id)}`}>View</a>
                    <a className="btn btn-primary" href={`/buy/${encodeURIComponent(it.id)}`}>Buy</a>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <div className="pagination">
            <button className="btn" onClick={prev} disabled={stack.length === 0}>Previous</button>
            <button className="btn" onClick={next} disabled={!nextToken}>Next</button>
          </div>
        </>
      )}
    </main>
  );
}
