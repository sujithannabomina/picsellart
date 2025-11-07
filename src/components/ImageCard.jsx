// src/components/ImageCard.jsx
import WatermarkedImage from "./WatermarkedImage";
import { priceToINR } from "../utils/exploreData";

export default function ImageCard({ item, onBuy }) {
  return (
    <div className="rounded-xl overflow-hidden border bg-white shadow-sm">
      <WatermarkedImage
        src={item.url}
        alt={item.name}
        className="aspect-[4/3]"
      />
      <div className="p-3 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{item.title}</div>
          <div className="font-semibold">{item.name}</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-indigo-700">{priceToINR(item.price)}</div>
          <button
            className="mt-2 inline-flex items-center px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
            onClick={() => onBuy(item)}
          >
            Buy & Download
          </button>
        </div>
      </div>
    </div>
  );
}
