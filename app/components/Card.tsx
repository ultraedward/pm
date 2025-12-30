export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-6 bg-white">
      {children}
    </div>
  )
}
