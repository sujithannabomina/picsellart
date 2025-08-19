export default function StatsCard({ label, value }) {
return (
<div className="bg-white border rounded-xl p-4 text-center">
<div className="text-2xl font-bold">{value}</div>
<div className="text-gray-600 text-sm">{label}</div>
</div>
)
}