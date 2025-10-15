import { PRICE_PLANS } from "../utils/plans";
export default function PriceInput({ planId, value, onChange }) {
  const plan = PRICE_PLANS.find(p => p.id === planId);
  const max = plan ? plan.maxPricePerPhoto : 199;
  const choices = [99,149,199,299,399,499,599,799,999].filter(x => x<=max);
  return (
    <select className="border rounded px-3 py-2" value={value} onChange={e=>onChange(Number(e.target.value)||"")}>
      <option value="">Select Price</option>
      {choices.map(v => <option key={v} value={v}>₹{v}</option>)}
    </select>
  );
}
