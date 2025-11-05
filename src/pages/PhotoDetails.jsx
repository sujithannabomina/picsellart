import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicImageByName } from "../utils/storage";
import WatermarkedImage from "../components/WatermarkedImage";

export default function PhotoDetails() {
  const { name } = useParams();
  const [img, setImg] = useState(null);

  useEffect(() => {
    setImg(getPublicImageByName(name));
  }, [name]);

  if (!img) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">Not found</h1>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-4">{img.name}</h1>
      <WatermarkedImage src={img.url} alt={img.name} />
    </main>
  );
}
