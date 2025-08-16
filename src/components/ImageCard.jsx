// src/components/ImageCard.jsx
export default function ImageCard({ item }) {
  const displayPrice =
    typeof item.price === "number" && !Number.isNaN(item.price)
      ? `₹${item.price.toFixed(2)}`
      : null;

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="aspect-[4/3] bg-gray-100">
        <img
          src={item.url}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
        <div className="mt-2 flex items-center gap-2">
          {displayPrice && (
            <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              {displayPrice}
            </span>
          )}
          <span className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {item.category || "uncategorized"}
          </span>
        </div>
      </div>
    </div>
  );
}
