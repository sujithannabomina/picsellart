import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getThreeRandomPublicImages } from "../utils/storage";

export default function LandingPage() {
  const [images, setImages] = useState([]);
  useEffect(() => { (async()=> {
    try { setImages(await getThreeRandomPublicImages()); }
    catch { setImages(["/images/sample1.jpg","/images/sample2.jpg","/images/sample3.jpg"]); }
  })(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="text-center my-12">
        <h1 className="text-5xl font-extrabold mb-4">Picsellart</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Turn your photos into income. Sellers upload and earn; buyers get licensed, instant downloads.
        </p>
        <div className="flex gap-4 justify-center mt-6">
          <Link to="/buyer/login" className="btn">Buyer Login</Link>
          <Link to="/seller/login" className="btn btn-primary">Become a Seller</Link>
          <Link to="/explore" className="btn btn-secondary">Explore Pictures</Link>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {images.map(src => <img key={src} src={src} className="rounded-2xl w-full h-64 object-cover shadow" />)}
      </section>
    </div>
  );
}
