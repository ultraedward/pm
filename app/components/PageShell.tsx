// app/components/PageShell.tsx

export default function PageShell({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {children}
    </div>
  )
}
