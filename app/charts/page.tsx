export const dynamic = "force-dynamic";

export default function ChartsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Charts</h1>

      <div className="rounded border p-4 text-gray-600">
        Charts are temporarily disabled.
        <br />
        They will automatically appear once historical spot price data is enabled.
      </div>
    </div>
  );
}
