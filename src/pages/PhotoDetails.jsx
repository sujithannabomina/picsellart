import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicImageByName } from "../utils/storage";
import WatermarkedImage from "../components/WatermarkedImage";

export default function PhotoDetails() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getPublicImageByName(id);
      if (mounted) setPhoto(data || null);
    })();
    return () => { mounted = false; };
  }, [id]);

  if (!photo) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-3">{photo.name}</h1>
      <WatermarkedImage src={photo.downloadURL} alt={photo.name} />
    </div>
  );
}
