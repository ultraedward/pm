export default function PriceDelta({ delta }: { delta: number }) {
  const up = delta >= 0;
  return (
    <span className={`badge ${up ? "badge-green" : "badge-red"}`}>
      {up ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}%
    </span>
  );
}
