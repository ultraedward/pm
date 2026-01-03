import MetalChart from "@/app/components/MetalChart";

export default function ChartsPage() {
  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-3xl font-semibold mb-6">Price Charts</h1>
      <MetalChart />
    </div>
  );
}
