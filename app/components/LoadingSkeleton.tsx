// app/components/LoadingSkeleton.tsx
export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-56 rounded-xl bg-gray-900 border border-gray-800"
        />
      ))}
    </div>
  );
}
