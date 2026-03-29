export const metadata = {
  title: "Back soon — Lode",
  robots: "noindex",
};

export default function MaintenancePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <p className="text-xs tracking-widest uppercase mb-8" style={{ color: "var(--gold)" }}>
        LODE
      </p>

      <h1 className="text-3xl font-black tracking-tight mb-4">
        Back in a moment
      </h1>

      <p className="text-sm max-w-xs leading-relaxed" style={{ color: "var(--muted)" }}>
        We're making some improvements. Check back shortly.
      </p>
    </div>
  );
}
