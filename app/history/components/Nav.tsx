export default function Nav({ current }: { current: "live" | "history" }) {
  const linkStyle = (active: boolean) => ({
    padding: "6px 10px",
    border: "1px solid #000",
    textDecoration: "none",
    fontWeight: 600,
    background: active ? "#000" : "#fff",
    color: active ? "#fff" : "#000",
  })

  return (
    <nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <a href="/live" style={linkStyle(current === "live")}>
        Live
      </a>
      <a href="/history" style={linkStyle(current === "history")}>
        History
      </a>
    </nav>
  )
}
