import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { listImages } from "../utils/storage";
import { watermarkImage } from "../utils/watermark";

export default function PhotoDetails() {
  const { state } = useLocation();
  const { id } = useParams();
  const [photo, setPhoto] = useState(state || null);

  useEffect(() => {
    if (state) return;
    (async () => {
      const imgs = await listImages("public/images");
      const it = imgs.find(x=>x.id===id);
      if (!it) return setPhoto({notFound:true});
      it.thumb = await watermarkImage(it.url, "Picsellart");
      setPhoto(it);
    })();
  }, [id, state]);

  if (!photo) return null;
  if (photo.notFound) return <div className="container"><h2>Not Found</h2></div>;

  return (
    <div className="container">
      <h1>{photo.title} — ₹{photo.price}</h1>
      <img src={photo.thumb} alt={photo.title} style={{width:"100%",maxWidth:900,borderRadius:12}}/>
    </div>
  );
}
