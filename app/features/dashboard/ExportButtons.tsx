"use client";

export default function ExportButtons({ hours }: { hours: number }) {
  function download(url: string) {
    window.location.href = url;
  }

  return (
    <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
      <button
        onClick={() =>
          download(`/api/export/prices?metal=Gold&hours=${hours}`)
        }
      >
        Export Gold Prices CSV
      </button>

      <button
        onClick={() =>
          download(`/api/export/triggers?hours=${hours}`)
        }
      >
        Export Alert Triggers CSV
      </button>
    </div>
  );
}
